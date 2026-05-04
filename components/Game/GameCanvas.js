import { useEffect, useRef, useState, useLayoutEffect, useMemo, memo, useCallback } from 'react';

import { Physics, useBox } from '@react-three/cannon';
import { Sky, Html, OrbitControls, Text, Image, Stats } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';

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

// import useAssets from '@/hooks/useAssets';
// import useFullscreen from 'util/useFullScreen';

// import { useControlsStore } from '../Glass Ceiling/hooks/useGameStore';

// import ArticlesButton from '@/components/UI/Button';
// import TouchControls from './TouchControls';
// import CameraZoomIndicator from '@/components/UI/CameraZoomIndicator';
import { degToRad } from 'three/src/math/MathUtils';

import useFullscreen from '@articles-media/articles-dev-box/useFullscreen';
import { useStore } from '@/hooks/useStore';
import SocketPlayers from './SocketPlayers';

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

function AssetSectionImageAsset({ asset_obj, ...props }) {

    const galleryTheme = useAssetGalleryStore(state => state.galleryTheme)

    const [size, set] = useState(1)
    const [hidden, setVisible] = useState(false)

    // const textColor = galleryTheme !== 'Museum' ? '#fff' : '#000'
    const textColor = useMemo(() => galleryTheme !== 'Museum' ? '#fff' : '#000', [galleryTheme])
    // const textColor = "#000"

    return (
        <group>

            <mesh {...props}>

                <boxGeometry args={props.testArgs || [0.95, 0.75, 0.12]} />
                <meshStandardMaterial
                    color={props.color || "#fff"}
                />

                {false && <Html
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

                {asset_obj?.file?.thumbnail?.key &&
                    <Image
                        url={`${process.env.NEXT_PUBLIC_CDN}${asset_obj?.file?.thumbnail?.key}`}
                        position={[0, 0.11, 0.07]}
                        scale={[0.9, 0.9 * (9 / 16)]}
                        zoom={1}
                    />
                }

                <group position={[0, 0.03, 0]}>
                    <Text
                        position={[0, -0.21, 0.07]}
                        fontSize={0.06}
                        color={textColor}
                        anchorX="center"
                        anchorY="middle"
                        maxWidth={0.85}
                    >
                        {asset_obj.name}
                    </Text>
                    <Text
                        position={[0, -0.29, 0.07]}
                        fontSize={0.04}
                        color={textColor}
                        anchorX="center"
                        anchorY="middle"
                        maxWidth={0.85}
                    >
                        {asset_obj.city}, {asset_obj.state}
                    </Text>
                    <Text
                        position={[0, -0.35, 0.07]}
                        fontSize={0.04}
                        color={textColor}
                        anchorX="center"
                        anchorY="middle"
                        maxWidth={0.85}
                    >
                        By @{asset_obj.populated_user.username}
                    </Text>
                </group>

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

function TouchControls3D() {
    const { gl } = useThree();
    const setTouchCameraAngle = useAssetGalleryStore(state => state.setTouchCameraAngle);
    const yawRef = useRef(0);
    const pitchRef = useRef(-0.1);
    const lastPosRef = useRef(null);

    useEffect(() => {
        const canvas = gl.domElement;

        // --- Touch ---
        const onTouchStart = (e) => {
            if (e.touches.length !== 1) return;
            lastPosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        };
        const onTouchMove = (e) => {
            if (e.touches.length !== 1 || !lastPosRef.current) return;
            const touch = e.touches[0];
            const dx = touch.clientX - lastPosRef.current.x;
            const dy = touch.clientY - lastPosRef.current.y;
            yawRef.current -= dx * 0.003;
            pitchRef.current -= dy * 0.003;
            pitchRef.current = Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, pitchRef.current));
            setTouchCameraAngle(yawRef.current, pitchRef.current);
            lastPosRef.current = { x: touch.clientX, y: touch.clientY };
            e.preventDefault();
        };
        const onTouchEnd = () => { lastPosRef.current = null; };

        // --- Mouse ---
        const onMouseDown = (e) => {
            lastPosRef.current = { x: e.clientX, y: e.clientY };
        };
        const onMouseMove = (e) => {
            if (!lastPosRef.current) return;
            const dx = e.clientX - lastPosRef.current.x;
            const dy = e.clientY - lastPosRef.current.y;
            yawRef.current -= dx * 0.003;
            pitchRef.current -= dy * 0.003;
            pitchRef.current = Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, pitchRef.current));
            setTouchCameraAngle(yawRef.current, pitchRef.current);
            lastPosRef.current = { x: e.clientX, y: e.clientY };
        };
        const onMouseUp = () => { lastPosRef.current = null; };

        canvas.addEventListener('touchstart', onTouchStart, { passive: true });
        canvas.addEventListener('touchmove', onTouchMove, { passive: false });
        canvas.addEventListener('touchend', onTouchEnd, { passive: true });
        canvas.addEventListener('mousedown', onMouseDown);
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);

        return () => {
            canvas.removeEventListener('touchstart', onTouchStart);
            canvas.removeEventListener('touchmove', onTouchMove);
            canvas.removeEventListener('touchend', onTouchEnd);
            canvas.removeEventListener('mousedown', onMouseDown);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        };
    }, [gl, setTouchCameraAngle]);

    return null;
}

function TouchMarker() {
    const touchTarget = useAssetGalleryStore(state => state.touchTarget);
    if (!touchTarget) return null;
    return (
        <mesh position={[touchTarget[0], -0.5, touchTarget[2]]}>
            <cylinderGeometry args={[0.15, 0.15, 1, 24]} />
            <meshStandardMaterial color="#00ff88" transparent opacity={0.7} />
        </mesh>
    );
}

function AssetSections(props) {

    // const { data: assets, isLoading: assetsIsLoading, mutate: mutateAssets } = useAssets()
    const assets = useStore((state) => state.assets);
    // const setAssets = useStore((state) => state.setAssets);

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
                        asset_obj={asset_obj}
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
                            position={[-2.5, -0.599, 0]}
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
    // isFullscreen,
    // requestFullscreen,
    // exitFullscreen,
    // menuOpen
}) {

    const { isFullscreen } = useFullscreen();

    const controlType = useStore(state => state.controlType);
    const showStats = useStore((state) => state?.debugConfig?.showStats);

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
        <>
            {/* <div
                className={`canvas-wrap ${isFullscreen && 'fullscreen'}`}
                id={"canvas-wrap"}
            > */}
    
                <Canvas shadows style={{ zIndex: 1 }} id="gallery-canvas">
    
                    {showStats && <>
                        <Stats className="stats-overlay" />
                    </>}
    
                    {controlType == "Touch" && (
                        <>
                            <TouchControls3D />
                            <TouchMarker />
                        </>
                    )}
    
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
    
                        {/* {(controlType == "Mouse and Keyboard" || controlType == "Touch") &&
                            <Player />
                        } */}
                        <Player />

                        <SocketPlayers />
    
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
    
                {/* <div className='absolute centered cursor noselect'>+</div> */}
    
                {/* <CameraZoomIndicator /> */}
    
                {/* {controlType == "Touch" &&
                    <TouchControls
                        touchControlsEnabled={true}
                    />
                } */}
    
            {/* </div> */}
        </>
    );
}

export default memo(GameCanvas)