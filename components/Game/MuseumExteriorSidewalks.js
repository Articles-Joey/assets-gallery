import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { useBox } from "@react-three/cannon";
import { BoxGeometry, Color, Object3D } from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { MUSEUM_LAYOUT, getMuseumExteriorSegments } from "./sceneLayout";
import { alleyRandom, getAlleySurface } from "./alleyMaterials";

const SLAB_SIZE = 1.5;
const JOINT_WIDTH = 0.014;
const SLAB_THICKNESS = 0.003;
const PAVEMENT_THICKNESS = 0.12;

function PavementBounds({ segment, surfaceY }) {
    const { x, z, width, depth } = segment;
    useBox(
        () => ({
            type: "Static",
            position: [x, surfaceY - PAVEMENT_THICKNESS / 2, z],
            args: [width, PAVEMENT_THICKNESS, depth],
        }),
        undefined,
        [x, z, width, depth, surfaceY],
    );
    return null;
}

export default function MuseumExteriorSidewalks({ count, section_spacing }) {
    const tiles = useRef();
    const concrete = useMemo(() => getAlleySurface("concrete"), []);
    // Keep the recessed joints above the grass without introducing a curb.
    const surfaceY = MUSEUM_LAYOUT.originY + MUSEUM_LAYOUT.floorY + 0.008;
    const segments = useMemo(
        () => getMuseumExteriorSegments(count, section_spacing),
        [count, section_spacing],
    );
    const slabs = useMemo(
        () =>
            segments.flatMap((segment) => {
                const columns = Math.ceil(segment.width / SLAB_SIZE);
                const rows = Math.ceil(segment.depth / SLAB_SIZE);
                const width = segment.width / columns;
                const depth = segment.depth / rows;
                return Array.from({ length: columns * rows }, (_, i) => ({
                    x:
                        segment.x -
                        segment.width / 2 +
                        ((i % columns) + 0.5) * width,
                    z:
                        segment.z -
                        segment.depth / 2 +
                        (Math.floor(i / columns) + 0.5) * depth,
                    width: width - JOINT_WIDTH,
                    depth: depth - JOINT_WIDTH,
                }));
            }),
        [segments],
    );
    const baseGeometry = useMemo(() => {
        const parts = segments.map((segment) => {
            const height = PAVEMENT_THICKNESS - SLAB_THICKNESS;
            const geometry = new BoxGeometry(
                segment.width,
                height,
                segment.depth,
            );
            geometry.translate(
                segment.x,
                surfaceY - SLAB_THICKNESS - height / 2,
                segment.z,
            );
            return geometry;
        });
        const merged = mergeGeometries(parts, false);
        parts.forEach((part) => part.dispose());
        return merged;
    }, [segments, surfaceY]);
    useEffect(() => () => baseGeometry.dispose(), [baseGeometry]);
    useLayoutEffect(() => {
        if (!tiles.current) return;
        const dummy = new Object3D();
        const color = new Color();
        slabs.forEach((slab, i) => {
            dummy.position.set(slab.x, surfaceY - SLAB_THICKNESS / 2, slab.z);
            dummy.scale.set(slab.width, SLAB_THICKNESS, slab.depth);
            dummy.updateMatrix();
            tiles.current.setMatrixAt(i, dummy.matrix);
            color.setHSL(0.1, 0.025, 0.9 + alleyRandom(i, 37) * 0.08);
            tiles.current.setColorAt(i, color);
        });
        tiles.current.instanceMatrix.needsUpdate = true;
        tiles.current.instanceColor.needsUpdate = true;
        tiles.current.computeBoundingSphere();
    }, [slabs, surfaceY]);

    return (
        <group name="museum-exterior-concrete-sidewalks">
            <mesh
                geometry={baseGeometry}
                receiveShadow
            >
                <meshStandardMaterial
                    color="#73776f"
                    roughness={1}
                />
            </mesh>
            <instancedMesh
                ref={tiles}
                args={[null, null, slabs.length]}
                receiveShadow
            >
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial
                    {...concrete}
                    roughness={1}
                    bumpScale={0.006}
                />
            </instancedMesh>
            {segments.map((segment, index) => (
                <PavementBounds
                    key={index}
                    segment={segment}
                    surfaceY={surfaceY}
                />
            ))}
        </group>
    );
}
