import { useMemo } from "react";
import { useBox } from "@react-three/cannon";

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

export default function MuseumBenchColliders({ placement, position, scale }) {
    const colliders = useMemo(() => {
        const result = [];
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
                        position[0] +
                            (placement.center[0] +
                                bench.position[0] +
                                sign * part.center[0]) *
                                scale[0],
                        position[1] + part.center[1] * scale[1],
                        position[2] +
                            (placement.center[2] +
                                bench.position[2] +
                                sign * part.center[2]) *
                                scale[2],
                    ],
                    size: [
                        part.size[0] * scale[0],
                        part.size[1] * scale[1],
                        part.size[2] * scale[2],
                    ],
                });
            }
        }
        return result;
    }, [placement, position, scale]);

    return colliders.map((collider, index) => (
        <BenchPart
            key={index}
            {...collider}
        />
    ));
}
