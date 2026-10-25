"use client";

import Box from "@mui/material/Box";
import ArticlesButton from "@/components/UI/Button";
import { useAssetGalleryStore } from "@/hooks/useAssetGalleryStore";

export default function TouchControls({ touchControlsEnabled }) {
    const doJump = () => useAssetGalleryStore.getState().requestJump();

    return (
        <Box
            sx={{
                position: "fixed",
                left: 0,
                bottom: 50,
                zIndex: 1,
                display: touchControlsEnabled ? "block" : "none",
            }}
        >
            <ArticlesButton
                variant="dark"
                onTouchStart={(event) => {
                    event.preventDefault();
                    doJump();
                }}
                onClick={doJump}
            >
                Jump
            </ArticlesButton>
        </Box>
    );
}
