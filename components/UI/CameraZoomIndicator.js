"use client";

import Box from "@mui/material/Box";
import { useAssetGalleryStore } from "@/hooks/useAssetGalleryStore";

const MIN_DISTANCE = 2;
const MAX_DISTANCE = 20;

export default function CameraZoomIndicator() {
    const cameraDistance = useAssetGalleryStore(
        (state) => state.cameraDistance,
    );
    const isThirdPerson = useAssetGalleryStore((state) => state.isThirdPerson);
    if (!isThirdPerson) return null;

    const zoomPercent = Math.round(
        (1 - (cameraDistance - MIN_DISTANCE) / (MAX_DISTANCE - MIN_DISTANCE)) *
            100,
    );

    return (
        <Box
            sx={{
                position: "absolute",
                right: 16,
                top: "50%",
                transform: "translateY(-50%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px",
                zIndex: 2,
                pointerEvents: "none",
            }}
        >
            <Box
                sx={{
                    width: 6,
                    height: 100,
                    bgcolor: "rgba(255,255,255,0.2)",
                    borderRadius: "3px",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                }}
            >
                <Box
                    sx={{
                        width: "100%",
                        height: `${zoomPercent}%`,
                        bgcolor: "rgba(255,255,255,0.8)",
                        borderRadius: "3px",
                        transition: "height 0.1s ease-out",
                    }}
                />
            </Box>
            <Box
                component="span"
                sx={{
                    color: "rgba(255,255,255,0.8)",
                    fontSize: "0.65rem",
                    fontWeight: 600,
                }}
            >
                {zoomPercent}%
            </Box>
        </Box>
    );
}
