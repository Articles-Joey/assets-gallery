import { memo, useEffect, useMemo } from "react";
import { BoxGeometry } from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

function MuseumFourPaneWindow({ width, height, wallThickness, position }) {
    const geometry = useMemo(() => {
        const frames = [];
        const panes = [];
        const add = (parts, size, center) => {
            const box = new BoxGeometry(...size);
            box.translate(...center);
            parts.push(box);
        };
        for (const face of [-1, 1]) {
            const z = face * (wallThickness / 2 + 0.025);
            for (const edge of [-1, 1]) {
                add(
                    frames,
                    [0.055, height + 0.055, 0.08],
                    [(edge * width) / 2, 0, z],
                );
                add(
                    frames,
                    [width + 0.055, 0.055, 0.08],
                    [0, (edge * height) / 2, z],
                );
            }
            for (let i = 1; i < 4; i++) {
                add(
                    frames,
                    [0.045, height, 0.08],
                    [-width / 2 + (i * width) / 4, 0, z],
                );
            }
        }
        for (let i = 0; i < 4; i++) {
            add(
                panes,
                [width / 4 - 0.012, height - 0.012, 0.018],
                [-width / 2 + ((i + 0.5) * width) / 4, 0, 0],
            );
        }
        const result = {
            frames: mergeGeometries(frames, false),
            panes: mergeGeometries(panes, false),
        };
        [...frames, ...panes].forEach((part) => part.dispose());
        return result;
    }, [width, height, wallThickness]);
    useEffect(
        () => () => {
            geometry.frames.dispose();
            geometry.panes.dispose();
        },
        [geometry],
    );

    return (
        <group
            position={position}
            name="museum-four-pane-end-window"
        >
            <mesh
                geometry={geometry.frames}
                renderOrder={3}
                castShadow
                receiveShadow
            >
                <meshStandardMaterial
                    color="#151b19"
                    metalness={0.6}
                    roughness={0.35}
                    polygonOffset
                    polygonOffsetFactor={-1}
                    polygonOffsetUnits={-1}
                />
            </mesh>
            <mesh
                geometry={geometry.panes}
                renderOrder={4}
            >
                <meshStandardMaterial
                    color="#b4d2d8"
                    transparent
                    opacity={0.28}
                    roughness={0.22}
                    metalness={0.05}
                    depthWrite={false}
                />
            </mesh>
        </group>
    );
}

export default memo(MuseumFourPaneWindow);
