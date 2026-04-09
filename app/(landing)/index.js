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
// import routes from 'components/constants/routes';

// const Ad = dynamic(() => import('components/Ads/Ad'), {
//     ssr: false,
// });

const ReturnToLauncherButton = dynamic(() =>
    import('@articles-media/articles-dev-box/ReturnToLauncherButton'),
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

const locations = [
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

    const setShowSettingsModal = useStore(state => state.setShowSettingsModal);
    const setShowCreditsModal = useStore(state => state.setShowCreditsModal);
    const setShowInfoModal = useStore(state => state.setShowInfoModal);

    // const darkMode = useStore(state => state.darkMode);
    // const setDarkMode = useStore(state => state.setDarkMode);
    const toggleDarkMode = useStore(state => state.toggleDarkMode);

    const landingAnimation = useStore(state => state.landingAnimation);

    const [authorFilter, setAuthorFilter] = useState('Anyone')
    const [typeFilter, setTypeFilter] = useState('Anything')

    const [apiControlsExpanded, setApiControlsExpanded] = useState(true);

    // const [ assetGalleryTheme, setAssetGalleryTheme ] = useState("Forest")

    // const [assetGalleryTheme, setAssetGalleryTheme] = useLocalStorage("game:asset-gallery:theme", "Forest")

    const controlType = useAssetGalleryStore(state => state.controlType);
    const setControlType = useAssetGalleryStore(state => state.setControlType);
    const galleryTheme = useAssetGalleryStore(state => state.galleryTheme);
    const setGalleryTheme = useAssetGalleryStore(state => state.setGalleryTheme);
    const music = useAssetGalleryStore(state => state.music);
    const setMusic = useAssetGalleryStore(state => state.setMusic);

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

            <div className="container d-flex justify-content-center">

                <div style={{ "width": "24rem" }}>

                    <div className='d-none'>
                        <h1 className='h2'>Community Assets Gallery</h1>

                        <p>
                            View assets submitted via the <span className='text-decoration-underline'>
                                <Link prefetch={false} href={'https://articles.media/community/assets'}>/community/assets</Link>
                            </span> page in a 3D walkable world.
                        </p>
                    </div>

                    <div className="card card-articles card-sm mb-4">

                        <div className="card-header">
                            <b>Community Assets Gallery</b>
                        </div>

                        <div className="card-body">

                            {/* <div className="alert alert-danger py-1">
                                <i className="fad fa-exclamation-triangle"></i>
                                <span className='small'>More Filters will be enabled when more assets are available.</span>
                            </div> */}

                            <div className="ratio ratio-16x9 bg-black mb-3 border border-2 border-dark">
                                <img
                                    className='w-100 h-100'
                                    style={{ objectFit: 'cover' }}
                                    src={locations?.find(obj => obj.name == galleryTheme)?.thumb}
                                    alt=""
                                />
                            </div>

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

                            {/* <hr /> */}

                            <div className='d-flex'>

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

                            <div className='d-flex w-50'>
                                <ArticlesButton
                                    className={`w-100`}
                                    small
                                    onClick={() => {
                                        setShowSettingsModal(true)
                                    }}
                                >
                                    <i className="fad fa-cog"></i>
                                    Settings
                                </ArticlesButton>
                                <ArticlesButton
                                    className={``}
                                    small
                                    onClick={() => {
                                        toggleDarkMode();
                                    }}
                                >
                                    <i className="fad fa-palette"></i>
                                </ArticlesButton>
                            </div>

                            <ArticlesButton
                                className={`w-50`}
                                small
                                onClick={() => {
                                    setShowInfoModal(true)
                                }}
                            >
                                <i className="fad fa-info-square"></i>
                                Info
                            </ArticlesButton>

                            <Link href={'https://github.com/Articles-Joey/assets-gallery'} className='w-50' target="_blank" rel="noopener noreferrer">
                                <ArticlesButton
                                    className={`w-100`}
                                    small
                                    onClick={() => {

                                    }}
                                >
                                    <i className="fab fa-github"></i>
                                    Github
                                </ArticlesButton>
                            </Link>

                            <ArticlesButton
                                className={`w-50`}
                                small
                                onClick={() => {
                                    setShowCreditsModal(true);
                                }}
                            >
                                <i className="fad fa-users"></i>
                                Credits
                            </ArticlesButton>

                        </div>

                    </div>

                    <div className='mb-3'>
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
                            href="https://articles.media/community/assets"
                            target='_blank'
                            rel='noopener noreferrer'
                        >
                            <span className='badge badge-articles badge-hover'>
                                View Community Assets
                            </span>
                        </a>
                    </div>

                </div>

                {/* <Ad section={"Games"} section_id={'Assets Museum'} /> */}

            </div>

        </div>
    );
}