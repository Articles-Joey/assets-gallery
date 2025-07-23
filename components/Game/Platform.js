import { useState } from 'react';

import { useBox } from '@react-three/cannon';

export default function Platform(props) {

    // This reference gives us direct access to the THREE.Mesh object
    // const ref = useRef()

    const platform_size = [1, 1, 1]

    const [ref] = useBox(() => ({
        mass: 0,
        position: props.position,
        args: platform_size, // Dimensions of the cube
    }));

    // Hold state for hovered and clicked events
    const [hovered, hover] = useState(false)
    const [clicked, click] = useState(false)

    // Subscribe this component to the render-loop, rotate the mesh every frame
    // useFrame((state, delta) => (ref.current.rotation.x += delta))

    // Return the view, these are regular Threejs elements expressed in JSX
    return (
        <mesh
            {...props}
            ref={ref}
            scale={2}
            // onClick={(event) => click(!clicked)}
            // onPointerOver={(event) => (event.stopPropagation(), hover(true))}
            // onPointerOut={(event) => hover(false)}
        >
            <boxGeometry {...props} />
            <meshStandardMaterial color={hovered ? 'hotpink' : (props.color || 'orange')} />
        </mesh>
    )

}