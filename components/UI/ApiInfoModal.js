import { useEffect, useState } from "react";

import { Modal } from "react-bootstrap"

import ArticlesButton from "./Button";

export default function ApiInfoModal({
    show,
    setShow,
    credits
}) {

    const [showModal, setShowModal] = useState(true)

    return (
        <>
            <Modal
                className="articles-modal games-info-modal"
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
                    <Modal.Title>API Info</Modal.Title>
                </Modal.Header>

                <Modal.Body className="flex-column p-0">

                   <div className="p-3">
                        The local API server is not running. The gallery is using a fallback remote API.
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