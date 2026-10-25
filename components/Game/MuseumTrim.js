import { memo, useEffect, useMemo } from "react";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { createTimberGeometry, getKioskWoodMaps } from "./kioskWood";
import { MUSEUM_LAYOUT } from "./sceneLayout";

function MuseumTrim({ section_spacing, isLast }) {
    const geometry = useMemo(() => {
        const { width, floorY, ceilingY } = MUSEUM_LAYOUT;
        const wallHeight = ceilingY - floorY;
        const wallY = (floorY + ceilingY) / 2;
        const solidDepth = (section_spacing * 2) / 3;
        const parts = [];
        const add = (position, size) => {
            const part = createTimberGeometry(size);
            part.translate(...position);
            parts.push(part);
        };
        for (const side of [-1, 1]) {
            add(
                [(side * width) / 2, floorY + 0.075, 0],
                [0.25, 0.15, section_spacing],
            );
            add(
                [side * (width / 2 - 0.04), floorY + 0.17, 0],
                [0.2, 0.035, section_spacing],
            );
            add(
                [side * (width / 2 - 0.02), floorY + 0.025, 0],
                [0.27, 0.05, section_spacing],
            );
            add([(side * width) / 2, 2.25, 0], [0.25, 0.25, section_spacing]);
            add(
                [side * (width / 2 - 0.06), ceilingY - 0.19, 0],
                [0.27, 0.055, section_spacing],
            );
            add(
                [side * (width / 2 - 0.1), ceilingY - 0.235, 0],
                [0.14, 0.035, section_spacing],
            );
            for (const end of [-1, 1])
                add(
                    [(side * width) / 2, wallY, (end * solidDepth) / 2],
                    [0.13, wallHeight, 0.055],
                );
            add(
                [(side * width) / 2, wallY, section_spacing / 2],
                [0.12, wallHeight, 0.08],
            );
            if (isLast)
                add(
                    [(side * width) / 2, wallY, -section_spacing / 2],
                    [0.12, wallHeight, 0.08],
                );
        }
        const result = mergeGeometries(parts, false);
        parts.forEach((part) => part.dispose());
        return result;
    }, [section_spacing, isLast]);
    const maps = useMemo(() => getKioskWoodMaps(), []);
    useEffect(() => () => geometry.dispose(), [geometry]);
    return (
        <mesh
            geometry={geometry}
            renderOrder={2}
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
                polygonOffset
                polygonOffsetFactor={-1}
                polygonOffsetUnits={-1}
            />
        </mesh>
    );
}

export default memo(MuseumTrim);
