"use client"
import { useEffect, useState } from 'react';

import dynamic from 'next/dynamic'
import ArticlesButton from '@/components/UI/Button';

import Menu from '@/components/Game/Menu';
import useFullscreen from '@/hooks/useFullScreen';
import { useAssetGalleryStore } from '@/hooks/useAssetGalleryStore';
import { useHotkeys } from 'react-hotkeys-hook';

const GameCanvas = dynamic(() => import('@/components/Game/GameCanvas'), {
    ssr: false,
});

export default function AssetsMuseumGamePage() {

    // const [showModal, setShowModal] = useState(false);

    // const handleClose = () => setShowModal(false);

    const [menuOpen, setMenuOpen] = useState(false)

    const { isFullscreen, requestFullscreen, exitFullscreen } = useFullscreen();

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
    const reloadScene = () => {
        setSceneKey((prevKey) => prevKey + 1);
    };

    return (

        <div
            className={`assets-gallery-page ${menuOpen && `menu-open`}`}
            id="gallery-canvas-wrap"
        >

            <div className="menu-bar">

                <small className='me-3'>
                    <span>X: {position[0].toFixed(2)}</span>
                    <span> - </span>
                    <span>Y: {position[1].toFixed(2)}</span>
                    <span> - </span>
                    <span>Z: {position[2].toFixed(2)}</span>
                </small>

                <ArticlesButton
                    active={menuOpen}
                    onClick={() => {
                        setMenuOpen(!menuOpen)
                    }}
                >
                    Game Menu
                </ArticlesButton>

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
                        isFullscreen,
                        requestFullscreen,
                        exitFullscreen,
                        menuOpen,
                        reloadScene
                    }}
                />
            </div>

            <GameCanvas
                key={sceneKey}
                {...{
                    isFullscreen,
                    requestFullscreen,
                    exitFullscreen,
                    // menuOpen
                }}
            />

        </div>
    );
}