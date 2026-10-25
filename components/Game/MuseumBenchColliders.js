import { useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import { useBox } from "@react-three/cannon";
import { getMuseumBenchPlacement } from "./MuseumBenchPair";
import { CORRIDOR_WIDTH_SCALE, MUSEUM_LAYOUT } from "./sceneLayout";

function BenchPart({ position, size, name }) {
    useBox(
        () => ({
            type: "Static",
            position,
            args: size,
            userData: { benchPart: name },
        }),
        undefined,
        [...position, ...size],
    );
    return null;
}

export default function MuseumBenchColliders({ count, section_spacing }) {
    const { scene } = useGLTF("/models/lowpoly_park_bench.glb");
    const placement = useMemo(() => getMuseumBenchPlacement(scene), [scene]);
    const colliders = useMemo(() => {
        const result = [];
        for (let section = 1; section < count; section += 2) {
            for (const bench of [
                {
                    position: placement.first,
                    rotation: placement.firstRotation,
                },
                {
                    position: placement.second,
                    rotation: placement.secondRotation,
                },
            ]) {
                const sign = Math.cos(bench.rotation);
                for (const part of placement.colliders) {
                    result.push({
                        name: part.name,
                        position: [
                            MUSEUM_LAYOUT.originX +
                                (placement.center[0] +
                                    bench.position[0] +
                                    sign * part.center[0]) *
                                    CORRIDOR_WIDTH_SCALE,
                            MUSEUM_LAYOUT.originY +
                                MUSEUM_LAYOUT.floorY +
                                part.center[1],
                            -section * section_spacing +
                                section_spacing / 3 +
                                placement.center[2] +
                                bench.position[2] +
                                sign * part.center[2],
                        ],
                        size: [
                            part.size[0] * CORRIDOR_WIDTH_SCALE,
                            part.size[1],
                            part.size[2],
                        ],
                    });
                }
            }
        }
        return result;
    }, [placement, count, section_spacing]);

    return colliders.map((collider, index) => (
        <BenchPart
            key={index}
            {...collider}
        />
    ));
}
