import { memo, useEffect, useMemo, useRef } from "react";

import { usePlane } from "@react-three/cannon";
import { useLoader } from "@react-three/fiber";

import { PlaneGeometry, TextureLoader, RepeatWrapping } from "three";
import { useAssetGalleryStore } from "@/hooks/useAssetGalleryStore";
import { useStore } from "@/hooks/useStore";
import GrassArea from "./GrassArea";
import MuseumGrass from "./MuseumGrass";
import {
    CORRIDOR_WIDTH_SCALE,
    SCENE_HALF_SIZE,
    getMuseumSiteBounds,
} from "./sceneLayout";

const Ground = () => {
    const galleryTheme = useAssetGalleryStore((state) => state.galleryTheme);
    const setTouchTarget = useAssetGalleryStore(
        (state) => state.setTouchTarget,
    );
    const controlType = useStore((state) => state.controlType);
    const assetCount = useStore((state) => state.assets?.length ?? 0);
    const site =
        galleryTheme === "Museum"
            ? getMuseumSiteBounds(assetCount)
            : { minZ: -SCENE_HALF_SIZE, maxZ: SCENE_HALF_SIZE };
    const { minZ, maxZ } = site;
    const groundGeometry = useMemo(() => {
        const geometry = new PlaneGeometry(SCENE_HALF_SIZE * 2, maxZ - minZ);
        geometry.translate(0, -(minZ + maxZ) / 2, 0);
        const positions = geometry.getAttribute("position");
        const uv = geometry.getAttribute("uv");
        for (let i = 0; i < uv.count; i++) {
            uv.setXY(
                i,
                (positions.getX(i) + SCENE_HALF_SIZE) / (SCENE_HALF_SIZE * 2),
                (positions.getY(i) + SCENE_HALF_SIZE) / (SCENE_HALF_SIZE * 2),
            );
        }
        return geometry;
    }, [minZ, maxZ]);
    useEffect(() => () => groundGeometry.dispose(), [groundGeometry]);
    const pointerDownRef = useRef(null);
    const TAP_THRESHOLD_SQ = 100; // 10px radius

    const [ref] = usePlane(() => ({
        rotation: [-Math.PI / 2, 0, 0],
        position: [0, -1, 0],
    }));

    const [baseColor, normal, roughness, ao, metallic] = useLoader(
        TextureLoader,
        [
            "/textures/grass/Poliigon_GrassPatchyGround_4585_BaseColor.jpg",
            "/textures/grass/Poliigon_GrassPatchyGround_4585_Normal.png",
            "/textures/grass/Poliigon_GrassPatchyGround_4585_Roughness.jpg",
            "/textures/grass/Poliigon_GrassPatchyGround_4585_AmbientOcclusion.jpg",
            "/textures/grass/Poliigon_GrassPatchyGround_4585_Metallic.jpg",
        ],
    );

    useMemo(() => {
        [baseColor, normal, roughness, ao, metallic].forEach((texture) => {
            texture.wrapS = RepeatWrapping;
            texture.wrapT = RepeatWrapping;
            texture.repeat.set(100, 100);
        });
    }, [baseColor, normal, roughness, ao, metallic]);

    return (
        <>
            <mesh
                ref={ref}
                geometry={groundGeometry}
                receiveShadow
                onPointerDown={(e) => {
                    if (controlType !== "Touch") return;
                    pointerDownRef.current = {
                        screenX: e.nativeEvent.clientX,
                        screenY: e.nativeEvent.clientY,
                        point: e.point,
                    };
                }}
                onPointerUp={(e) => {
                    if (controlType !== "Touch" || !pointerDownRef.current)
                        return;
                    const dx =
                        e.nativeEvent.clientX - pointerDownRef.current.screenX;
                    const dy =
                        e.nativeEvent.clientY - pointerDownRef.current.screenY;
                    if (dx * dx + dy * dy < TAP_THRESHOLD_SQ) {
                        setTouchTarget([
                            pointerDownRef.current.point.x,
                            0,
                            pointerDownRef.current.point.z,
                        ]);
                    }
                    pointerDownRef.current = null;
                }}
            >
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
            {galleryTheme === "Forest" && (
                <GrassArea
                    outer={50}
                    innerBounds={{
                        minX: -1.4 * CORRIDOR_WIDTH_SCALE,
                        maxX: 1.4 * CORRIDOR_WIDTH_SCALE,
                        minZ: -50,
                        maxZ: 50,
                    }}
                    groundHeight={-1}
                    count={64000}
                />
            )}
            {galleryTheme === "Museum" && assetCount > 0 && (
                <MuseumGrass count={assetCount} />
            )}
        </>
    );
};

// const arePropsEqual = (prevProps, nextProps) => {
//     // Compare all props for equality
//     return JSON.stringify(prevProps) === JSON.stringify(nextProps);
// };

const MemoizedGround = memo(
    Ground,
    // arePropsEqual
);

export default MemoizedGround;
