import { memo, useEffect, useState } from "react";

import { usePlane } from "@react-three/cannon"
// import { useStore } from 'components/Games/Epcot/hooks/useStore'

import { NearestFilter, TextureLoader, RepeatWrapping } from 'three'
import { useAssetGalleryStore } from "@/hooks/useAssetGalleryStore";

const Ground = () => {

    const [ref] = usePlane(() => ({
        rotation: [-Math.PI / 2, 0, 0], position: [0, -1, 0]
    }))

    const {
        galleryTheme
    } = useAssetGalleryStore(state => ({
        galleryTheme: state.galleryTheme,
    }));

    // let groundTexture

    // const [addCube] = useStore((state) => [state.addCube])
    // const [addTree] = useStore((state) => [state.addTree])

    const [groundTexture, setGroundTexture] = useState(null);

    useEffect(() => {
        const loader = new TextureLoader();
        const texture = loader.load(
            `${process.env.NEXT_PUBLIC_CDN}games/Assets Gallery/lawn-grass-pattern-and-texture-for-background-vector.jpg`
        );

        texture.magFilter = NearestFilter;
        texture.wrapS = RepeatWrapping;
        texture.wrapT = RepeatWrapping;
        texture.repeat.set(10, 100);

        setGroundTexture(texture);

        // Cleanup the texture to avoid memory leaks
        return () => {
            texture.dispose();
        };
    }, [galleryTheme]);

    return (
        <mesh
            ref={ref}
        >
            <planeGeometry attach='geometry' args={[15, 100]} />

            {/* <meshStandardMaterial color={'green'} /> */}
            {/* {galleryTheme == "Museum" && <meshStandardMaterial attach='material' color={'white'} />}
            {galleryTheme == "Forest" && <meshStandardMaterial attach='material' map={groundTexture} />}1 */}

            <meshStandardMaterial
                attach="material"
                color={galleryTheme === "Museum" ? "white" : undefined}
                map={galleryTheme === "Forest" && groundTexture ? groundTexture : undefined}
            />

        </mesh>
    )
}

// const arePropsEqual = (prevProps, nextProps) => {
//     // Compare all props for equality
//     return JSON.stringify(prevProps) === JSON.stringify(nextProps);
// };

const MemoizedGround = memo(
    Ground,
    // arePropsEqual
);

export default MemoizedGround