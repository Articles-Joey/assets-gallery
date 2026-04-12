import { memo, useEffect, useState } from 'react';

import ArticlesButton from '@/components/UI/Button';
import { useAssetGalleryStore } from '@/hooks/useAssetGalleryStore';
import { Dropdown, DropdownButton, Form } from 'react-bootstrap';
// import useFullscreen from 'util/useFullScreen';
import useFullscreen from '@articles-media/articles-dev-box/useFullscreen';
import Link from 'next/link';
import { useStore } from '@/hooks/useStore';
// import routes from '@/components/constants/routes';

const MIN_DISTANCE = 2;
const MAX_DISTANCE = 20;

function PlayerPosition() {
    const position = useAssetGalleryStore((state) => state.position);

    return (
        <small>
            <span>X: {position[0].toFixed(2)}</span>
            <span> - </span>
            <span>Y: {position[1].toFixed(2)}</span>
            <span> - </span>
            <span>Z: {position[2].toFixed(2)}</span>
        </small>
    )
}

const Menu = ({
    // isFullscreen,
    // requestFullscreen,
    // exitFullscreen,
    menuOpen,
    reloadScene,
    lastAssetUpdate,
}) => {

    const { isFullscreen, requestFullscreen, exitFullscreen } = useFullscreen();

    const controlType = useStore(state => state.controlType);
    const setControlType = useStore((state) => state.setControlType);

    const galleryTheme = useAssetGalleryStore((state) => state.galleryTheme);
    const setGalleryTheme = useAssetGalleryStore((state) => state.setGalleryTheme);

    const music = useAssetGalleryStore((state) => state.music);
    const setMusic = useAssetGalleryStore((state) => state.setMusic);

    const isThirdPerson = useAssetGalleryStore(state => state.isThirdPerson)
    const setIsThirdPerson = useAssetGalleryStore(state => state.setIsThirdPerson)

    const cameraDistance = useAssetGalleryStore(state => state.cameraDistance);
    const setCameraDistance = useAssetGalleryStore(state => state.setCameraDistance)

    const zoomPercent = Math.round((1 - (cameraDistance - MIN_DISTANCE) / (MAX_DISTANCE - MIN_DISTANCE)) * 100);

    // const { isFullscreen, requestFullscreen, exitFullscreen } = useFullscreen();

    return (
        <div className={`menu ${menuOpen && `menu-open`}`}>

            <div className='container'>

                {lastAssetUpdate &&
                    <small className='mb-3'>
                        Last update: {new Date(lastAssetUpdate).toLocaleTimeString()}
                    </small>
                }

                <div className="fw-bold">Controls</div>
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

                <div className="fw-bold mb-1">
                    Camera Position
                    <span className='badge bg-black ms-2'>V</span>
                </div>
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

                {isThirdPerson &&
                    <>
                        <div className="fw-bold mb-1">
                            Camera Zoom
                            <span className='badge bg-black ms-2'>Mouse Wheel / Pinch</span>
                        </div>
                        <div className='mb-2 d-flex align-items-center gap-3'>
                            <span className='fw-bold'>{zoomPercent}%</span>
                            <Form.Range
                                style={{ flex: 1 }}
                                // min={MIN_DISTANCE}
                                // max={MAX_DISTANCE}
                                value={zoomPercent}
                                onChange={(e) => {
                                    console.log(e.target.value)
                                    setCameraDistance( MIN_DISTANCE + (1 - e.target.value / 100) * (MAX_DISTANCE - MIN_DISTANCE) )
                                }}
                            />
                        </div>
                    </>
                }

                <div className="fw-bold">Theme</div>
                <div className='mb-2'>
                    {[
                        "Forest",
                        "Museum",
                        "Alley"
                    ].map((theme, theme_i) => {
                        return (
                            <ArticlesButton
                                key={theme}
                                active={galleryTheme == theme}
                                small
                                onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    setGalleryTheme(theme)
                                }}
                            >
                                {theme}
                                <div className="badge bg-black ms-1">
                                    {theme_i + 1}
                                </div>
                            </ArticlesButton>
                        )
                    })}
                </div>

                <div className="fw-bold">Music</div>
                <div className='mb-2'>
                    {[
                        "On",
                        "Off",
                    ].map(theme => {
                        return (
                            <ArticlesButton
                                key={theme}
                                active={(
                                    (theme == 'On' && music)
                                    ||
                                    (theme == 'Off' && !music)
                                )}
                                small
                                onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    setMusic(!music)
                                }}
                            >
                                {theme}
                            </ArticlesButton>
                        )
                    })}
                </div>

                <ArticlesButton
                    small
                    className="mb-2"
                    onClick={() => {
                        reloadScene()
                    }}
                >
                    <i className="fad fa-portal-enter"></i>
                    Reload Game
                </ArticlesButton>

                <div className="text-center card p-0 rounded-0 card-articles mb-2">

                    <div className='d-flex justify-content-between align-items-center small p-1 card-header'>

                        <div className="small">
                            {galleryTheme}
                        </div>

                        <PlayerPosition />
                    </div>

                    <div className='mb-0 p-1 d-flex'>

                        <ArticlesButton
                            small
                            active={music}
                            onClick={() => {
                                setMusic(!music)
                            }}
                        >
                            <i className="fad fa-music me-0"></i>
                        </ArticlesButton>

                        <ArticlesButton
                            active={isFullscreen}
                            small
                            onClick={() => {

                                if (isFullscreen) {
                                    exitFullscreen()
                                    return
                                }

                                // Always target wrap so menu and cursor are included
                                // requestFullscreen('gallery-canvas-wrap')
                                // Just body, so modals
                                requestFullscreen()

                            }}
                        >
                            <i className="fad fa-expand-wide me-0"></i>
                        </ArticlesButton>

                        <ArticlesButton
                            small
                            onClick={() => {
                                console.log("Soon")
                            }}
                        >
                            <i className="fad fa-portal-enter"></i>
                            Teleport
                        </ArticlesButton>

                        <DropdownButton
                            size='sm'
                            variant={'articles'}
                            className='dropdown-articles'
                            title={
                                <span>
                                    {/* Displayed in header */}
                                    {/* Theme: */}
                                    Theme
                                    {/* <span className='badge bg-black ms-1'>{galleryTheme}</span> */}
                                </span>
                            }
                        >

                            {[
                                "Forest",
                                "Museum",
                                "Alley"
                            ].map(theme => {
                                return (
                                    <Dropdown.Item
                                        key={theme}
                                        active={galleryTheme == theme}
                                        small
                                        onClick={(e) => {
                                            e.preventDefault()
                                            e.stopPropagation()
                                            setGalleryTheme(theme)
                                        }}
                                    >
                                        {theme}
                                    </Dropdown.Item>
                                )
                            })}

                            {/* <Dropdown.Item
                                onClick={() => {
                                    // updateConfig('signup', {
                                    //     enabled: true,
                                    //     limitIP: false
                                    // })
                                }} href="">
                                Enable
                            </Dropdown.Item> */}

                        </DropdownButton>

                        {/* {[
                            "Forest",
                            "Museum",
                            "Alley"
                        ].map(theme => {
                            return (
                                <ArticlesButton
                                    key={theme}
                                    active={galleryTheme == theme}
                                    small
                                    onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        setGalleryTheme(theme)
                                    }}
                                >
                                    {theme}
                                </ArticlesButton>
                            )
                        })} */}

                    </div>

                </div>

                <Link href={'/'} className='w-100 mb-2'>
                    <ArticlesButton
                        className={`w-100`}
                        small
                        onClick={() => {

                        }}
                    >
                        <i className="fad fa-sign-out fa-rotate-180"></i>
                        Leave Game
                    </ArticlesButton>
                </Link>

            </div>

        </div>
    )
}

export default memo(Menu);