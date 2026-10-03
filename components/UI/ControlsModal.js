"use client";

import ArticlesModal from "./ArticlesModal";

export default function ControlsModal({ show, setShow }) {
    return (
        <ArticlesModal show={show} setShow={setShow} title="Controls">
            You can navigate the world using either mouse and keyboard, or click/touch and drag controls.
        </ArticlesModal>
    );
}
