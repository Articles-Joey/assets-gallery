"use client"
import { useEffect, useState } from 'react';

import dynamic from 'next/dynamic'
import ArticlesButton from '@/components/UI/Button';

// import Menu from '@/components/Game/Menu';

// import useFullscreen from '@/hooks/useFullScreen';
import useFullscreen from '@articles-media/articles-dev-box/useFullscreen';

import { useAssetGalleryStore } from '@/hooks/useAssetGalleryStore';
import { useHotkeys } from 'react-hotkeys-hook';
import { useStore } from '@/hooks/useStore';

import GameMenu from '@articles-media/articles-dev-box/GameMenu';
import LeftPanelContent from '@/components/UI/LeftPanelContent';
import classNames from 'classnames';
import CameraZoomIndicator from '@/components/UI/CameraZoomIndicator';
import { set } from 'date-fns';
import { useSearchParams } from 'next/navigation';
import { useSocketStore } from '@/hooks/useSocketStore';

const GameCanvas = dynamic(() => import('@/components/Game/GameCanvas'), {
    ssr: false,
});

export default function AssetsMuseumGamePage({
    assets: initialAssets,
    lastAssetUpdate,
    devFailed
}) {
    const searchParams = useSearchParams()
    const params = Object.fromEntries(searchParams.entries());
    const { server } = params

    const socket = useSocketStore(state => state.socket);
    const connected = useSocketStore(state => state.connected);

    const _hasHydrated = useStore((state) => state._hasHydrated);
    const assets = useStore((state) => state.assets);
    const setAssets = useStore((state) => state.setAssets);
    const setLastAssetUpdate = useStore((state) => state.setLastAssetUpdate);
    const nickname = useStore((state) => state.nickname)

    useEffect(() => {

        if (connected) {
            const roomName = `game:${process.env.NEXT_PUBLIC_GAME_KEY}-room-${server || 1}`;
            socket.emit('join-room', roomName, {
                game_id: server || 1,
                nickname: nickname,
                client_version: '1',

            });

            return function cleanup() {
                socket.emit('leave-room', roomName)
            };
        }

    }, [server, connected, nickname]);

    useEffect(() => {
        console.log("assets", assets);
        setAssets(initialAssets);
        setLastAssetUpdate(lastAssetUpdate);
    }, [initialAssets]);

    const useFallback = useAssetGalleryStore((state) => state.useFallback);

    useHotkeys(['1'], () => {
        useAssetGalleryStore.getState().setGalleryTheme("Forest")
    });

    useHotkeys(['2'], () => {
        useAssetGalleryStore.getState().setGalleryTheme("Alley")
    });

    useHotkeys(['3'], () => {
        useAssetGalleryStore.getState().setGalleryTheme("Museum")
    });

    const sceneKey = useStore((state) => state.sceneKey);

    useHotkeys('r', () => {
        useStore.getState().reloadScene();
    })

    const isFullscreen = useFullscreen().isFullscreen;
    const menuOpen = useStore((state) => state.menuOpen);
    const sidebar = useStore((state) => state.sidebar);
    const setShowApiInfoModal = useStore((state) => state.setShowApiInfoModal)

    return (

        <div
            className={classNames(
                `${process.env.NEXT_PUBLIC_GAME_KEY}-page`,
                (_hasHydrated ?
                    {
                        'menu-open': menuOpen,
                        'fullscreen': isFullscreen,
                        'show-sidebar': sidebar,
                    }
                    :
                    {}
                )
            )}
            id={`${process.env.NEXT_PUBLIC_GAME_KEY}-game-page`}
        >

            <GameMenu
                useStore={useStore}
                LeftPanelContent={LeftPanelContent}
                menuBarConfig={{
                    style: "Bar",
                    settingsWithMenuButton: true,
                    menuBarButtonPosition: "Center",
                    leftSlotChildren: <>
                        <PlayerPosition />
                    </>,
                    centerSlotChildren: <>
                        {(useFallback || devFailed) &&
                            <ArticlesButton
                                // active={useStore.getState().menuOpen}
                                variant="danger"
                                onClick={() => {
                                    // alert("The local API server is not running. The gallery is using a fallback remote API.")
                                    setShowApiInfoModal(true)
                                }}
                            >
                                <i className="fad fa-exclamation-triangle me-0"></i>
                            </ArticlesButton>
                        }
                    </>,
                }}
                sidebarConfig={{
                    style: "Static Panel",
                }}
            />

            {/* <div className="menu-bar">

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

            </div> */}

            {/* <div
                style={{ zIndex: 2 }}
            >
                <Menu
                    {...{
                        menuOpen,
                        reloadScene,
                        lastAssetUpdate,
                    }}
                />
            </div> */}

            <div className='canvas-wrap'>

                <div className='absolute centered cursor noselect'>+</div>
                <CameraZoomIndicator />

                <GameCanvas
                    key={sceneKey}
                />

            </div>

        </div>
    );
}

function PlayerPosition() {

    const position = useAssetGalleryStore((state) => state.position);

    return (
        <small className='location px-1' style={{ minWidth: "180px" }}>
            <span>X: {position[0].toFixed(2)}</span>
            <span> - </span>
            <span>Y: {position[1].toFixed(2)}</span>
            <span> - </span>
            <span>Z: {position[2].toFixed(2)}</span>
        </small>
    )
}