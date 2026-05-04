import { useEffect, useState } from "react";

import { Modal } from "react-bootstrap"

import ArticlesButton from "./Button";

export default function ControlsModal({
    show,
    setShow,
    credits
}) {

    const [showModal, setShowModal] = useState(true)

    return (
        <>

            <Modal
                className="articles-modal controls-modal"
                size='md'
                show={showModal}
                centered
                scrollable
                onExited={() => {
                    setShow(false)
                }}
                onHide={() => {
                    setShowModal(false)
                }}
            >

                <Modal.Header closeButton>
                    <Modal.Title>Controls</Modal.Title>
                </Modal.Header>

                <Modal.Body className="flex-column p-0">

                    <div className="p-3">
                        You can navigate the world using either mouse and keyboard, or click/touch and drag controls.
                    </div>

                </Modal.Body>

                <Modal.Footer className="justify-content-between">

                    <div></div>

                    <ArticlesButton variant="outline-dark" onClick={() => {
                        setShow(false)
                    }}>
                        Close
                    </ArticlesButton>

                </Modal.Footer>

            </Modal>
        </>
    )

}