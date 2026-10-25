import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Object3D } from "three";
import { useStore } from "@/hooks/useStore";
import { useAssetGalleryStore } from "@/hooks/useAssetGalleryStore";
import { MUSEUM_LAYOUT, section_spacing } from "./sceneLayout";
import { getMuseumArtFixture } from "./MuseumArtLight";

function LightPool({ count, quality }) {
    const lights = useRef([]);
    const poolSize = Math.min(count, quality === "Low" ? 1 : 2);
    const targets = useMemo(() => [new Object3D(), new Object3D()], []);
    const fixture = useMemo(() => getMuseumArtFixture(section_spacing), []);
    useFrame(() => {
        const playerZ = useAssetGalleryStore.getState().position[2];
        const nearest = Math.max(
            0,
            Math.min(count - 1, Math.round(-playerZ / section_spacing)),
        );
        const toward = playerZ + nearest * section_spacing >= 0 ? -1 : 1;
        let neighbor = nearest + toward;
        if (neighbor < 0 || neighbor >= count) neighbor = nearest - toward;
        for (let i = 0; i < poolSize; i++) {
            const light = lights.current[i];
            if (!light) continue;
            const section = i === 0 ? nearest : neighbor;
            const z = -section * section_spacing;
            light.position.set(
                MUSEUM_LAYOUT.originX + fixture.position[0],
                MUSEUM_LAYOUT.originY + fixture.position[1],
                z,
            );
            targets[i].position.set(
                MUSEUM_LAYOUT.originX + fixture.target.position.x,
                MUSEUM_LAYOUT.originY + fixture.target.position.y,
                z,
            );
            targets[i].updateMatrixWorld();
        }
    });

    return Array.from({ length: poolSize }, (_, i) => (
        <group key={i}>
            <primitive object={targets[i]} />
            <spotLight
                ref={(value) => {
                    lights.current[i] = value;
                }}
                target={targets[i]}
                color="#fff0d6"
                intensity={32}
                distance={fixture.distance}
                angle={0.43}
                penumbra={0.65}
                decay={2}
                castShadow={quality === "High" && i === 0}
                shadow-mapSize-width={512}
                shadow-mapSize-height={512}
                shadow-camera-near={0.1}
                shadow-bias={-0.0001}
                shadow-normalBias={0.015}
            />
        </group>
    ));
}

export default function MuseumLighting() {
    const theme = useAssetGalleryStore((state) => state.galleryTheme);
    const count = useStore((state) => state.assets?.length ?? 0);
    const quality = useStore((state) => state.graphicsQuality);
    if (theme !== "Museum" || count === 0) return null;
    return (
        <LightPool
            count={count}
            quality={quality}
        />
    );
}
