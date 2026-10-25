import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { useBox } from "@react-three/cannon";
import { BoxGeometry, Color, Object3D, PlaneGeometry } from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { useStore } from "@/hooks/useStore";
import { useAssetGalleryStore } from "@/hooks/useAssetGalleryStore";
import AirConditioner from "./AirConditioner";
import AlleyTunnelEnds from "./AlleyTunnelEnds";
import { alleyRandom, getAlleySurface } from "./alleyMaterials";
import { ALLEY_SIDE_OFFSET, section_spacing } from "./sceneLayout";

const WALL_X = 2.88 + ALLEY_SIDE_OFFSET;
const SIDEWALK_WIDENING = 0.25;
const ROAD_WIDTH = 3.8 + ALLEY_SIDE_OFFSET * 2 - SIDEWALK_WIDENING * 2;
const SIDEWALK_WIDTH = 0.86 + SIDEWALK_WIDENING;
const SIDEWALK_X = 2.33 + ALLEY_SIDE_OFFSET - SIDEWALK_WIDENING / 2;
const CURB_X = 1.95 + ALLEY_SIDE_OFFSET - SIDEWALK_WIDENING;

function Block({ position, size, color, surface, ...props }) {
    const [width, height, depth] = size;
    const geometry = useMemo(() => {
        const result = new BoxGeometry(width, height, depth);
        const uv = result.getAttribute("uv");
        const normal = result.getAttribute("normal");
        const vertices = result.getAttribute("position");
        for (let i = 0; i < uv.count; i++) {
            const axes =
                Math.abs(normal.getX(i)) > 0.5
                    ? [2, 1]
                    : Math.abs(normal.getY(i)) > 0.5
                      ? [0, 2]
                      : [0, 1];
            uv.setXY(
                i,
                vertices.getComponent(i, axes[0]),
                vertices.getComponent(i, axes[1]),
            );
        }
        return result;
    }, [width, height, depth]);
    useEffect(() => () => geometry.dispose(), [geometry]);
    return (
        <mesh
            position={position}
            geometry={geometry}
            castShadow
            receiveShadow
            {...props}
        >
            <meshStandardMaterial
                {...surface}
                color={color}
                roughness={0.95}
                bumpScale={0.008}
            />
        </mesh>
    );
}

function Collider({ position, size }) {
    useBox(() => ({ type: "Static", position, args: size }), undefined, [
        ...position,
        ...size,
    ]);
    return null;
}

function BrickWalls({ length }) {
    const ref = useRef();
    const geometry = useMemo(
        () => new RoundedBoxGeometry(0.12, 0.145, 0.4, 1, 0.007),
        [],
    );
    const surface = useMemo(() => getAlleySurface("brick"), []);
    const bricks = useMemo(() => {
        const result = [];
        for (const side of [-1, 1]) {
            for (let row = 0; row < 20; row++) {
                // Running bond, with partial bricks clipped to each wall's ends.
                for (
                    let z = -length / 2 - (row % 2) * 0.21;
                    z < length / 2;
                    z += 0.42
                ) {
                    const start = Math.max(-length / 2, z);
                    const end = Math.min(length / 2, z + 0.4);
                    if (end - start < 0.025) continue;
                    result.push({
                        side,
                        row,
                        z: (start + end) / 2,
                        width: end - start,
                    });
                }
            }
        }
        return result;
    }, [length]);

    useLayoutEffect(() => {
        if (!ref.current) return;
        const dummy = new Object3D();
        const color = new Color();
        bricks.forEach((brick, index) => {
            const variation = alleyRandom(index);
            dummy.position.set(
                brick.side *
                    (2.765 + ALLEY_SIDE_OFFSET + (variation - 0.5) * 0.012),
                -0.92 + brick.row * 0.16,
                brick.z,
            );
            dummy.scale.set(
                0.92 + alleyRandom(index, 2) * 0.16,
                0.98 + alleyRandom(index, 3) * 0.04,
                brick.width / 0.4,
            );
            dummy.rotation.set((alleyRandom(index, 4) - 0.5) * 0.012, 0, 0);
            dummy.updateMatrix();
            ref.current.setMatrixAt(index, dummy.matrix);
            color.setHSL(
                0.035 + alleyRandom(index, 5) * 0.025,
                0.32 + variation * 0.18,
                0.37 + alleyRandom(index, 6) * 0.17,
            );
            ref.current.setColorAt(index, color);
        });
        ref.current.instanceMatrix.needsUpdate = true;
        if (ref.current.instanceColor)
            ref.current.instanceColor.needsUpdate = true;
        ref.current.computeBoundingSphere();
    }, [bricks]);
    useEffect(() => () => geometry.dispose(), [geometry]);

    return (
        <instancedMesh
            ref={ref}
            args={[geometry, null, bricks.length]}
            castShadow
            receiveShadow
        >
            <meshStandardMaterial
                {...surface}
                roughness={1}
                bumpScale={0.007}
            />
        </instancedMesh>
    );
}

