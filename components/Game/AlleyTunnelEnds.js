import { memo, useEffect, useMemo } from "react";
import { useBox } from "@react-three/cannon";
import { Base, Geometry, Subtraction } from "@react-three/csg";
import { BoxGeometry, DoubleSide, ExtrudeGeometry, Shape } from "three";
import { getAlleySurface } from "./alleyMaterials";

const FLOOR_Y = -1;
const FACE_HEIGHT = 4.15;
const TUNNEL_DEPTH = 0.78;
const BLACK_WALL_DEPTH = 0.58;
const ARCH_HEIGHT = 3.1;

function StaticBounds({ position, size }) {
    useBox(() => ({ type: "Static", position, args: size }), undefined, [
        ...position,
        ...size,
    ]);
    return null;
}

function ArchStone({ geometry, index }) {
    return (
        <mesh
            geometry={geometry}
            position={[0, 0, -0.015]}
            castShadow
            receiveShadow
        >
            <meshStandardMaterial
                color={
                    index === 9 ? "#d5a575" : index % 2 ? "#b87b50" : "#c68c5a"
                }
                roughness={0.88}
            />
        </mesh>
    );
}

function TunnelPortal({ halfWidth, entranceRadius, roadWidth }) {
    const surface = useMemo(() => getAlleySurface("tunnel-brick"), []);
    const asphalt = useMemo(() => getAlleySurface("asphalt"), []);
    const centerY = FLOOR_Y + FACE_HEIGHT / 2;
    const resources = useMemo(() => {
        const face = new BoxGeometry(halfWidth * 2, FACE_HEIGHT, TUNNEL_DEPTH);
        face.translate(0, centerY, -TUNNEL_DEPTH / 2);
        const vertices = face.getAttribute("position");
        const normals = face.getAttribute("normal");
        const uv = face.getAttribute("uv");
        for (let i = 0; i < uv.count; i++) {
            const horizontal =
                Math.abs(normals.getX(i)) > 0.5
                    ? vertices.getZ(i)
                    : vertices.getX(i);
            const vertical =
                Math.abs(normals.getY(i)) > 0.5
                    ? vertices.getZ(i)
                    : vertices.getY(i);
            uv.setXY(i, horizontal / 1.68, vertical / 1.28);
        }

        // The upper half of an ellipse meets the road exactly at the curb edges.
        const opening = new Shape();
        opening.moveTo(-entranceRadius, FLOOR_Y - 1);
        opening.lineTo(entranceRadius, FLOOR_Y - 1);
        opening.lineTo(entranceRadius, FLOOR_Y);
        opening.absellipse(
            0,
            FLOOR_Y,
            entranceRadius,
            ARCH_HEIGHT,
            0,
            Math.PI,
            false,
            0,
        );
        opening.closePath();
        const cutter = new ExtrudeGeometry(opening, {
            depth: TUNNEL_DEPTH + 0.5,
            bevelEnabled: false,
            curveSegments: 32,
        });
        cutter.translate(0, 0, -TUNNEL_DEPTH - 0.25);

        const stones = Array.from({ length: 19 }, (_, index) => {
            const start = (index * Math.PI) / 19 + 0.008;
            const end = ((index + 1) * Math.PI) / 19 - 0.008;
            const rim = index === 9 ? 0.34 : 0.25;
            const shape = new Shape();
            shape.moveTo(
                entranceRadius * Math.cos(start),
                FLOOR_Y + ARCH_HEIGHT * Math.sin(start),
            );
            shape.lineTo(
                (entranceRadius + rim) * Math.cos(start),
                FLOOR_Y + (ARCH_HEIGHT + rim) * Math.sin(start),
            );
            for (let step = 1; step <= 4; step++) {
                const angle = start + ((end - start) * step) / 4;
                shape.lineTo(
                    (entranceRadius + rim) * Math.cos(angle),
                    FLOOR_Y + (ARCH_HEIGHT + rim) * Math.sin(angle),
                );
            }
            shape.lineTo(
                entranceRadius * Math.cos(end),
                FLOOR_Y + ARCH_HEIGHT * Math.sin(end),
            );
            for (let step = 1; step <= 4; step++) {
                const angle = end - ((end - start) * step) / 4;
                shape.lineTo(
                    entranceRadius * Math.cos(angle),
                    FLOOR_Y + ARCH_HEIGHT * Math.sin(angle),
                );
            }
            shape.closePath();
            return new ExtrudeGeometry(shape, {
                depth: index === 9 ? 0.2 : 0.15,
                bevelEnabled: true,
                bevelSegments: 1,
                bevelSize: 0.009,
                bevelThickness: 0.009,
                steps: 1,
            });
        });
        return { face, cutter, stones };
    }, [halfWidth, entranceRadius, centerY]);
    useEffect(
        () => () => {
            resources.face.dispose();
            resources.cutter.dispose();
            resources.stones.forEach((stone) => stone.dispose());
        },
        [resources],
    );

    return (
        <group name="cartoon-brick-tunnel">
            <mesh
                castShadow
                receiveShadow
                userData={{ cameraObstacle: true }}
            >
                <Geometry>
                    <Base geometry={resources.face} />
                    <Subtraction geometry={resources.cutter} />
                </Geometry>
                <meshStandardMaterial
                    {...surface}
                    roughness={1}
                    bumpScale={0.022}
                />
            </mesh>
            {resources.stones.map((geometry, index) => (
                <ArchStone
                    key={index}
                    geometry={geometry}
                    index={index}
                />
            ))}
            <mesh
                position={[0, FLOOR_Y + FACE_HEIGHT + 0.035, -TUNNEL_DEPTH / 2]}
                castShadow
                receiveShadow
            >
                <boxGeometry
                    args={[halfWidth * 2 + 0.14, 0.16, TUNNEL_DEPTH + 0.16]}
                />
                <meshStandardMaterial
                    color="#a06d49"
                    roughness={0.92}
                />
            </mesh>
            <mesh position={[0, centerY, -BLACK_WALL_DEPTH]}>
                <planeGeometry args={[halfWidth * 2, FACE_HEIGHT]} />
                <meshBasicMaterial
                    color="#000000"
                    side={DoubleSide}
                    toneMapped={false}
                    fog={false}
                />
            </mesh>
            <mesh
                position={[0, -0.99, -TUNNEL_DEPTH / 2]}
                rotation={[-Math.PI / 2, 0, 0]}
                receiveShadow
            >
                <planeGeometry args={[roadWidth, TUNNEL_DEPTH]} />
                <meshStandardMaterial
                    {...asphalt}
                    roughness={1}
                    bumpScale={0.014}
                />
            </mesh>
        </group>
    );
}

