import { useState } from "react";

import { Modal, Form } from "react-bootstrap"

import ArticlesButton from "@/components/UI/Button";
import { useStore } from "@/hooks/useStore";

export default function SettingsModal({
    show,
    setShow,
}) {

    const graphicsQuality = useStore(state => state.graphicsQuality);
    const setGraphicsQuality = useStore(state => state.setGraphicsQuality);

    const darkMode = useStore(state => state.darkMode);
    const setDarkMode = useStore(state => state.setDarkMode);

    const [showModal, setShowModal] = useState(true)

    const [lightboxData, setLightboxData] = useState(null)

    const [tab, setTab] = useState('Graphics')

    return (
        <>
            {/* {lightboxData && (
                <Lightbox
                    mainSrc={lightboxData?.location}
                    onCloseRequest={() => setLightboxData(null)}
                    reactModalStyle={{
                        overlay: {
                            zIndex: '2000'
                        }
                    }}
                />
            )} */}

            <Modal
                className="articles-modal"
                size='md'
                show={showModal}
                // To much jumping with little content for now
                // centered
                scrollable
                onExited={() => {
                    setShow(false)
                }}
                onHide={() => {
                    setShowModal(false)
                }}
            >

                <Modal.Header closeButton>
                    <Modal.Title>Game Settings</Modal.Title>
                </Modal.Header>

                <Modal.Body className="flex-column p-0">

                    <div className='p-2'>
                        {[
                            'Graphics',
                            'Controls',
                            'Audio',
                            // 'Chat'
                        ].map(item =>
                            <ArticlesButton
                                key={item}
                                active={tab == item}
                                onClick={() => { setTab(item) }}
                            >
                                {item}
                            </ArticlesButton>
                        )}
                    </div>

                    <hr className="my-0" />

                    <div className="p-2">
                        {tab == 'Graphics' &&
                            <div>

                                <div className="mb-3">
                                    <div className="text-muted mb-1">Dark Mode</div>
                                    <ArticlesButton
                                        // key={level}
                                        className={``}
                                        active={!darkMode}
                                        // small
                                        onClick={() => setDarkMode(false)}
                                    >
                                        Off
                                    </ArticlesButton>
                                    <ArticlesButton
                                        // key={level}
                                        className={``}
                                        active={darkMode}
                                        // small
                                        onClick={() => setDarkMode(true)}
                                    >
                                        On
                                    </ArticlesButton>
                                </div>

                                <div>
                                    <div className="text-muted mb-1">Graphics Quality</div>
                                    {['Low', 'Medium', 'High'].map(level =>
                                        <ArticlesButton
                                            key={level}
                                            className={``}
                                            active={level == graphicsQuality}
                                            // small
                                            onClick={() => setGraphicsQuality(level)}
                                        >
                                            {level}
                                        </ArticlesButton>
                                    )}
                                </div>
                            </div>
                        }
                        {tab == 'Controls' &&
                            <div>
                                {[
                                    {
                                        action: 'Move Up',
                                        defaultKeyboardKey: 'W'
                                    },
                                    {
                                        action: 'Move Down',
                                        defaultKeyboardKey: 'S'
                                    },
                                    {
                                        action: 'Move Left',
                                        defaultKeyboardKey: 'A'
                                    },
                                    {
                                        action: 'Move Right',
                                        defaultKeyboardKey: 'D'
                                    },
                                ].map(obj =>
                                    <div key={obj.action}>
                                        <div className="flex-header border-bottom pb-1 mb-1">

                                            <div>
                                                <div>{obj.action}</div>
                                                {obj.emote && <div className="span badge bg-dark">Emote</div>}
                                            </div>

                                            <div>

                                                <div className="badge badge-hover bg-articles me-1">{obj.defaultKeyboardKey}</div>

                                                <ArticlesButton
                                                    className=""
                                                    small
                                                >
                                                    Change Key
                                                </ArticlesButton>

                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        }
                        {tab == 'Audio' &&
                            <>
                                <Form.Label className="mb-0">Game Volume</Form.Label>
                                <Form.Range />
                                <Form.Label className="mb-0">Music Volume</Form.Label>
                                <Form.Range />
                            </>
                        }
                        {tab == 'Chat' &&
                            <>
                                <Form.Check
                                    type="switch"
                                    id="custom-switch"
                                    label="Game chat panel"
                                />
                                <Form.Check
                                    type="switch"
                                    id="custom-switch"
                                    label="Censor chat"
                                />
                                <Form.Check
                                    type="switch"
                                    id="custom-switch"
                                    label="Game chat speech bubbles"
                                />
                            </>
                        }
                    </div>

                </Modal.Body>

                <Modal.Footer className="justify-content-between">

                    {/* <div></div> */}


                    <div>

                        <ArticlesButton
                            variant="outline-dark"
                            onClick={() => {
                                setShow(false)
                            }}
                        >
                            Close
                        </ArticlesButton>

                        <ArticlesButton
                            variant="outline-danger ms-3"
                            onClick={() => {
                                setShow(false)
                            }}
                        >
                            Reset
                        </ArticlesButton>

                    </div>


                    {/* <ArticlesButton variant="success" onClick={() => setValue(false)}>
                    Save
                </ArticlesButton> */}

                </Modal.Footer>

            </Modal>
        </>
    )

}