function Street({ length, count }) {
    const asphalt = useMemo(() => getAlleySurface("asphalt"), []);
    const concrete = useMemo(() => getAlleySurface("concrete"), []);
    const roadGeometry = useMemo(() => {
        const geometry = new PlaneGeometry(ROAD_WIDTH, length);
        const uv = geometry.getAttribute("uv");
        for (let i = 0; i < uv.count; i++)
            uv.setXY(
                i,
                (uv.getX(i) * ROAD_WIDTH) / 2,
                (uv.getY(i) * length) / 2,
            );
        return geometry;
    }, [length]);
    useEffect(() => () => roadGeometry.dispose(), [roadGeometry]);

    return (
        <>
            <mesh
                rotation={[-Math.PI / 2, 0, 0]}
                position={[0, -0.99, 0]}
                geometry={roadGeometry}
                receiveShadow
            >
                <meshStandardMaterial
                    {...asphalt}
                    roughness={1}
                    bumpScale={0.014}
                />
            </mesh>
            {Array.from({ length: Math.ceil(length / 2) }, (_, i) => (
                <Block
                    key={i}
                    position={[0, -0.984, -length / 2 + i * 2 + 0.55]}
                    size={[0.065, 0.004, 0.95]}
                    color="#e9d9a1"
                />
            ))}
            {[-1, 1].map((side) => (
                <group key={side}>
                    <Block
                        position={[side * (ROAD_WIDTH / 2 - 0.14), -0.984, 0]}
                        size={[0.045, 0.004, length]}
                        color="#e2dfcd"
                    />
                    <Block
                        position={[side * SIDEWALK_X, -0.92, 0]}
                        size={[SIDEWALK_WIDTH, 0.16, length]}
                        surface={concrete}
                    />
                    <Block
                        position={[side * CURB_X, -0.91, 0]}
                        size={[0.12, 0.18, length]}
                        color="#c8a531"
                        surface={concrete}
                    />
                    {Array.from({ length: Math.floor(length) }, (_, i) => (
                        <Block
                            key={i}
                            position={[
                                side * (SIDEWALK_X + 0.02),
                                -0.837,
                                -length / 2 + i + 0.5,
                            ]}
                            size={[0.7 + SIDEWALK_WIDENING, 0.003, 0.012]}
                            color="#65655e"
                        />
                    ))}
                    <Block
                        position={[side * WALL_X, 0.6, 0]}
                        size={[0.3, 3.2, length]}
                        color="#807a6d"
                    />
                    <Block
                        position={[side * (2.84 + ALLEY_SIDE_OFFSET), 2.24, 0]}
                        size={[0.48, 0.1, length]}
                        color="#8e8779"
                        surface={concrete}
                    />
                    {Array.from({ length: Math.max(0, count - 1) }, (_, i) => (
                        <AirConditioner
                            key={i}
                            position={[
                                side * (2.49 + ALLEY_SIDE_OFFSET),
                                0.9,
                                length / 2 -
                                    section_spacing * 1.5 -
                                    i * section_spacing,
                            ]}
                            rotation={[0, (-side * Math.PI) / 2, 0]}
                        />
                    ))}
                </group>
            ))}
            <BrickWalls length={length} />
        </>
    );
}

export default function Alley() {
    const theme = useAssetGalleryStore((state) => state.galleryTheme);
    const count = useStore((state) => state.assets?.length ?? 0);
    if (theme !== "Alley") return null;
    const sections = Math.max(1, count);
    const length = (sections + 1) * section_spacing;
    const centerZ = (-(sections - 1) * section_spacing) / 2;
    return (
        <>
            <group
                position={[0, 0, centerZ]}
                name="procedural-alley"
            >
                <Street
                    length={length}
                    count={sections}
                />
            </group>
            {/* Cannon bodies use world positions, independent of the visual group. */}
            <AlleyTunnelEnds
                length={length}
                centerZ={centerZ}
                curbInnerX={CURB_X - 0.06}
                wallOuterX={WALL_X + 0.15}
                roadWidth={ROAD_WIDTH}
            />
            <Collider
                position={[0, -1.05, centerZ]}
                size={[ROAD_WIDTH, 0.1, length]}
            />
            {[-1, 1].map((side) => (
                <group key={side}>
                    <Collider
                        position={[side * SIDEWALK_X, -0.92, centerZ]}
                        size={[SIDEWALK_WIDTH, 0.16, length]}
                    />
                    <Collider
                        position={[side * CURB_X, -0.91, centerZ]}
                        size={[0.12, 0.18, length]}
                    />
                    {/* Include the brick faces projecting in front of the mortar. */}
                    <Collider
                        position={[
                            side * (2.86 + ALLEY_SIDE_OFFSET),
                            0.6,
                            centerZ,
                        ]}
                        size={[0.34, 3.2, length]}
                    />
                </group>
            ))}
        </>
    );
}
