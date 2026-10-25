function Housing({ position, size, color = "#a8b1ae", metalness = 0.65 }) {
    return (
        <mesh
            position={position}
            castShadow
            receiveShadow
        >
            <boxGeometry args={size} />
            <meshStandardMaterial
                color={color}
                metalness={metalness}
                roughness={0.38}
            />
        </mesh>
    );
}

// Built from geometry so the alley has no dependency on the old scene model.
export default function AirConditioner(props) {
    return (
        <group
            {...props}
            name="wall-air-conditioner"
        >
            <Housing
                position={[0, 0, 0]}
                size={[0.64, 0.46, 0.32]}
            />
            <Housing
                position={[0, 0.245, 0.015]}
                size={[0.68, 0.035, 0.37]}
                color="#bec5c1"
            />
            <Housing
                position={[0, 0, 0.165]}
                size={[0.57, 0.38, 0.018]}
                color="#303b3b"
                metalness={0.3}
            />
            <mesh position={[-0.065, 0, 0.18]}>
                <torusGeometry args={[0.155, 0.012, 6, 24]} />
                <meshStandardMaterial
                    color="#697777"
                    metalness={0.8}
                    roughness={0.35}
                />
            </mesh>
            {[0, 1, 2, 3, 4].map((i) => (
                <group
                    key={i}
                    position={[-0.065, 0, 0.18]}
                    rotation={[0, 0, (i * Math.PI * 2) / 5]}
                >
                    <Housing
                        position={[0.06, 0, 0]}
                        size={[0.12, 0.045, 0.012]}
                        color="#536160"
                    />
                </group>
            ))}
            {Array.from({ length: 10 }, (_, i) => (
                <Housing
                    key={i}
                    position={[-0.065, -0.153 + i * 0.034, 0.199]}
                    size={[0.34, 0.009, 0.012]}
                    color="#b3bfba"
                />
            ))}
            <Housing
                position={[0.22, 0, 0.185]}
                size={[0.07, 0.33, 0.025]}
                color="#c6ccc5"
            />
            <Housing
                position={[0.22, 0.1, 0.201]}
                size={[0.045, 0.018, 0.008]}
                color="#416f70"
            />
            {[-1, 1].map((side) => (
                <group key={side}>
                    <Housing
                        position={[side * 0.23, -0.275, -0.03]}
                        size={[0.045, 0.04, 0.42]}
                        color="#5e6865"
                    />
                    <Housing
                        position={[side * 0.23, -0.16, -0.215]}
                        size={[0.045, 0.27, 0.035]}
                        color="#5e6865"
                    />
                </group>
            ))}
            <Housing
                position={[0.36, -0.22, -0.13]}
                size={[0.035, 0.42, 0.035]}
                color="#b5a88b"
                metalness={0.2}
            />
        </group>
    );
}
