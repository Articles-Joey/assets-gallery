"use client"
import { useEffect, useState } from 'react';

import Link from 'next/link'
import dynamic from 'next/dynamic'

import Dropdown from 'react-bootstrap/Dropdown'

// import ROUTES from 'components/constants/routes'

import ArticlesButton from '@/components/UI/Button';
// import { useLocalStorage } from 'util/useLocalStorage';
import { useAssetGalleryStore } from '@/hooks/useAssetGalleryStore';
import { useStore } from '@/hooks/useStore';

import logo from '@/app/icon.png'
// import routes from 'components/constants/routes';

// const Ad = dynamic(() => import('components/Ads/Ad'), {
//     ssr: false,
// });

import SessionButton from '@articles-media/articles-dev-box/SessionButton';
import GameMenuPrimaryButtonGroup from '@articles-media/articles-dev-box/GameMenuPrimaryButtonGroup';
import NicknameInput from '@articles-media/articles-dev-box/NicknameInput';

import useUserDetails from '@articles-media/articles-dev-box/useUserDetails';
import useUserToken from '@articles-media/articles-dev-box/useUserToken';
import { useSocketStore } from '@/hooks/useSocketStore';

const ReturnToLauncherButton = dynamic(() =>
    import('@articles-media/articles-dev-box/ReturnToLauncherButton'),
    { ssr: false }
);

const Ad = dynamic(() =>
    import('@articles-media/articles-dev-box/Ad'),
    { ssr: false }
);

function FlatBackground({ galleryTheme }) {
    return (
        <img
            className='w-100 h-100'
            style={{ objectFit: 'cover' }}
            src={locations?.find(obj => obj.name == galleryTheme)?.thumb}
            alt=""
        />
    )
}

// const LandingBackgroundAnimation = dynamic(() => import('@/components/Game/LandingBackgroundAnimation'), {
//     ssr: false,
//     loading: () => <FlatBackground galleryTheme={"Forest"} />
// });

export const locations = [
    {
        name: 'Forest',
        thumb: `${process.env.NEXT_PUBLIC_CDN}games/Assets Gallery/${'Forest.png'}`
    },
    {
        name: 'Alley',
        thumb: `${process.env.NEXT_PUBLIC_CDN}games/Assets Gallery/${'Alley.png'}`
    },
    {
        name: 'Museum',
        thumb: `${process.env.NEXT_PUBLIC_CDN}games/Assets Gallery/${'asset-gallery.jpg'}`
    }
]

