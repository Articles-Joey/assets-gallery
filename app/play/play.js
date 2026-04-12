"use client"
import { useEffect, useState } from 'react';

import dynamic from 'next/dynamic'
import ArticlesButton from '@/components/UI/Button';

import Menu from '@/components/Game/Menu';

// import useFullscreen from '@/hooks/useFullScreen';
import useFullscreen from '@articles-media/articles-dev-box/useFullscreen';

import { useAssetGalleryStore } from '@/hooks/useAssetGalleryStore';
import { useHotkeys } from 'react-hotkeys-hook';
import { useStore } from '@/hooks/useStore';

const GameCanvas = dynamic(() => import('@/components/Game/GameCanvas'), {
    ssr: false,
});

export default function AssetsMuseumGamePage({
    assets: initialAssets,
    lastAssetUpdate,
    devFailed
}) {

    const assets = useStore((state) => state.assets);
    const setAssets = useStore((state) => state.setAssets);

    useEffect(() => {
        console.log("assets", assets);
        setAssets(initialAssets);
    }, [initialAssets]);

    const useFallback = useAssetGalleryStore((state) => state.useFallback);

    // const [showModal, setShowModal] = useState(false);

    // const handleClose = () => setShowModal(false);

    const showSettingsModal = useStore((state) => state.showSettingsModal);
    const setShowSettingsModal = useStore((state) => state.setShowSettingsModal);

    // TODO - Zustand
    const [menuOpen, setMenuOpen] = useState(false)

    const controlType = useStore(state => state.controlType)

    const position = useAssetGalleryStore((state) => state.position);
    const setGalleryTheme = useAssetGalleryStore((state) => state.setGalleryTheme);

    useHotkeys(['1'], () => {
        setGalleryTheme("Forest")
    });

    useHotkeys(['2'], () => {
        setGalleryTheme("Alley")
    });

    useHotkeys(['3'], () => {
        setGalleryTheme("Museum")
    });

    const [sceneKey, setSceneKey] = useState(0);
    useHotkeys('r', () => {
        setSceneKey((prev) => prev + 1)
    })
    const reloadScene = () => {
        setSceneKey((prevKey) => prevKey + 1);
    };

    return (

        <div
            className={`assets-gallery-page ${menuOpen && `menu-open`}`}
            id="gallery-canvas-wrap"
        >

            <div className="menu-bar">

                <small className='location me-3'>
                    <span>X: {position[0].toFixed(2)}</span>
                    <span> - </span>
                    <span>Y: {position[1].toFixed(2)}</span>
                    <span> - </span>
                    <span>Z: {position[2].toFixed(2)}</span>
                </small>

                {controlType === 'Touch' && <div className="jump">
                    <button
                        className="btn btn-dark"
                        onTouchStart={(e) => { e.preventDefault(); doJump(); }}
                        onClick={() => {
                            useAssetGalleryStore.getState().requestJump();
                        }}
                    >
                        Jump
                    </button>
                </div>}

                <ArticlesButton
                    active={menuOpen}
                    onClick={() => {
                        setMenuOpen(!menuOpen)
                    }}
                >
                    <i className='fad fa-plus me-2'></i>
                    Menu
                </ArticlesButton>

                <ArticlesButton
                    active={showSettingsModal}
                    onClick={() => {
                        setShowSettingsModal(true)
                    }}
                >
                    <i className='fad fa-cog'></i>
                </ArticlesButton>

                {(useFallback || devFailed) &&
                    <ArticlesButton
                        active={menuOpen}
                        variant="danger"
                        onClick={() => {
                            alert("The local API server is not running. The gallery is using a fallback remote API.")
                        }}
                    >
                        <i className="fad fa-exclamation-triangle me-0"></i>
                    </ArticlesButton>
                }

            </div>

            <div
                style={{ zIndex: 2 }}
            // onClick={(e) => {
            //     e.preventDefault()
            //     e.stopPropagation()
            // }}
            >
                <Menu
                    {...{
                        menuOpen,
                        reloadScene,
                        lastAssetUpdate,
                    }}
                />
            </div>

            <GameCanvas
                key={sceneKey}
            />

        </div>
    );
}