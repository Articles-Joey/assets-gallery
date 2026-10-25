import { memo, useEffect, useMemo } from "react";
import { Base, Geometry, Subtraction } from "@react-three/csg";
import { BoxGeometry, ExtrudeGeometry, Shape } from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { CORRIDOR_WIDTH_SCALE } from "./sceneLayout";
import { getMuseumRoofLayout } from "./museumRoofLayout";
import { createTimberGeometry, getKioskWoodMaps } from "./kioskWood";

function RoofTimber({ position, size, rotation = [0, 0, 0] }) {
    const [width, height, depth] = size;
    const geometry = useMemo(
        () => createTimberGeometry([width, height, depth]),
        [width, height, depth],
    );
    const maps = useMemo(() => getKioskWoodMaps(), []);
    useEffect(() => () => geometry.dispose(), [geometry]);
    return (
        <mesh
            position={position}
            rotation={rotation}
            geometry={geometry}
            castShadow
            receiveShadow
        >
            <meshPhysicalMaterial
                {...maps}
                color="#655a53"
                roughness={0.7}
                bumpScale={0.003}
                clearcoat={0.18}
                clearcoatRoughness={0.45}
            />
        </mesh>
    );
}

function RoofMetal({ color = "#28786f", roughness = 0.23 }) {
    return (
        <meshPhysicalMaterial
            color={color}
            metalness={0.88}
            roughness={roughness}
            clearcoat={0.65}
            clearcoatRoughness={0.18}
            envMapIntensity={1.25}
        />
    );
}

function RoofSeams({ roof, section_spacing, section_i }) {
    const seams = useMemo(() => {
        const result = [];
        const moduleCenterZ = -section_i * section_spacing;
        const startZ = moduleCenterZ - section_spacing / 2;
        const endZ = moduleCenterZ + section_spacing / 2;
        const seamSpacing = 0.45;
        const cutCenter = roof.skylightX / Math.cos(roof.angle);
        for (
            let z = Math.ceil(startZ / seamSpacing) * seamSpacing;
            z < endZ - 0.0001;
            z += seamSpacing
        ) {
            const localZ = z - moduleCenterZ;
            const crossesSkylight =
                Math.abs(localZ) < roof.skylightDepth / 2 + 0.05;
            const segments = crossesSkylight
                ? [
                      [0, cutCenter - roof.skylightWidth / 2 - 0.045],
                      [
                          cutCenter + roof.skylightWidth / 2 + 0.045,
                          roof.slopeLength,
                      ],
                  ]
                : [[0, roof.slopeLength]];
            for (const side of [-1, 1]) {
                for (const [start, end] of segments) {
                    if (end <= start) continue;
                    const middle = (start + end) / 2;
                    result.push({
                        position: [
                            side *
                                (middle * Math.cos(roof.angle) +
                                    Math.sin(roof.angle) * 0.015),
                            roof.ridgeY -
                                middle * Math.sin(roof.angle) +
                                roof.thickness +
                                Math.cos(roof.angle) * 0.015,
                            localZ,
                        ],
                        length: end - start,
                        side,
                    });
                }
            }
        }
        return result;
    }, [roof, section_spacing, section_i]);

    const geometry = useMemo(() => {
        if (seams.length === 0) return null;
        const parts = seams.map((seam) => {
            const part = new BoxGeometry(seam.length, 0.03, 0.025);
            part.rotateZ(-seam.side * roof.angle);
            part.translate(...seam.position);
            return part;
        });
        const result = mergeGeometries(parts, false);
        parts.forEach((part) => part.dispose());
        return result;
    }, [seams, roof.angle]);
    useEffect(() => () => geometry?.dispose(), [geometry]);
    if (!geometry) return null;

    return (
        <mesh
            geometry={geometry}
            receiveShadow
        >
            <RoofMetal
                color="#3c9184"
                roughness={0.19}
            />
        </mesh>
    );
}

