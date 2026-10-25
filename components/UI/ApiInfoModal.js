"use client";

import ArticlesModal from "./ArticlesModal";

export default function ApiInfoModal({ show, setShow }) {
    return (
        <ArticlesModal
            show={show}
            setShow={setShow}
            title="API Info"
        >
            The local API server is not running. The gallery is using a fallback
            remote API.
        </ArticlesModal>
    );
}
