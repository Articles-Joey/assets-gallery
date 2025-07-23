import { memo, useEffect, useState } from 'react';

import ArticlesButton from '@/components/UI/Button';
import { useAssetGalleryStore } from '@/hooks/useAssetGalleryStore';
import { Dropdown, DropdownButton } from 'react-bootstrap';
// import useFullscreen from 'util/useFullScreen';
import Link from 'next/link';
// import routes from '@/components/constants/routes';

const Menu = ({
    isFullscreen,
    requestFullscreen,
    exitFullscreen,
    menuOpen,
    reloadScene
}) => {

    const {
        controlType,
        setControlType,
        galleryTheme,
        setGalleryTheme,
        music,
        setMusic
    } = useAssetGalleryStore()

    const position = useAssetGalleryStore((state) => state.position);

    // const { isFullscreen, requestFullscreen, exitFullscreen } = useFullscreen();

    return (
        <div className={`menu ${menuOpen && `menu-open`}`}>

            <div className='container'>

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
                                    setGalleryTheme(theme)
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

                        <small>
                            <span>X: {position[0].toFixed(2)}</span>
                            <span> - </span>
                            <span>Y: {position[1].toFixed(2)}</span>
                            <span> - </span>
                            <span>Z: {position[2].toFixed(2)}</span>
                        </small>
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
                                requestFullscreen('gallery-canvas-wrap')

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