function Skylight({ roof, side }) {
    const surfaceOffset = (roof.thickness * Math.cos(roof.angle)) / 2;
    const normalX = side * Math.sin(roof.angle);
    const normalY = Math.cos(roof.angle);
    return (
        <group
            position={[
                side * roof.skylightX + normalX * surfaceOffset,
                roof.skylightY + normalY * surfaceOffset,
                0,
            ]}
            rotation={[0, 0, -side * roof.angle]}
            name="museum-skylight"
        >
            <mesh>
                <boxGeometry
                    args={[
                        roof.skylightWidth - 0.025,
                        0.018,
                        roof.skylightDepth - 0.025,
                    ]}
                />
                <meshPhysicalMaterial
                    color="#bddce2"
                    transparent
                    opacity={0.28}
                    roughness={0.12}
                    metalness={0}
                    clearcoat={0.7}
                    depthWrite={false}
                />
            </mesh>
            {[-1, 1].map((edge) => (
                <group key={edge}>
                    <mesh
                        position={[(edge * roof.skylightWidth) / 2, 0.02, 0]}
                        castShadow
                        receiveShadow
                    >
                        <boxGeometry
                            args={[0.065, 0.075, roof.skylightDepth + 0.065]}
                        />
                        <meshStandardMaterial
                            color="#34403b"
                            metalness={0.65}
                            roughness={0.35}
                        />
                    </mesh>
                    <mesh
                        position={[0, 0.02, (edge * roof.skylightDepth) / 2]}
                        castShadow
                        receiveShadow
                    >
                        <boxGeometry
                            args={[roof.skylightWidth - 0.065, 0.075, 0.065]}
                        />
                        <meshStandardMaterial
                            color="#34403b"
                            metalness={0.65}
                            roughness={0.35}
                        />
                    </mesh>
                </group>
            ))}
        </group>
    );
}

function MuseumRoof({ section_spacing, section_i = 0, isLast }) {
    const roof = useMemo(
        () => getMuseumRoofLayout(section_spacing),
        [section_spacing],
    );
    const shell = useMemo(() => {
        // A single closed shell joins both slopes at the ridge without overlap.
        const profile = new Shape();
        profile.moveTo(-roof.outerHalfWidth, roof.outerEaveY);
        profile.lineTo(0, roof.ridgeY);
        profile.lineTo(roof.outerHalfWidth, roof.outerEaveY);
        profile.lineTo(roof.outerHalfWidth, roof.outerEaveY + roof.thickness);
        profile.lineTo(0, roof.ridgeY + roof.thickness);
        profile.lineTo(-roof.outerHalfWidth, roof.outerEaveY + roof.thickness);
        profile.closePath();
        const geometry = new ExtrudeGeometry(profile, {
            depth: section_spacing,
            bevelEnabled: false,
            steps: 1,
            curveSegments: 1,
        });
        geometry.translate(0, 0, -section_spacing / 2);
        return geometry;
    }, [roof, section_spacing]);
    useEffect(() => () => shell.dispose(), [shell]);

    return (
        <group
            scale={[1 / CORRIDOR_WIDTH_SCALE, 1, 1]}
            name="museum-pitched-roof"
        >
            <mesh
                castShadow
                receiveShadow
                userData={{ cameraObstacle: true }}
            >
                <Geometry key={section_spacing}>
                    <Base geometry={shell} />
                    {[-1, 1].map((side) => (
                        <Subtraction
                            key={side}
                            position={[
                                side * roof.skylightX,
                                roof.skylightY,
                                0,
                            ]}
                            rotation={[0, 0, -side * roof.angle]}
                        >
                            <boxGeometry
                                args={[
                                    roof.skylightWidth,
                                    roof.thickness * 6,
                                    roof.skylightDepth,
                                ]}
                            />
                        </Subtraction>
                    ))}
                </Geometry>
                <RoofMetal />
            </mesh>
            <RoofSeams
                roof={roof}
                section_spacing={section_spacing}
                section_i={section_i}
            />
            <mesh
                position={[0, roof.ridgeY + roof.thickness + 0.035, 0]}
                castShadow
                receiveShadow
            >
                <boxGeometry args={[0.16, 0.07, section_spacing]} />
                <RoofMetal
                    color="#276b61"
                    roughness={0.22}
                />
            </mesh>
            {[-1, 1].map((side) => (
                <group key={side}>
                    <Skylight
                        roof={roof}
                        side={side}
                    />
                    <RoofTimber
                        position={[
                            side * roof.outerHalfWidth,
                            roof.outerEaveY + 0.01,
                            0,
                        ]}
                        size={[0.12, 0.22, section_spacing]}
                    />
                    {(isLast ? [-1, 1] : [1]).map((end) => (
                        <RoofTimber
                            key={end}
                            position={[
                                (side * roof.outerHalfWidth) / 2,
                                roof.slopeCenterY - roof.thickness / 2 - 0.09,
                                (end * section_spacing) / 2,
                            ]}
                            rotation={[0, 0, -side * roof.angle]}
                            size={[roof.slopeLength, 0.16, 0.14]}
                        />
                    ))}
                </group>
            ))}
            <RoofTimber
                position={[0, roof.ridgeY - 0.1, 0]}
                size={[0.18, 0.2, section_spacing]}
            />
        </group>
    );
}

export default memo(MuseumRoof);