export default function AssetsMuseumLobbyPage() {

    const socket = useSocketStore(state => state.socket);
    const connected = useSocketStore(state => state.connected);

    const darkMode = useStore(state => state.darkMode);
    const landingAnimation = useStore(state => state.landingAnimation);
    const galleryTheme = useAssetGalleryStore(state => state.galleryTheme);
    const lobbyDetails = useStore(state => state.lobbyDetails);

    const [authorFilter, setAuthorFilter] = useState('Anyone')
    const [typeFilter, setTypeFilter] = useState('Anything')

    const {
        data: userToken,
        error: userTokenError,
        isLoading: userTokenLoading,
        mutate: userTokenMutate
    } = useUserToken(
        process.env.NEXT_PUBLIC_GAME_PORT,
    );

    const {
        data: userDetails,
        error: userDetailsError,
        isLoading: userDetailsLoading,
        mutate: userDetailsMutate
    } = useUserDetails({
        token: userToken
    });

    useEffect(() => {

        if (socket.connected) {
            socket.emit('join-room', `game:${process.env.NEXT_PUBLIC_GAME_KEY}-landing`);
        }

        return function cleanup() {
            socket.emit('leave-room', `game:${process.env.NEXT_PUBLIC_GAME_KEY}-landing`);
        };

    }, [socket.connected]);

    return (
        <div className="assets-gallery-lobby-page">

            <div className="background-wrap">
                <img
                    className='w-100 h-100'
                    style={{ objectFit: 'cover' }}
                    src={locations?.find(obj => obj.name == galleryTheme)?.thumb}
                    alt=""
                />
            </div>

            <div className='background-wrap'>
                {landingAnimation ?
                    <>
                        {/* <LandingBackgroundAnimation /> */}
                        <FlatBackground
                            galleryTheme={galleryTheme}
                        />
                    </>
                    :
                    <FlatBackground
                        galleryTheme={galleryTheme}
                    />
                }
            </div>

            <div className="container d-flex justify-content-center py-3">

                <div style={{ "width": "24rem" }}>

                    <div className='text-center mb-3'>

                        <img
                            src={logo.src}
                            alt="Game Logo"
                            className="mb-2"
                            height={150}
                            style={{
                                objectFit: "contain",
                                width: "100%"
                            }}
                        >
                        </img>

                        <h1 className='mb-0'>Assets Gallery</h1>

                    </div>

                    <div className="card card-articles card-sm mb-4">

                        <div className="card-header">
                            <NicknameInput
                                useStore={useStore}
                            />
                        </div>

                        <div className="card-body">

                            {/* <div className="alert alert-danger py-1">
                                <i className="fad fa-exclamation-triangle"></i>
                                <span className='small'>More Filters will be enabled when more assets are available.</span>
                            </div> */}

                            <ScenePicker />

                            {/* <div className="small">Scene</div>
                            <div className='mb-3'>

                                {locations.map(obj => {
                                    return (
                                        <ArticlesButton
                                            key={obj.name}
                                            className={` ${galleryTheme == obj.name && 'active'}`}
                                            small
                                            onClick={() => {
                                                setGalleryTheme(obj.name)
                                            }}
                                        >
                                            {obj.name}
                                        </ArticlesButton>
                                    )
                                })}

                            </div> */}

                            {/* <div className="small">Controls</div>
                            <div className='mb-3'>
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
                            </div> */}

                            {/* <div className="small">Audio</div>
                            <div className='mb-3'>

                                {[
                                    "Off",
                                    "On",
                                ].map(theme => {
                                    return (
                                        <ArticlesButton
                                            key={theme}
                                            className={` ${music == (theme == 'On' ? true : false) && 'active'}`}
                                            small
                                            onClick={() => {
                                                setMusic(theme == 'On' ? true : false)
                                            }}
                                        >
                                            {theme}
                                        </ArticlesButton>
                                    )
                                })}

                            </div> */}

                            <div className='bg-black p-1 mb-3 fw-bold'>
                                {connected ?
                                    <>
                                        <div className="text-success">
                                            Online services are available. {lobbyDetails?.players?.length || 0} player(s) currently on the site.
                                        </div>
                                    </>
                                    :
                                    <>
                                        <div className="text-warning">
                                            Connecting to online services...
                                        </div>
                                    </>
                                }
                            </div>

                            {/* <hr /> */}

                            <div className='d-flex'>

                                {/* Authors */}
                                <div className='me-2'>
                                    <div className="small">Authors</div>
                                    <Dropdown className="dropdown-articles" drop={'down'}>

                                        <Dropdown.Toggle
                                            variant="articles align-items-center d-flex"
                                            size='sm'
                                            disabled
                                        >

                                            <div>

                                                <i className="fad fa-filter me-1"></i>
                                                {/* <i className="fad fa-sort-shapes-up fa-lg me-2"></i> */}

                                                {/* <span className='small me-2'>Type</span> */}

                                                <span className='badge bg-dark shadow-articles me-1'>
                                                    {authorFilter}
                                                </span>

                                            </div>

                                        </Dropdown.Toggle>

                                        <Dropdown.Menu className="dropdown-articles">

                                            {/* <div className='small px-2 py-0 mb-0'>Player Type</div> */}

                                            <Dropdown.Divider className="py-0 my-1" />

                                            {['Anyone', '@Joey'].map(item =>
                                                <Dropdown.Item key={item} className={` ${authorFilter == item && 'active'}`}
                                                    onClick={() => {

                                                        setAuthorFilter(item)

                                                    }}>

                                                    <span>{item}</span>

                                                </Dropdown.Item>
                                            )}

                                        </Dropdown.Menu>

                                    </Dropdown>
                                </div>

                                {/* Asset Types */}
                                <div>
                                    <div className="small">Asset Types</div>
                                    <Dropdown className="dropdown-articles" drop={'down'}>

                                        <Dropdown.Toggle
                                            variant="articles align-items-center d-flex"
                                            size='sm'
                                            disabled
                                        >

                                            <div>

                                                <i className="fad fa-filter me-1"></i>
                                                {/* <i className="fad fa-sort-shapes-up fa-lg me-2"></i> */}

                                                {/* <span className='small me-2'>Type</span> */}

                                                <span className='badge bg-dark shadow-articles me-1'>
                                                    {typeFilter}
                                                </span>

                                            </div>

                                        </Dropdown.Toggle>

                                        <Dropdown.Menu className="dropdown-articles">

                                            {/* <div className='small px-2 py-0 mb-0'>Player Type</div> */}

                                            <Dropdown.Divider className="py-0 my-1" />

                                            {['Anything', 'Images', 'Videos', 'Gifs', '3D Models'].map(item =>
                                                <Dropdown.Item key={item} className={` ${typeFilter == item && 'active'}`}
                                                    onClick={() => {

                                                        setTypeFilter(item)

                                                    }}>

                                                    <span>{item}</span>

                                                </Dropdown.Item>
                                            )}

                                        </Dropdown.Menu>

                                    </Dropdown>
                                </div>

                            </div>

                            <hr />

                            <Link
                                className="w-100"
                                href={'/' + 'play'}
                            >
                                <ArticlesButton
                                    className={`w-100`}
                                    large
                                >
                                    <i className="fad fa-play"></i>
                                    Enter Asset Gallery
                                </ArticlesButton>
                            </Link>

                        </div>

                        <div className="card-footer d-flex flex-wrap justify-content-center">

                            <GameMenuPrimaryButtonGroup
                                useStore={useStore}
                                type="Landing"
                            />

                        </div>

                    </div>

                    <div className='mb-3'>
                        <SessionButton
                            port={process.env.NEXT_PUBLIC_GAME_PORT}
                            friendsButton={true}
                        />

                        <ReturnToLauncherButton />
                    </div>

                    <div className='d-flex justify-content-center'>
                        {/* <a
                            href="https://articles.media/community/assets"
                            target='_blank'
                            rel='noopener noreferrer'
                        >
                            <span className='badge badge-articles badge-hover me-2'>
                                Submit an Asset
                            </span>
                        </a> */}
                        <a
                            href="https://articles.media/community/assets?utm_source=assets-gallery"
                            target='_blank'
                            rel='noopener noreferrer'
                        >
                            <span className='badge badge-articles badge-hover'>
                                View Community Assets
                            </span>
                        </a>
                    </div>

                </div>

                <Ad
                    style="Default"
                    section={"Games"}
                    section_id={process.env.NEXT_PUBLIC_GAME_NAME}
                    darkMode={darkMode ? true : false}
                    user_ad_token={userToken}
                    userDetails={userDetails}
                    userDetailsLoading={userDetailsLoading}
                />

            </div>

        </div>
    );
}

function ScenePicker() {

    const galleryTheme = useAssetGalleryStore(state => state.galleryTheme);
    const setGalleryTheme = useAssetGalleryStore(state => state.setGalleryTheme);

    return (
        <div className='ScenePicker mb-3 card card-articles card-sm'>

            <div className="ratio ratio-16x9 bg-black border border-2 border-dark">
                <img
                    className='w-100 h-100'
                    style={{ objectFit: 'cover' }}
                    src={locations?.find(obj => obj.name == galleryTheme)?.thumb}
                    alt=""
                />
            </div>

            {/* <div className="small">Scene</div> */}
            <div className='border d-flex justify-content-center p-1'>
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
        </div>
    )
}