import { useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import { Box3, Vector3 } from "three";
import { ModelParkBench } from "../Models/ParkBench";

const BENCH_SCALE = 1.15;
const placements = new WeakMap();

function getCollisionParts(scene, bounds, depthAxis, backPositive) {
    const height = bounds.max.y - bounds.min.y;
    const levels = new Map();
    const a = new Vector3();
    const b = new Vector3();
    const c = new Vector3();
    const ab = new Vector3();
    const ac = new Vector3();
    const normal = new Vector3();

    // Find the broad horizontal seat surface by area, excluding feet and arms.
    scene.traverse((object) => {
        const positions = object.geometry?.getAttribute("position");
        if (!positions) return;
        const indices = object.geometry.index;
        const count = indices?.count ?? positions.count;
        for (let i = 0; i < count; i += 3) {
            a.fromBufferAttribute(
                positions,
                indices?.getX(i) ?? i,
            ).applyMatrix4(object.matrixWorld);
            b.fromBufferAttribute(
                positions,
                indices?.getX(i + 1) ?? i + 1,
            ).applyMatrix4(object.matrixWorld);
            c.fromBufferAttribute(
                positions,
                indices?.getX(i + 2) ?? i + 2,
            ).applyMatrix4(object.matrixWorld);
            normal.crossVectors(ab.subVectors(b, a), ac.subVectors(c, a));
            const area = normal.length();
            const y = (a.y + b.y + c.y) / 3;
            const relativeY = (y - bounds.min.y) / height;
            if (
                area === 0 ||
                Math.abs(normal.y) / area < 0.94 ||
                relativeY < 0.28 ||
                relativeY > 0.68
            )
                continue;
            const level = Math.round(relativeY * 64);
            if (!levels.has(level))
                levels.set(level, {
                    area: 0,
                    weightedY: 0,
                    bounds: new Box3(),
                });
            const candidate = levels.get(level);
            candidate.area += area;
            candidate.weightedY += y * area;
            candidate.bounds.expandByPoint(a).expandByPoint(b).expandByPoint(c);
        }
    });
    let seat;
    for (const candidate of levels.values()) {
        if (
            !seat ||
            candidate.area > seat.area * 1.01 ||
            (candidate.area >= seat.area * 0.99 &&
                candidate.weightedY / candidate.area >
                    seat.weightedY / seat.area)
        )
            seat = candidate;
    }
    const seatY = seat
        ? seat.weightedY / seat.area
        : bounds.min.y + height * 0.47;
    const seatBounds = seat ? seat.bounds.clone() : bounds.clone();
    seatBounds.min.y = seatY - Math.max(height * 0.07, 0.025);
    seatBounds.max.y = seatY;

    const backBounds = new Box3();
    const upperY = Math.max(
        bounds.min.y + height * 0.72,
        seatY + height * 0.18,
    );
    scene.traverse((object) => {
        const positions = object.geometry?.getAttribute("position");
        if (!positions) return;
        for (let i = 0; i < positions.count; i++) {
            a.fromBufferAttribute(positions, i).applyMatrix4(
                object.matrixWorld,
            );
            if (a.y > upperY) backBounds.expandByPoint(a);
        }
    });
    if (backBounds.isEmpty()) {
        backBounds.copy(bounds);
        const depth = bounds.max[depthAxis] - bounds.min[depthAxis];
        if (backPositive)
            backBounds.min[depthAxis] = bounds.max[depthAxis] - depth * 0.18;
        else backBounds.max[depthAxis] = bounds.min[depthAxis] + depth * 0.18;
    }
    backBounds.min.y = seatY + height * 0.025;
    backBounds.max.y = bounds.max.y;
    backBounds.min[depthAxis] -= height * 0.015;
    backBounds.max[depthAxis] += height * 0.015;

    return [seatBounds, backBounds].map((box, index) => ({
        name: index === 0 ? "seat" : "backrest",
        center: box
            .getCenter(new Vector3())
            .multiplyScalar(BENCH_SCALE)
            .toArray(),
        size: box
            .getSize(new Vector3())
            .multiplyScalar(BENCH_SCALE)
            .toArray()
            .map((value) => Math.max(0.015, value)),
    }));
}

export function getMuseumBenchPlacement(scene) {
    if (placements.has(scene)) return placements.get(scene);
    scene.updateWorldMatrix(true, true);
    const bounds = new Box3().setFromObject(scene);
    const center = bounds.getCenter(new Vector3()).multiplyScalar(BENCH_SCALE);
    const size = bounds.getSize(new Vector3()).multiplyScalar(BENCH_SCALE);
    const depthAxis = size.x < size.z ? "x" : "z";
    const upperY = bounds.min.y + (bounds.max.y - bounds.min.y) * 0.7;
    const point = new Vector3();
    let backTotal = 0;
    let backVertices = 0;
    // The highest vertices belong to the backrest, identifying which way the
    // source bench faces instead of assuming its modelling orientation.
    scene.traverse((object) => {
        const positions = object.geometry?.getAttribute("position");
        if (!positions) return;
        for (let i = 0; i < positions.count; i++) {
            point
                .fromBufferAttribute(positions, i)
                .applyMatrix4(object.matrixWorld);
            if (point.y > upperY) {
                backTotal += point[depthAxis] * BENCH_SCALE;
                backVertices++;
            }
        }
    });
    const rotateFirst =
        backVertices > 0 && backTotal / backVertices > center[depthAxis];
    const sign = rotateFirst ? -1 : 1;
    const first = new Vector3(-sign * center.x, 0, -sign * center.z);
    first[depthAxis] += size[depthAxis] / 2 + 0.025;
    const placement = {
        center: [center.x, 0, center.z],
        first: first.toArray(),
        second: [-first.x, 0, -first.z],
        firstRotation: rotateFirst ? Math.PI : 0,
        secondRotation: rotateFirst ? 0 : Math.PI,
        colliders: getCollisionParts(scene, bounds, depthAxis, rotateFirst),
    };
    placements.set(scene, placement);
    return placement;
}

export default function MuseumBenchPair(props) {
    const { scene } = useGLTF("/models/lowpoly_park_bench.glb");
    const placement = useMemo(() => getMuseumBenchPlacement(scene), [scene]);

    return (
        <group
            {...props}
            name="museum-back-to-back-benches"
        >
            <group position={placement.center}>
                <ModelParkBench
                    position={placement.first}
                    rotation={[0, placement.firstRotation, 0]}
                    scale={BENCH_SCALE}
                />
                <ModelParkBench
                    position={placement.second}
                    rotation={[0, placement.secondRotation, 0]}
                    scale={BENCH_SCALE}
                />
            </group>
        </group>
    );
}
