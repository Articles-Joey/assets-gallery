// The image and captions are supplied by the gallery; this scene owns the frame.
export default function AlleyImageFrame({
    children,
    color,
    testArgs,
    html,
    ...props
}) {
    return (
        <group
            {...props}
            name="alley-image-frame"
        >
            <mesh
                castShadow
                receiveShadow
            >
                <boxGeometry args={[0.99, 0.79, 0.1]} />
                <meshStandardMaterial
                    color="#202625"
                    metalness={0.65}
                    roughness={0.35}
                />
            </mesh>
            {children}
        </group>
    );
}