function AlleyTunnelEnds({
    length,
    centerZ,
    curbInnerX,
    wallOuterX,
    roadWidth,
}) {
    const halfWidth = wallOuterX + 0.08;
    const centerY = FLOOR_Y + FACE_HEIGHT / 2;

    return [-1, 1].map((end) => {
        const endZ = centerZ + (end * length) / 2;
        return (
            <group
                key={end}
                name="alley-tunnel-end"
            >
                <group
                    position={[0, 0, endZ]}
                    rotation={[0, end === 1 ? Math.PI : 0, 0]}
                >
                    <TunnelPortal
                        halfWidth={halfWidth}
                        entranceRadius={curbInnerX}
                        roadWidth={roadWidth}
                    />
                </group>
                <StaticBounds
                    position={[0, -1.05, endZ + (end * TUNNEL_DEPTH) / 2]}
                    size={[roadWidth, 0.1, TUNNEL_DEPTH]}
                />
                {[-1, 1].map((side) => (
                    <StaticBounds
                        key={side}
                        position={[
                            (side * (halfWidth + curbInnerX)) / 2,
                            centerY,
                            endZ + (end * TUNNEL_DEPTH) / 2,
                        ]}
                        size={[
                            halfWidth - curbInnerX,
                            FACE_HEIGHT,
                            TUNNEL_DEPTH,
                        ]}
                    />
                ))}
            </group>
        );
    });
}

export default memo(AlleyTunnelEnds);
