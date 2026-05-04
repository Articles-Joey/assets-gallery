"use client";
import { useAudioStore } from '@/hooks/useAudioStore';
import { useStore } from '@/hooks/useStore';
import { useTouchControlsStore } from '@/hooks/useTouchControlsStore';
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react';
import ApiInfoModal from './ApiInfoModal';
import { useAssetGalleryStore } from '@/hooks/useAssetGalleryStore';
import { locations } from '@/app/(landing)';
import ArticlesButton from './Button';
import { useSocketStore } from '@/hooks/useSocketStore';

const InfoModal = dynamic(
    () => import('@/components/UI/InfoModal'),
    { ssr: false }
)

const SettingsModal = dynamic(
    () => import('@articles-media/articles-dev-box/SettingsModal'),
    { ssr: false }
)

const CreditsModal = dynamic(
    () => import('@articles-media/articles-dev-box/CreditsModal'),
    { ssr: false }
)

export default function GlobalClientModals() {

    const [containerRef, setContainerRef] = useState(null)

    useEffect(() => {
        setContainerRef(document.getElementById('canvas-wrap'))
    }, [])

    const galleryTheme = useAssetGalleryStore(state => state.galleryTheme);
    const setGalleryTheme = useAssetGalleryStore(state => state.setGalleryTheme);

    const showInfoModal = useStore((state) => state.showInfoModal)
    const setShowInfoModal = useStore((state) => state.setShowInfoModal)

    const showSettingsModal = useStore((state) => state.showSettingsModal)
    const setShowSettingsModal = useStore((state) => state.setShowSettingsModal)

    const showCreditsModal = useStore((state) => state.showCreditsModal)
    const setShowCreditsModal = useStore((state) => state.setShowCreditsModal)

    const showApiInfoModal = useStore((state) => state.showApiInfoModal)
    const setShowApiInfoModal = useStore((state) => state.setShowApiInfoModal)

    const controlType = useStore(state => state.controlType);
    const setControlType = useStore((state) => state.setControlType);

    const isThirdPerson = useAssetGalleryStore(state => state.isThirdPerson)
    const setIsThirdPerson = useAssetGalleryStore(state => state.setIsThirdPerson)

    return (
        <>
            {showInfoModal &&
                <InfoModal
                    show={showInfoModal}
                    setShow={setShowInfoModal}
                />
            }

            {/* {showSettingsModal &&
                <SettingsModal
                    show={showSettingsModal}
                    setShow={setShowSettingsModal}
                />
            } */}

            {showSettingsModal &&
                <SettingsModal
                    show={showSettingsModal}
                    setShow={setShowSettingsModal}
                    store={useStore}
                    containerRef={containerRef}
                    useAudioStore={useAudioStore}
                    useTouchControlsStore={useTouchControlsStore}
                    config={{
                        tabs: {
                            'Graphics': {
                                darkMode: true,
                                landingAnimation: true,
                                children: <>
                                    <div className="">Scene</div>
                                    <div className='mb-3'>
                                        {locations.map(obj => {
                                            return (
                                                <ArticlesButton
                                                    key={obj.name}
                                                    className={` ${galleryTheme == obj.name && 'active'}`}
                                                    small
                                                    onClick={() => {
                                                        setGalleryTheme(obj.name)
                                                    }
                                                    }
                                                >
                                                    {obj.name}
                                                </ArticlesButton>
                                            )
                                        })}

                                    </div>

                                    <div className="">Control Type</div>
                                    <div className='mb-2'>
                                        {['First Person', 'Third Person'].map(item => {
                                            return (
                                                <ArticlesButton
                                                    key={item}
                                                    small
                                                    active={item == 'First Person' ? !isThirdPerson : isThirdPerson}
                                                    onClick={() => {
                                                        if (item == 'First Person') {
                                                            setIsThirdPerson(false)
                                                        } else {
                                                            setIsThirdPerson(true)
                                                        }
                                                    }}
                                                >
                                                    <span>{item}</span>
                                                </ArticlesButton>
                                            )
                                        })}
                                    </div>

                                    {/* TODO - Add third person camera distance controls for no keyboard users */}
                                    
                                </>
                            },
                            'Audio': {
                                sliders: [
                                    {
                                        key: "game_volume",
                                        label: "Game Volume"
                                    },
                                    // {
                                    //     key: "music_volume",
                                    //     label: "Music Volume"
                                    // }
                                ]
                            },
                            'Controls': {
                                touchControls: false,
                                defaultKeyBindings: {
                                    // moveUp: "W",
                                    // moveDown: "S",
                                    // moveLeft: "A",
                                    // moveRight: "D",
                                },
                                children: <>
                                    <div className="">Controls</div>
                                    <div className='mb-2'>
                                        {['Mouse and Keyboard', 'Touch'].map(item => {
                                            return (
                                                <ArticlesButton
                                                    key={item}
                                                    small
                                                    active={item == controlType}
                                                    onClick={() => {
                                                        setControlType(item)
                                                    }}
                                                >
                                                    <span>{item}</span>
                                                </ArticlesButton>
                                            )
                                        })}
                                    </div>
                                </>,
                            },
                            'Multiplayer': {
                                // visible: true,
                                // useSocketStore,
                            },
                            'Other': {

                            }
                        }
                    }}
                />
            }

            {showCreditsModal &&
                <CreditsModal
                    show={showCreditsModal}
                    setShow={setShowCreditsModal}
                />
            }

            {showApiInfoModal &&
                <ApiInfoModal
                    show={showApiInfoModal}
                    setShow={setShowApiInfoModal}
                />
            }
        </>
    )
}