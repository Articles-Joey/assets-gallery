import { useEffect, useRef, useState, useLayoutEffect, useMemo, memo } from 'react';

import { Physics, useBox } from '@react-three/cannon';
import { Sky, Html, OrbitControls, Text } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';

import Ground from './Ground'

import Tree from '@/components/Game/Tree'
// import Building from './Building'
import Alley from './Alley'
import GallerySection from './GallerySection'

import { Player } from './Player'
import { FPV } from './FPV'

// import Platform from './Platform';
// import { useLocalStorage } from 'util/useLocalStorage';
import { useAssetGalleryStore } from '@/hooks/useAssetGalleryStore';

import useAssets from '@/hooks/useAssets';
// import useFullscreen from 'util/useFullScreen';

// import { useControlsStore } from '../Glass Ceiling/hooks/useGameStore';

// import ArticlesButton from '@/components/UI/Button';
import TouchControls from './TouchControls';
import { GLTFLoader } from 'three-stdlib';
import { degToRad } from 'three/src/math/MathUtils';

function Box(props) {

    const [size, set] = useState(1)
    const [hidden, setVisible] = useState(false)

    return (
        <group>
            <mesh {...props}>
                <boxGeometry args={props.testArgs || [0.95, 0.75, 0.1]} />
                <meshStandardMaterial
                    color={props.color || "#fff"}
                />
                <Html
                    style={{
                        transition: 'all 0.2s',
                        opacity: hidden ? 0 : 1,
                        transform: `scale(${hidden ? 1 : 1})`
                    }}
                    distanceFactor={1.5}
                    position={[0, 0, 0.06]}
                    transform
                    occlude
                    // occlude="blending"
                    // zIndexRange={1}
                    onOcclude={setVisible}
                >
                    <div className="w-100 h-100">{props.html}</div>
                    {/* <Slider style={{ width: 100 }} min={0.5} max={1} step={0.01} value={size} onChange={set} /> */}
                </Html>
            </mesh>
        </group>
    )
}

function AssetSectionImageAsset(props) {

    const [size, set] = useState(1)
    const [hidden, setVisible] = useState(false)

    return (
        <group>

            <mesh {...props}>

                <boxGeometry args={props.testArgs || [0.95, 0.75, 0.12]} />
                <meshStandardMaterial
                    color={props.color || "#fff"}
                />

                {true && <Html
                    style={{
                        transition: 'all 0.2s',
                        opacity: hidden ? 0 : 1,
                        transform: `scale(${hidden ? 1 : 1})`
                    }}
                    distanceFactor={1.5}
                    position={[0, 0, 0.06]}
                    transform
                    occlude
                    // occlude="blending"
                    // zIndexRange={1}
                    onOcclude={setVisible}
                >
                    <div className="w-100 h-100">{props.html}</div>
                    {/* <Slider style={{ width: 100 }} min={0.5} max={1} step={0.01} value={size} onChange={set} /> */}
                </Html>}

            </mesh>

        </group>
    )
}

function AssetSectionModelAsset({ asset_obj }) {

    const [blobUrl, setBlobUrl] = useState(null);

    // Fetch modelUrl and convert it to Blob
    useEffect(() => {
        if (asset_obj?.glb_file) {
            fetch(asset_obj?.glb_file?.location)
                .then((response) => response.blob())
                .then((blob) => {
                    const url = URL.createObjectURL(blob);
                    setBlobUrl(url);
                })
                .catch((error) => {
                    console.error('Error fetching model:', error);
                });
        }
    }, [asset_obj?.glb_file]);

    const [gltf, setGltf] = useState(null);

    useEffect(() => {
        if (blobUrl) {
            const loader = new GLTFLoader();
            loader.load(
                blobUrl,
                (loadedGltf) => {
                    setGltf(loadedGltf);
                },
                undefined,
                (error) => {
                    console.error('Error loading GLTF model:', error);
                }
            );
        }
    }, [blobUrl]);

    return (
        <group position={[2.25, -0.8, 0]}>

            <mesh position={[0, 0, 0]}>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial
                    color={gltf ? "gray" : 'red'}
                />
            </mesh>

            {gltf &&
                <group
                    position={[0, 0.55, 0]}
                    rotation={[
                        0,
                        degToRad(-90),
                        0
                    ]}
                >
                    <primitive scale={0.1} object={gltf.scene} />
                </group>
            }

            <Text
                rotation={[
                    0,
                    degToRad(-90),
                    0
                ]}
                position={[-0.51, 0.38, 0]}
                scale={0.1}
                color="white"
            >
                {asset_obj.name}
            </Text>

            <Text
                rotation={[
                    0,
                    degToRad(-90),
                    0
                ]}
                position={[-0.51, 0.28, 0]}
                scale={0.05}
                color="white"
            >
                @{asset_obj?.populated_user?.username}
            </Text>

        </group>
    )
}

