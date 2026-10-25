import { useEffect, useMemo } from "react";
import { useBox, useConvexPolyhedron } from "@react-three/cannon";
import { Base, Geometry, Subtraction } from "@react-three/csg";
import { ExtrudeGeometry, Shape } from "three";
import { CORRIDOR_WIDTH_SCALE, MUSEUM_LAYOUT } from "./sceneLayout";
import { getMuseumRoofLayout } from "./museumRoofLayout";
import { getMuseumBrickMaps, projectMuseumBrickUVs } from "./museumMaterials";
import { createTimberGeometry, getKioskWoodMaps } from "./kioskWood";
import MuseumFourPaneWindow from "./MuseumFourPaneWindow";
import MuseumDoor, {
    DOOR_BOTTOM_GAP,
    DOOR_SIDE_GAP,
    DOOR_THICKNESS,
} from "./MuseumDoor";

function WoodTrim({ position, size, rotation = [0, 0, 0] }) {
    const [width, height, depth] = size;
    const geometry = useMemo(
        () => createTimberGeometry([width, height, depth]),
        [width, height, depth],
    );
    const maps = useMemo(() => getKioskWoodMaps(), []);
    useEffect(() => () => geometry.dispose(), [geometry]);
    return (
        <mesh
            position={position}
            rotation={rotation}
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

function EndWall({ halfWidth, thickness, roof }) {
    const { floorY, ceilingY, doorWidth, doorHeight } = MUSEUM_LAYOUT;
    const maps = useMemo(() => getMuseumBrickMaps(), []);
    const edgeY = roof.ridgeY - halfWidth * Math.tan(roof.angle);
    const geometry = useMemo(() => {
        const profile = new Shape();
        profile.moveTo(-halfWidth, floorY);
        profile.lineTo(halfWidth, floorY);
        profile.lineTo(halfWidth, edgeY);
        profile.lineTo(0, roof.ridgeY);
        profile.lineTo(-halfWidth, edgeY);
        profile.closePath();
        const wall = new ExtrudeGeometry(profile, {
            depth: thickness,
            bevelEnabled: false,
        });
        wall.translate(0, 0, -thickness / 2);
        return projectMuseumBrickUVs(wall);
    }, [halfWidth, floorY, edgeY, roof.ridgeY, thickness]);
    useEffect(() => () => geometry.dispose(), [geometry]);
    const sideLength = halfWidth - doorWidth / 2;
    const leafWidth = doorWidth - DOOR_SIDE_GAP * 2;
    const leafHeight = doorHeight - 0.035;
    const sideWindowOuterX = halfWidth - 0.6;
    const sideWindowInnerX = doorWidth / 2 + leafWidth + 0.2;
    const sideWindowWidth = Math.min(3.6, sideWindowOuterX - sideWindowInnerX);
    const sideWindowX = sideWindowOuterX - sideWindowWidth / 2;
    const sideWindowHeight = 1.1;
    const sideWindowY = floorY + 1.4;
    const hingeX = -doorWidth / 2 + DOOR_SIDE_GAP;
    const hingeZ = thickness / 2 + 0.075;
    const rakeLength = halfWidth / Math.cos(roof.angle);
    const roundWindowY = edgeY + (roof.ridgeY - edgeY) * 0.4;
    const roundWindowRadius = 0.66;
    const windowWood = useMemo(() => getKioskWoodMaps(), []);

    return (
        <group name="museum-gabled-end-wall">
            <mesh
                renderOrder={1}
                castShadow
                receiveShadow
                userData={{ cameraObstacle: true }}
            >
                <Geometry>
                    <Base geometry={geometry} />
                    {[-1, 1].map((side) => (
                        <Subtraction key={`side-window-${side}`} position={[side * sideWindowX, sideWindowY, 0]}>
                            <boxGeometry args={[sideWindowWidth, sideWindowHeight, thickness * 4]} />
                        </Subtraction>
                    ))}
                    <Subtraction
                        position={[0, floorY + doorHeight / 2 - 0.01, 0]}
                    >
                        <boxGeometry
                            args={[doorWidth, doorHeight + 0.02, thickness * 4]}
                        />
                    </Subtraction>
                    <Subtraction
                        position={[0, roundWindowY, 0]}
                        rotation={[Math.PI / 2, 0, 0]}
                    >
                        <cylinderGeometry
                            args={[
                                roundWindowRadius,
                                roundWindowRadius,
                                thickness * 4,
                                48,
                            ]}
                        />
                    </Subtraction>
                </Geometry>
                <meshStandardMaterial
                    {...maps}
                    color="#ffffff"
                    roughness={1}
                    bumpScale={0.018}
                />
            </mesh>
            {[-1, 1].map((side) => (
                <MuseumFourPaneWindow
                    key={`four-pane-${side}`}
                    position={[side * sideWindowX, sideWindowY, 0]}
                    width={sideWindowWidth}
                    height={sideWindowHeight}
                    wallThickness={thickness}
                />
            ))}
            <mesh
                position={[0, roundWindowY, 0]}
                rotation={[Math.PI / 2, 0, 0]}
            >
                <cylinderGeometry
                    args={[
                        roundWindowRadius - 0.012,
                        roundWindowRadius - 0.012,
                        0.018,
                        48,
                    ]}
                />
                <meshStandardMaterial
                    color="#b4d2d8"
                    transparent
                    opacity={0.3}
                    roughness={0.22}
                    metalness={0.05}
                    depthWrite={false}
                />
            </mesh>
            {[-1, 1].map((face) => (
                <mesh
                    key={`round-window-${face}`}
                    position={[0, roundWindowY, face * (thickness / 2 + 0.03)]}
                    renderOrder={2}
                    castShadow
                    receiveShadow
                >
                    <torusGeometry
                        args={[roundWindowRadius + 0.035, 0.055, 8, 48]}
                    />
                    <meshStandardMaterial
                        {...windowWood}
                        color="#655a53"
                        roughness={0.65}
                        bumpScale={0.002}
                        polygonOffset
                        polygonOffsetFactor={-1}
                        polygonOffsetUnits={-1}
                    />
                </mesh>
            ))}
            {[-1, 1].map((face) => (
                <group
                    key={face}
                    position={[0, 0, face * (thickness / 2 + 0.035)]}
                >
                    {[-1, 1].map((side) => (
                        <group key={side}>
                            <WoodTrim
                                position={[
                                    side * (doorWidth / 2 + 0.055),
                                    floorY + doorHeight / 2,
                                    0,
                                ]}
                                size={[0.11, doorHeight + 0.11, 0.09]}
                            />
                            <WoodTrim
                                position={[
                                    side * (doorWidth / 2 + sideLength / 2),
                                    floorY + 0.075,
                                    0,
                                ]}
                                size={[sideLength, 0.15, 0.09]}
                            />
                            <WoodTrim
                                position={[
                                    side * (doorWidth / 2 + sideLength / 2),
                                    floorY + 0.17,
                                    0,
                                ]}
                                size={[sideLength, 0.035, 0.12]}
                            />
                            <WoodTrim
                                position={[
                                    (side * halfWidth) / 2,
                                    (edgeY + roof.ridgeY) / 2 - 0.06,
                                    0,
                                ]}
                                rotation={[0, 0, -side * roof.angle]}
                                size={[rakeLength, 0.12, 0.09]}
                            />
                        </group>
                    ))}
                    <WoodTrim
                        position={[0, floorY + doorHeight + 0.055, 0]}
                        size={[doorWidth + 0.22, 0.11, 0.09]}
                    />
                    <WoodTrim
                        position={[0, ceilingY - 0.1, 0]}
                        size={[halfWidth * 2, 0.15, 0.1]}
                    />
                </group>
            ))}
            {/* A full 180-degree swing leaves the opening unobstructed. */}
            <group
                position={[hingeX, floorY + DOOR_BOTTOM_GAP, hingeZ]}
                rotation={[0, Math.PI, 0]}
            >
                <MuseumDoor
                    width={leafWidth}
                    height={leafHeight}
                />
            </group>
        </group>
    );
}

function Bounds({ position, size }) {
    useBox(() => ({ type: "Static", position, args: size }), undefined, [
        ...position,
        ...size,
    ]);
    return null;
}

function GableBounds({ position, halfWidth, edgeY, ridgeY, thickness }) {
    const [x, y, z] = position;
    const centerY = (edgeY * 2 + ridgeY) / 3;
    const vertices = useMemo(
        () => [
            [-halfWidth, edgeY - centerY, -thickness / 2],
            [halfWidth, edgeY - centerY, -thickness / 2],
            [0, ridgeY - centerY, -thickness / 2],
            [-halfWidth, edgeY - centerY, thickness / 2],
            [halfWidth, edgeY - centerY, thickness / 2],
            [0, ridgeY - centerY, thickness / 2],
        ],
        [halfWidth, edgeY, ridgeY, thickness, centerY],
    );
    useConvexPolyhedron(
        () => ({
            type: "Static",
            position: [x, y + centerY, z],
            args: [
                vertices,
                [
                    [0, 2, 1],
                    [3, 4, 5],
                    [0, 1, 4, 3],
                    [1, 2, 5, 4],
                    [2, 0, 3, 5],
                ],
            ],
        }),
        undefined,
        [x, y, z, halfWidth, edgeY, ridgeY, thickness, centerY],
    );
    return null;
}

export default function MuseumEndWalls({ count, section_spacing }) {
    const {
        originX,
        originY,
        floorY,
        wallThickness,
        wallOffset,
        width,
        doorWidth,
        doorHeight,
    } = MUSEUM_LAYOUT;
    const roof = useMemo(
        () => getMuseumRoofLayout(section_spacing),
        [section_spacing],
    );
    const halfWidth =
        (width / 2 + wallOffset + wallThickness / 2) * CORRIDOR_WIDTH_SCALE;
    const edgeY = roof.ridgeY - halfWidth * Math.tan(roof.angle);
    const sideWidth = halfWidth - doorWidth / 2;
    const sideHeight = edgeY - floorY;
    const headerHeight = edgeY - floorY - doorHeight;
    const leafWidth = doorWidth - DOOR_SIDE_GAP * 2;
    const leafHeight = doorHeight - 0.035;
    const hingeX = -doorWidth / 2 + DOOR_SIDE_GAP;
    const hingeZ = wallThickness / 2 + 0.075;

    return [-1, 1].map((end) => {
        const endZ =
            end === 1
                ? section_spacing / 2
                : -(count - 1) * section_spacing - section_spacing / 2;
        const facing = end === 1 ? -1 : 1;
        return (
            <group
                key={end}
                name="museum-end-cap"
            >
                <group
                    position={[originX, originY, endZ]}
                    rotation={[0, end === 1 ? Math.PI : 0, 0]}
                >
                    <EndWall
                        halfWidth={halfWidth}
                        thickness={wallThickness}
                        roof={roof}
                    />
                </group>
                {[-1, 1].map((side) => (
                    <Bounds
                        key={side}
                        position={[
                            originX + side * (doorWidth / 2 + sideWidth / 2),
                            originY + floorY + sideHeight / 2,
                            endZ,
                        ]}
                        size={[sideWidth, sideHeight, wallThickness]}
                    />
                ))}
                <Bounds
                    position={[
                        originX,
                        originY + floorY + doorHeight + headerHeight / 2,
                        endZ,
                    ]}
                    size={[doorWidth, headerHeight, wallThickness]}
                />
                <GableBounds
                    position={[originX, originY, endZ]}
                    halfWidth={halfWidth}
                    edgeY={edgeY}
                    ridgeY={roof.ridgeY}
                    thickness={wallThickness}
                />
                <Bounds
                    position={[
                        originX + facing * (hingeX - leafWidth / 2),
                        originY + floorY + DOOR_BOTTOM_GAP + leafHeight / 2,
                        endZ + facing * hingeZ,
                    ]}
                    size={[leafWidth, leafHeight, DOOR_THICKNESS]}
                />
            </group>
        );
    });
}
