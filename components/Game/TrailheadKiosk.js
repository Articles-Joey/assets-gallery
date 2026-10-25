import { Text } from "@react-three/drei";
import { useEffect, useMemo } from "react";
import { createTimberGeometry, getKioskWoodMaps } from "./kioskWood";

function Timber({ position, size, rotation = [0, 0, 0], color = "#ffffff" }) {
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
            <meshStandardMaterial
                {...maps}
                color={color}
                roughness={1}
                bumpScale={0.008}
                polygonOffset
                polygonOffsetFactor={-1}
                polygonOffsetUnits={-1}
            />
        </mesh>
    );
}

function MetalMaterial({ color = "#9ca7a4", roughness = 0.24 }) {
    return (
        <meshPhysicalMaterial
            color={color}
            metalness={0.88}
            roughness={roughness}
            clearcoat={0.65}
            clearcoatRoughness={0.18}
            envMapIntensity={1.25}
        />
    );
}

function MetalBox({ position, size, color, roughness }) {
    return (
        <mesh
            position={position}
            castShadow
            receiveShadow
        >
            <boxGeometry args={size} />
            <MetalMaterial
                color={color}
                roughness={roughness}
            />
        </mesh>
    );
}

// Children contain the image and captions; each theme can supply its own wrapper.
export default function TrailheadKiosk({
    children,
    color,
    testArgs,
    html,
    ...props
}) {
    const pitch = Math.atan2(0.34, 0.85);
    const slopeLength = Math.hypot(0.85, 0.34);
    return (
        <group
            {...props}
            name="trailhead-kiosk"
        >
            {[-1, 1].map((side) => (
                <group key={side}>
                    <Timber
                        position={[side * 0.64, 0, -0.035]}
                        size={[0.13, 1.5, 0.16]}
                    />
                    <MetalBox
                        position={[side * 0.64, -0.69, -0.035]}
                        size={[0.15, 0.12, 0.18]}
                        color="#a3aaa5"
                        roughness={0.28}
                    />
                    <Timber
                        position={[side * 0.5, 0.63, -0.035]}
                        size={[0.08, 0.38, 0.12]}
                        rotation={[0, 0, (side * -Math.PI) / 4]}
                    />
                    <Timber
                        position={[side * 0.56, 0, 0.035]}
                        size={[0.045, 0.94, 0.065]}
                    />
                    <Timber
                        position={[0, side * 0.45, 0.035]}
                        size={[1.16, 0.045, 0.065]}
                    />
                    {[-0.39, 0.39].map((y) => (
                        <mesh
                            key={y}
                            position={[side * 0.56, y, 0.074]}
                            rotation={[Math.PI / 2, 0, 0]}
                        >
                            <cylinderGeometry args={[0.009, 0.009, 0.006, 8]} />
                            <MetalMaterial
                                color="#a8afaa"
                                roughness={0.2}
                            />
                        </mesh>
                    ))}
                </group>
            ))}
            <Timber
                position={[0, 0, -0.045]}
                size={[1.16, 0.94, 0.13]}
                color="#554837"
            />
            <Timber
                position={[0, 0.59, 0]}
                size={[1.35, 0.18, 0.18]}
            />
            <Text
                position={[0, 0.59, 0.095]}
                fontSize={0.068}
                maxWidth={1.2}
                color="#352d20"
                anchorX="center"
                anchorY="middle"
            >
                TRAIL GALLERY
            </Text>
            {[-1, 1].map((side) => (
                <group
                    key={side}
                    position={[side * 0.425, 0.86, -0.015]}
                    rotation={[0, 0, -side * pitch]}
                >
                    <Timber
                        position={[0, -0.05, 0]}
                        size={[slopeLength + 0.06, 0.065, 0.76]}
                    />
                    <mesh
                        renderOrder={1}
                        castShadow
                        receiveShadow
                    >
                        <boxGeometry args={[slopeLength + 0.06, 0.025, 0.82]} />
                        <MetalMaterial
                            color="#28786f"
                            roughness={0.23}
                        />
                    </mesh>
                    {Array.from({ length: 8 }, (_, i) => (
                        <mesh
                            key={i}
                            renderOrder={1}
                            position={[
                                -slopeLength / 2 +
                                    ((i + 0.5) * slopeLength) / 8,
                                0.024,
                                0,
                            ]}
                            castShadow
                        >
                            <boxGeometry args={[0.012, 0.025, 0.82]} />
                            <MetalMaterial
                                color="#3c9184"
                                roughness={0.19}
                            />
                        </mesh>
                    ))}
                    {[-0.4, 0.4].map((z) => (
                        <Timber
                            key={z}
                            position={[0, -0.0225, z]}
                            size={[slopeLength + 0.1, 0.075, 0.045]}
                        />
                    ))}
                </group>
            ))}
            <mesh
                renderOrder={1}
                position={[0, 1.035, -0.015]}
                castShadow
            >
                <boxGeometry args={[0.075, 0.04, 0.85]} />
                <MetalMaterial
                    color="#276b61"
                    roughness={0.22}
                />
            </mesh>
            <MetalBox
                position={[0.78, -0.2, 0]}
                size={[0.16, 0.3, 0.17]}
                color="#687b70"
                roughness={0.22}
            />
            <MetalBox
                position={[0.78, -0.12, 0.09]}
                size={[0.12, 0.018, 0.015]}
                color="#26362f"
                roughness={0.3}
            />
            {children}
        </group>
    );
}