function AssetSections(props) {

    const { data: assets, isLoading: assetsIsLoading, mutate: mutateAssets } = useAssets()

    const galleryTheme = useAssetGalleryStore(state => state.galleryTheme);

    // const { assets, galleryTheme } = props;

    const memoizedAssets = useMemo(() => {
        return assets?.map((asset_obj, i) => (
            <group
                key={asset_obj._id}
                position={[0, 0, (3 * -i)]}
            >

                {asset_obj.asset_type == "Image" &&
                    <AssetSectionImageAsset
                        // key={asset_obj._id}
                        color={getBoxColorFromTheme(galleryTheme)}
                        scale={1 * 2}
                        position={[2.5, 0.5, 0]}
                        rotation={[0, -Math.PI / 2, 0]}
                        html={
                            <div className="">
                                {/* <span>Asset</span>
                            <div className="small">{asset_obj._id}</div> */}
                                <img
                                    // src={asset_obj.file.location} 
                                    src={`${process.env.NEXT_PUBLIC_CDN}${asset_obj?.file?.thumbnail?.key}`}
                                    className="img-fluid"
                                    loading="lazy"
                                    style={{ maxWidth: '270px' }}
                                    width="250"
                                    alt=""
                                />
                                <div
                                    className="p-2 mt-auto card rounded-0"
                                    style={{ fontSize: '0.5rem' }}
                                >
                                    <div>{asset_obj.name}</div>
                                    <div>{asset_obj.city}, {asset_obj.state}</div>
                                    <div>By @{asset_obj.populated_user.username}</div>
                                </div>
                            </div>
                        }
                    />
                }

                {asset_obj.asset_type == "3D Model" &&
                    <AssetSectionModelAsset
                        asset_obj={asset_obj}
                    />
                }

                {(galleryTheme == 'Forest') &&
                    <group position={[0, 0, 0]}>

                        {/* Main Row */}
                        <Tree
                            scale={0.2}
                            position={[4, -1, 0]}
                        />

                        <Tree
                            scale={0.2}
                            position={[-4, -1, 0]}
                        />

                        {/* Background Row */}
                        <Tree
                            scale={0.4}
                            position={[6, -1, 0]}
                        />

                        <Tree
                            scale={0.4}
                            position={[-6, -1, 0]}
                        />

                    </group>
                }

                {(galleryTheme == 'Alley') &&
                    <group position={[1, 0, 0]}>

                        <Alley
                            scale={0.08}
                            position={[0.6, -0.95, 0]}
                            rotation={[0, Math.PI / 1, 0]}
                        // zIndexRange={2}
                        />
                        <Alley
                            scale={0.08}
                            position={[-2.5, -0.95, 0]}
                        // zIndexRange={2}
                        />

                    </group>
                }

                {(galleryTheme == 'Museum') &&
                    <group position={[0, 0, 0]}>

                        <GallerySection
                            scale={1}
                            position={[-2.5, -0.5, 0]}
                            section_i={i}
                        />

                    </group>
                }

            </group>
        ));
    }, [assets, galleryTheme]);

    function getBoxColorFromTheme(theme) {

        let color = ''

        switch (theme) {
            case "Forest":
                color = "#126915";
                break;
            case "Museum":
                color = "#ffffff";
                break;
            case "Alley":
                color = "#000";
                break;
        }

        return color

    }

    return (
        <>
            {/* Sign */}
            {/* <Box
                scale={1 * 1}
                position={[-2.8, 0.8, -3.3]}
                rotation={[0, Math.PI / 3., 0]}
                testArgs={[0.95, 0.5, 0.1]}
                color="#fff"
                html={
                    <>
                        <span>Assets</span>
                        <h5>{assets?.length}</h5>
                    </>
                }
            /> */}

            {/* Sign Post */}
            {/* <Box
                scale={1 * 1}
                position={[-2.8, 0, -3.3]}
                rotation={[0, Math.PI / 3., 0]}
                testArgs={[.05, 1.2, .05]}
                color="#fff"
            /> */}

            {memoizedAssets}

            {/* {assets.map((asset_obj, i) => {
                return (
                    <Box
                        key={asset_obj._id}
                        color={getBoxColorFromTheme(assetGalleryTheme)}
                        scale={1 * 2}
                        position={[3.5, 1, (-35.3 + 4 * i)]}
                        rotation={[0, -Math.PI / 4, 0]}
                        html={
                            <div className="">
                                <img
                                    src={`${process.env.NEXT_PUBLIC_CDN}${asset_obj?.file?.thumbnail?.key}`}
                                    className="img-fluid"
                                    loading="lazy"
                                    style={{ maxWidth: '270px' }}
                                    width="250"
                                />
                                <div
                                    className="p-2 mt-auto card rounded-0"
                                    style={{ fontSize: '0.5rem' }}
                                >
                                    <div>{asset_obj.name}</div>
                                    <div>{asset_obj.city}, {asset_obj.state}</div>
                                    <div>By @{asset_obj.populated_user.username}</div>
                                </div>
                            </div>
                        }
                    />
                )
            })} */}

        </>
    )
}

