import { memo, useMemo, useRef } from "react";

import { usePlane } from "@react-three/cannon"
import { useLoader, useFrame } from "@react-three/fiber"

import { TextureLoader, RepeatWrapping, DoubleSide, Object3D, Color } from 'three'
import { useAssetGalleryStore } from "@/hooks/useAssetGalleryStore";
import { useStore } from "@/hooks/useStore";

const BLADE_WIDTH = 0.04;
const BLADE_HEIGHT_MIN = 0.08;
const BLADE_HEIGHT_MAX = 0.25;

const QUALITY_SETTINGS = {
    Low:    { visibleRadius: 5,  density: 0.8 },
    Medium: { visibleRadius: 10, density: 1.0 },
    High:   { visibleRadius: 15, density: 1.2 },
};

const GRASS_AREA = 50; // half-extent of the grass field
const BLADE_SPACING = 0.3; // approximate spacing between blades

// Pre-generate all static blade positions covering the ground
const allBlades = (() => {
    const data = [];
    for (let x = -GRASS_AREA; x < GRASS_AREA; x += BLADE_SPACING) {
        for (let z = -GRASS_AREA; z < GRASS_AREA; z += BLADE_SPACING) {
            const jitterX = x + (Math.random() - 0.5) * BLADE_SPACING;
            const jitterZ = z + (Math.random() - 0.5) * BLADE_SPACING;
            const height = BLADE_HEIGHT_MIN + Math.random() * (BLADE_HEIGHT_MAX - BLADE_HEIGHT_MIN);
            const rotY = Math.random() * Math.PI;
            const color = new Color().setHSL(
                0.25 + Math.random() * 0.08,
                0.5 + Math.random() * 0.3,
                0.25 + Math.random() * 0.15
            );
            data.push({ x: jitterX, z: jitterZ, height, rotY, r: color.r, g: color.g, b: color.b });
        }
    }
    return data;
})();

const MAX_VISIBLE_BLADES = 60000;

const GrassBlades = () => {

    const meshRef = useRef();
    const dummy = useMemo(() => new Object3D(), []);
    const timeRef = useRef(0);

    const graphicsQuality = useStore(state => state.graphicsQuality);
    const playerPosition = useAssetGalleryStore(state => state.position);

    const { visibleRadius, density } = QUALITY_SETTINGS[graphicsQuality] || QUALITY_SETTINGS.Medium;

    const colorsRef = useRef(new Float32Array(MAX_VISIBLE_BLADES * 3));

    useFrame((_, delta) => {
        if (!meshRef.current) return;
        timeRef.current += delta;

        const px = playerPosition[0];
        const pz = playerPosition[2];
        const rSq = visibleRadius * visibleRadius;
        const densitySq = (BLADE_SPACING / density) * (BLADE_SPACING / density);

        let count = 0;
        const cols = colorsRef.current;

        for (let i = 0; i < allBlades.length && count < MAX_VISIBLE_BLADES; i++) {
            const blade = allBlades[i];
            const dx = blade.x - px;
            const dz = blade.z - pz;
            const distSq = dx * dx + dz * dz;

            if (distSq > rSq) continue;

            // Skip some blades at lower density
            if (density < 1.0 && distSq > densitySq && (i & 1)) continue;

            const sway = Math.sin(timeRef.current * 1.5 + blade.x * 0.5 + blade.z * 0.3) * 0.06;
            dummy.position.set(blade.x, -1 + blade.height / 2, blade.z);
            dummy.rotation.set(sway, blade.rotY, sway * 0.5);
            dummy.scale.set(BLADE_WIDTH, blade.height, BLADE_WIDTH);
            dummy.updateMatrix();
            meshRef.current.setMatrixAt(count, dummy.matrix);

            cols[count * 3] = blade.r;
            cols[count * 3 + 1] = blade.g;
            cols[count * 3 + 2] = blade.b;

            count++;
        }

        // Hide remaining instances by scaling to zero
        if (count < meshRef.current.count) {
            dummy.scale.set(0, 0, 0);
            dummy.updateMatrix();
            for (let i = count; i < meshRef.current.count; i++) {
                meshRef.current.setMatrixAt(i, dummy.matrix);
            }
        }

        meshRef.current.count = count;
        meshRef.current.instanceMatrix.needsUpdate = true;

        // Update colors
        const colorAttr = meshRef.current.geometry.getAttribute('color');
        if (colorAttr) {
            colorAttr.array.set(cols.subarray(0, count * 3));
            colorAttr.needsUpdate = true;
        }
    });

    return (
        <instancedMesh ref={meshRef} args={[null, null, MAX_VISIBLE_BLADES]} frustumCulled={false}>
            <planeGeometry args={[1, 1]} />
            <meshStandardMaterial
                side={DoubleSide}
                vertexColors
                alphaTest={0.5}
            />
            <instancedBufferAttribute attach="geometry-attributes-color" args={[colorsRef.current, 3]} />
        </instancedMesh>
    );
};

const Ground = () => {

    const galleryTheme = useAssetGalleryStore(state => state.galleryTheme);

    const [ref] = usePlane(() => ({
        rotation: [-Math.PI / 2, 0, 0], position: [0, -1, 0]
    }))

    const [baseColor, normal, roughness, ao, metallic] = useLoader(TextureLoader, [
        '/textures/grass/Poliigon_GrassPatchyGround_4585_BaseColor.jpg',
        '/textures/grass/Poliigon_GrassPatchyGround_4585_Normal.png',
        '/textures/grass/Poliigon_GrassPatchyGround_4585_Roughness.jpg',
        '/textures/grass/Poliigon_GrassPatchyGround_4585_AmbientOcclusion.jpg',
        '/textures/grass/Poliigon_GrassPatchyGround_4585_Metallic.jpg'
    ])

    useMemo(() => {
        [baseColor, normal, roughness, ao, metallic].forEach(texture => {
            texture.wrapS = RepeatWrapping
            texture.wrapT = RepeatWrapping
            texture.repeat.set(100, 100)
        })
    }, [baseColor, normal, roughness, ao, metallic])

    return (
        <>
            <mesh ref={ref}>
                <planeGeometry attach='geometry' args={[100, 100]} />
                <meshStandardMaterial
                    attach="material"
                    map={baseColor}
                    normalMap={normal}
                    roughnessMap={roughness}
                    aoMap={ao}
                    metalnessMap={metallic}
                    aoMapIntensity={1}
                />
            </mesh>
            {galleryTheme === "Forest" && <GrassBlades />}
        </>
    )
}

// const arePropsEqual = (prevProps, nextProps) => {
//     // Compare all props for equality
//     return JSON.stringify(prevProps) === JSON.stringify(nextProps);
// };

const MemoizedGround = memo(
    Ground,
    // arePropsEqual
);

export default MemoizedGround