import { useLayoutEffect, useRef } from "react";
import { Billboard, Text } from "@react-three/drei";

export default function Nickname({ children, position = [0, 1, 0] }) {
    const ref = useRef();
    useLayoutEffect(() => {
        // Drei's forwarded ref points to the outer group. Its inner group
        // needs yaw-first Euler angles so locking X/Z preserves a full turn.
        const facingGroup = ref.current?.children[0];
        if (facingGroup) facingGroup.rotation.order = "YXZ";
    }, [children]);

    if (!children) return null;

    return (
        <Billboard
            ref={ref}
            position={position}
            follow
            lockX
            lockZ
        >
            <Text
                fontSize={0.15}
                maxWidth={2.4}
                anchorX="center"
                anchorY="bottom"
                textAlign="center"
                color="white"
                outlineWidth={0.012}
                outlineColor="#17251c"
                material-toneMapped={false}
            >
                {children}
            </Text>
        </Billboard>
    );
}