function GameCanvas({
    isFullscreen,
    requestFullscreen,
    exitFullscreen,
    menuOpen
}) {

    const controlType = useAssetGalleryStore(state => state.controlType);
    const galleryTheme = useAssetGalleryStore(state => state.galleryTheme);
    // const setGalleryTheme = useAssetGalleryStore(state => state.setGalleryTheme);
    const music = useAssetGalleryStore(state => state.music);
    // const setMusic = useAssetGalleryStore(state => state.setMusic);

    useEffect(() => {

        if (!galleryTheme || !music) {
            return
        }

        console.log("assetGalleryTheme changed, reload sound")

        let musicElement

        switch (galleryTheme) {
            case "Forest":
                musicElement = new Audio(`${process.env.NEXT_PUBLIC_CDN}audio-test/nature-sounds.mp3`)
                break;
            case "Museum":
                musicElement = new Audio(`${process.env.NEXT_PUBLIC_CDN}games/Assets+Gallery/peaceful-piano-loop-6903.mp3`)
                break;
            case "Alley":
                musicElement = new Audio(`${process.env.NEXT_PUBLIC_CDN}games/Assets+Gallery/Street-Ambience-3.mp3`)
                break;
        }

        if (!musicElement) return

        musicElement.currentTime = 0
        // ping.volume = clamp(velocity / 20, 0, 1)
        musicElement.play()

        musicElement.onended = function () {
            console.log("audio ended")
            musicElement.currentTime = 0
            musicElement.play()
        };

        return () => {
            musicElement.pause();
        }

    }, [galleryTheme, music])

    // const [location, setLocation] = useState([0, 0, 0])

    const memoizedTrees = useMemo(() => {
        return [...Array(10)].map((item, i) =>
            <group key={i}>

                {/* Main Row */}
                <Tree
                    scale={0.2}
                    position={[4, -0.75, (-36 + i * 4)]}
                // zIndexRange={2}
                />
                <Tree
                    scale={0.2}
                    position={[-4, -0.75, (-36 + i * 4)]}
                // zIndexRange={2}
                />

                {/* Background Row */}
                <Tree
                    scale={0.2}
                    position={[7, -0.75, (-34 + i * 4)]}
                // zIndexRange={2}
                />
                <Tree
                    scale={0.2}
                    position={[-7, -0.75, (-34 + i * 4)]}
                // zIndexRange={2}
                />

            </group>
        )
    }, []);

    // useEffect(() => {
    //     const handleFullScreenChange = () => {
    //         console.log("Test")
    //         requestFullscreen("gallery-canvas-wrap");
    //     };

    //     document.addEventListener('fullscreenchange', handleFullScreenChange);

    //     // Clean up event listener on component unmount
    //     return () => {
    //         document.removeEventListener('fullscreenchange', handleFullScreenChange);
    //     };
    // }, []);

    return (
        <div
            className={`canvas-wrap ${isFullscreen && 'fullscreen'}`}
        >

            <Canvas style={{ zIndex: 1 }} id="gallery-canvas">

                {/* https://codepen.io/ogames/pen/rNmYpdo */}
                {controlType == "Touch" &&
                    <OrbitControls
                    // enabled={!menuOpen}
                    />
                }

                <Sky sunPosition={[100, 100, 20]} />

                <ambientLight intensity={1.5} />

                {controlType == "Mouse and Keyboard" &&
                    <FPV
                    // location={location}
                    // setLocation={setLocation}
                    // menuOpen={menuOpen}
                    />
                }

                <AssetSections />

                <Physics
                    iterations={10}
                    gravity={[0, -10, 0]}
                >

                    {controlType == "Mouse and Keyboard" &&
                        <Player />
                    }

                    {/* <Platform /> */}

                    {/* <Platform position={[5, 0, 0]} /> */}

                    {/* <Platform position={[10, 0, 0]} /> */}

                    {/* {galleryTheme == 'Museum' &&
                        <GallerySection
                            scale={1}
                            position={[0, 0, 0]}
                        />
                    } */}

                    {/* {galleryTheme == 'Forest' &&
                        memoizedTrees
                    } */}

                    {/* {galleryTheme == 'Alley' &&
                        [...Array(10)].map((item, i) =>
                            <group key={i}>
                                <Alley
                                    scale={0.15}
                                    position={[1, -0.4, (-36 + i * 5.90)]}
                                    rotation={[0, Math.PI / 1, 0]}
                                // zIndexRange={2}
                                />
                                <Alley
                                    scale={0.15}
                                    position={[-1, -0.4, (-36 + i * 5.90)]}
                                // zIndexRange={2}
                                />
                            </group>
                        )
                    } */}

                    {/* {galleryTheme == 'Museum' &&
                        [...Array(10)].map((item, i) => <>
                            <group key={i}>
                                <mesh
                                    scale={1}
                                    position={[3.5, 0, (-39.3 + 4 * i)]}
                                >
                                    <boxGeometry args={[0.1, 1, 0.1]} />
                                    <meshStandardMaterial
                                        color={"#000"}
                                    />
                                </mesh>
                            </group>
                        </>)
                    } */}

                    <Ground />

                </Physics>

            </Canvas>

            <div className='absolute centered cursor noselect'>+</div>

            {controlType == "Touch" &&
                <TouchControls
                    touchControlsEnabled={true}
                />
            }

        </div>
    );
}

export default memo(GameCanvas)