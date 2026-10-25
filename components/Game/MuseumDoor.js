import { memo, useEffect, useMemo } from "react";
import { Base, Geometry, Subtraction } from "@react-three/csg";
import { createTimberGeometry, getKioskWoodMaps } from "./kioskWood";
import { getMuseumFrostedGlassTexture } from "./museumMaterials";

export const DOOR_THICKNESS = 0.075;
export const DOOR_BOTTOM_GAP = 0.012;
export const DOOR_SIDE_GAP = 0.025;

function MuseumDoor({ width, height }) {
    const wood = useMemo(() => getKioskWoodMaps(), []);
    const frost = useMemo(() => getMuseumFrostedGlassTexture(), []);
    const geometry = useMemo(() => {
        const panel = createTimberGeometry([width, height, DOOR_THICKNESS]);
        panel.translate(width / 2, height / 2, 0);
        return panel;
    }, [width, height]);
    useEffect(() => () => geometry.dispose(), [geometry]);
    const windowWidth = width * 0.64;
    const windowHeight = height * 0.08;
    const windows = [0.88, 0.69, 0.5, 0.31, 0.12];

    return (
        <group name="museum-open-modern-door">
            <mesh
                castShadow
                receiveShadow
                userData={{ cameraObstacle: true }}
            >
                <Geometry key={`${width}-${height}`}>
                    <Base geometry={geometry} />
                    {windows.map((level) => (
                        <Subtraction
                            key={level}
                            position={[width / 2, height * level, 0]}
                        >
                            <boxGeometry
                                args={[
                                    windowWidth,
                                    windowHeight,
                                    DOOR_THICKNESS * 4,
                                ]}
                            />
                        </Subtraction>
                    ))}
                </Geometry>
                <meshPhysicalMaterial
                    {...wood}
                    color="#514b47"
                    roughness={0.65}
                    bumpScale={0.003}
                    clearcoat={0.22}
                    clearcoatRoughness={0.4}
                />
            </mesh>
            {windows.map((level) => (
                <group
                    key={level}
                    position={[width / 2, height * level, 0]}
                >
                    <mesh>
                        <boxGeometry
                            args={[
                                windowWidth - 0.014,
                                windowHeight - 0.014,
                                0.018,
                            ]}
                        />
                        <meshStandardMaterial
                            color="#c0ced0"
                            transparent
                            opacity={0.68}
                            depthWrite={false}
                            roughness={0.85}
                            roughnessMap={frost}
                            bumpMap={frost}
                            bumpScale={0.0007}
                            envMapIntensity={0.65}
                        />
                    </mesh>
                    {[-1, 1].map((face) => (
                        <group
                            key={face}
                            position={[
                                0,
                                0,
                                face * (DOOR_THICKNESS / 2 + 0.002),
                            ]}
                        >
                            {[-1, 1].map((edge) => (
                                <group key={edge}>
                                    <mesh
                                        position={[
                                            (edge * windowWidth) / 2,
                                            0,
                                            0,
                                        ]}
                                    >
                                        <boxGeometry
                                            args={[
                                                0.012,
                                                windowHeight + 0.012,
                                                0.008,
                                            ]}
                                        />
                                        <meshStandardMaterial
                                            color="#272c29"
                                            metalness={0.5}
                                            roughness={0.4}
                                        />
                                    </mesh>
                                    <mesh
                                        position={[
                                            0,
                                            (edge * windowHeight) / 2,
                                            0,
                                        ]}
                                    >
                                        <boxGeometry
                                            args={[windowWidth, 0.012, 0.008]}
                                        />
                                        <meshStandardMaterial
                                            color="#272c29"
                                            metalness={0.5}
                                            roughness={0.4}
                                        />
                                    </mesh>
                                </group>
                            ))}
                        </group>
                    ))}
                </group>
            ))}
            {[-1, 1].map((face) => (
                <group key={face}>
                    {[0.43, 0.51].map((level, index) => (
                        <mesh
                            key={level}
                            position={[
                                width - 0.11,
                                height * level,
                                face * (DOOR_THICKNESS / 2 + 0.02),
                            ]}
                            rotation={[Math.PI / 2, 0, 0]}
                            castShadow
                        >
                            <cylinderGeometry
                                args={[
                                    index ? 0.026 : 0.035,
                                    index ? 0.026 : 0.035,
                                    index ? 0.018 : 0.045,
                                    16,
                                ]}
                            />
                            <meshStandardMaterial
                                color="#171c19"
                                metalness={0.75}
                                roughness={0.35}
                            />
                        </mesh>
                    ))}
                </group>
            ))}
            {[0.2, 0.5, 0.8].map((level) => (
                <mesh
                    key={level}
                    position={[0.008, height * level, 0]}
                    castShadow
                >
                    <cylinderGeometry args={[0.016, 0.016, 0.1, 10]} />
                    <meshStandardMaterial
                        color="#343b36"
                        metalness={0.7}
                        roughness={0.35}
                    />
                </mesh>
            ))}
        </group>
    );
}

export default memo(MuseumDoor);
