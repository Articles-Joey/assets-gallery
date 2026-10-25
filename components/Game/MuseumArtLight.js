import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
    AdditiveBlending,
    Color,
    CylinderGeometry,
    DoubleSide,
    Object3D,
    Quaternion,
    ShaderMaterial,
    Vector3,
} from "three";
import { useAssetGalleryStore } from "@/hooks/useAssetGalleryStore";
import { CORRIDOR_WIDTH_SCALE, MUSEUM_LAYOUT } from "./sceneLayout";
import { getMuseumRoofLayout } from "./museumRoofLayout";

export function getMuseumArtFixture(section_spacing) {
    const roof = getMuseumRoofLayout(section_spacing);
    const x = MUSEUM_LAYOUT.width * CORRIDOR_WIDTH_SCALE * 0.34;
    const ceilingY = roof.ridgeY - x * Math.tan(roof.angle);
    const position = new Vector3(x, ceilingY - 0.28, 0);
    const target = new Object3D();
    target.position.set(
        (MUSEUM_LAYOUT.width * CORRIDOR_WIDTH_SCALE) / 2 - 0.14,
        0.72 - MUSEUM_LAYOUT.originY,
        0,
    );
    const direction = target.position.clone().sub(position).normalize();
    return {
        position: position.toArray(),
        lens: position.clone().addScaledVector(direction, 0.02).toArray(),
        housing: position.clone().addScaledVector(direction, -0.1).toArray(),
        target,
        rotation: new Quaternion().setFromUnitVectors(
            new Vector3(0, 1, 0),
            direction,
        ),
        coneRotation: new Quaternion().setFromUnitVectors(
            new Vector3(0, 0, 1),
            direction,
        ),
        ceilingY,
        x,
        beamLength: position.distanceTo(target.position),
        distance: position.distanceTo(target.position) + 1.4,
    };
}

let coneMaterial;
function getConeMaterial() {
    if (!coneMaterial)
        coneMaterial = new ShaderMaterial({
            uniforms: { lightColor: { value: new Color("#fff0d6") } },
            transparent: true,
            depthWrite: false,
            blending: AdditiveBlending,
            side: DoubleSide,
            toneMapped: false,
            vertexShader: `
            varying vec3 vConeNormal;
            varying vec3 vConeView;
            varying float vConeFade;
            void main() {
                vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
                vConeNormal = normalize(normalMatrix * normal);
                vConeView = -viewPosition.xyz;
                vConeFade = uv.y;
                gl_Position = projectionMatrix * viewPosition;
            }
        `,
            fragmentShader: `
            uniform vec3 lightColor;
            varying vec3 vConeNormal;
            varying vec3 vConeView;
            varying float vConeFade;
            void main() {
                float softEdge = pow(abs(dot(normalize(vConeNormal), normalize(vConeView))), 2.0);
                float alpha = softEdge * pow(max(vConeFade, 0.0), 0.65) * 0.12;
                gl_FragColor = vec4(lightColor, alpha);
                #include <colorspace_fragment>
            }
        `,
        });
    return coneMaterial;
}

export default function MuseumArtLight({ section_i, section_spacing }) {
    const cone = useRef();
    const fixture = useMemo(
        () => getMuseumArtFixture(section_spacing),
        [section_spacing],
    );
    const geometry = useMemo(() => {
        // 48 triangles, instead of the previous volumetric light's 16,384.
        const result = new CylinderGeometry(
            0.055,
            Math.tan(0.43) * fixture.beamLength,
            fixture.beamLength,
            24,
            1,
            true,
        );
        result.translate(0, -fixture.beamLength / 2, 0);
        result.rotateX(-Math.PI / 2);
        return result;
    }, [fixture]);
    const material = useMemo(() => getConeMaterial(), []);
    useEffect(() => () => geometry.dispose(), [geometry]);
    useFrame(() => {
        if (cone.current)
            cone.current.visible =
                Math.abs(
                    useAssetGalleryStore.getState().position[2] +
                        section_i * section_spacing,
                ) <=
                section_spacing * 2;
    });

    return (
        <group
            scale={[1 / CORRIDOR_WIDTH_SCALE, 1, 1]}
            name="museum-art-fixture"
        >
            <mesh
                position={[fixture.x, fixture.ceilingY - 0.06, 0]}
                receiveShadow
            >
                <boxGeometry args={[0.1, 0.08, section_spacing]} />
                <meshStandardMaterial
                    color="#302e29"
                    metalness={0.6}
                    roughness={0.4}
                />
            </mesh>
            <mesh position={[fixture.x, fixture.ceilingY - 0.17, 0]}>
                <cylinderGeometry args={[0.023, 0.023, 0.18, 8]} />
                <meshStandardMaterial
                    color="#353633"
                    metalness={0.65}
                    roughness={0.4}
                />
            </mesh>
            <mesh
                position={fixture.housing}
                quaternion={fixture.rotation}
            >
                <cylinderGeometry args={[0.085, 0.11, 0.22, 12]} />
                <meshStandardMaterial
                    color="#343a36"
                    metalness={0.65}
                    roughness={0.32}
                />
            </mesh>
            <mesh
                position={fixture.lens}
                quaternion={fixture.rotation}
            >
                <cylinderGeometry args={[0.075, 0.075, 0.008, 12]} />
                <meshBasicMaterial
                    color="#fff1d5"
                    toneMapped={false}
                />
            </mesh>
            <mesh
                ref={cone}
                position={fixture.position}
                quaternion={fixture.coneRotation}
                geometry={geometry}
                raycast={() => null}
            >
                <primitive
                    object={material}
                    attach="material"
                    dispose={null}
                />
            </mesh>
        </group>
    );
}
