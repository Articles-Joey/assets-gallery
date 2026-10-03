"use client";
import packageInfo from '@/package.json';

import { Suspense } from "react";
import { useHotkeys } from "react-hotkeys-hook";

import { useStore } from "@/hooks/useStore";
import { useAudioStore } from "@/hooks/useAudioStore";
import { useTouchControlsStore } from "@/hooks/useTouchControlsStore";
import ApiInfoModal from "@/components/UI/ApiInfoModal";

import DarkModeHandler from "@articles-media/articles-dev-box/DarkModeHandler";
import GlobalBody from '@articles-media/articles-dev-box/GlobalBody';
import HasNoMouseHandler from '@articles-media/articles-dev-box/HasNoMouseHandler';
import GlobalClientModals from "@articles-media/articles-dev-box/GlobalClientModals";
import HotkeyHandler from "@articles-media/articles-dev-box/HotkeyHandler";

export default function LayoutClient({ children }) {

    const darkMode = useStore(state => state.darkMode);
    const showApiInfoModal = useStore(state => state.showApiInfoModal);
    const setShowApiInfoModal = useStore(state => state.setShowApiInfoModal);

    return (
        <>
            <GlobalBody />
            <DarkModeHandler
                useStore={useStore}
            />
            <HasNoMouseHandler
                useStore={useStore}
            />
            <Suspense>
                {showApiInfoModal && <ApiInfoModal show={showApiInfoModal} setShow={setShowApiInfoModal} />}

                <HotkeyHandler
                    useStore={useStore}
                    useHotkeys={useHotkeys}
                />

                <GlobalClientModals
                    useStore={useStore}
                    useAudioStore={useAudioStore}
                    useTouchControlsStore={useTouchControlsStore}
                    // useSocketStore={useSocketStore}
                    packageInfo={packageInfo}
                    settingsModalConfig={{
                        tabs: {
                            'Graphics': {
                                darkMode: true,
                                landingAnimation: true
                            },
                            'Audio': {
                                sliders: [
                                    ...useAudioStore.getState().audioSettings ?
                                        Object.keys(useAudioStore.getState().audioSettings).filter(key => key !== "enabled").map(key => ({
                                            key,
                                            label: key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
                                        }))
                                        :
                                        [],
                                ]
                            },
                            'Controls': {
                                touchControls: true
                                // defaultKeyBindings: {
                                //     // moveUp: "W",
                                //     // moveDown: "S",
                                //     // moveLeft: "A",
                                //     // moveRight: "D",
                                // }
                            },
                            'Multiplayer': {
                                serverUrl: true,
                            },
                            'Other': {
                                // toontownMode: true,
                            },
                            'Debug': {
                                showStats: true,
                                children: <>

                                </>,
                            }
                        },
                        reset: () => {
                            useAudioStore.getState().resetAudioSettings();
                        }
                    }}
                    infoModalConfig={{
                        previewImage: darkMode ? "img/game-preview.gif" : "img/game-preview.gif",
                    }}
                />

            </Suspense>
        </>
    );
}
