"use client";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { useStore } from "@/hooks/useStore";
import { useAssetGalleryStore } from "@/hooks/useAssetGalleryStore";
import ArticlesButton from "./Button";

export default function DebugCard({ reloadScene }) {
    const position = useAssetGalleryStore((state) => state.position);
    const lastAssetUpdate = useStore((state) => state.lastAssetUpdate);

    return (
        <Card
            sx={{
                bgcolor: "game.card",
                backgroundImage: "none",
                fontSize: "0.875rem",
                border: 1,
                borderColor: "divider",
            }}
        >
            <CardContent sx={{ p: 1, "&:last-child": { pb: 1 } }}>
                <Box sx={{ mb: 1 }}>
                    <Box sx={{ fontSize: "0.875em", color: "text.secondary" }}>
                        Debug Related
                    </Box>
                    {lastAssetUpdate && (
                        <Box
                            component="small"
                            sx={{ mb: 2 }}
                        >
                            Last update:{" "}
                            {new Date(lastAssetUpdate).toLocaleTimeString()}
                        </Box>
                    )}
                </Box>
                <Box
                    sx={{
                        fontSize: "0.875em",
                        border: 1,
                        borderColor: "divider",
                        p: 1,
                    }}
                >
                    Position: {position[0]?.toFixed(2)} -{" "}
                    {position[1]?.toFixed(2)} - {position[2]?.toFixed(2)}
                </Box>
                <Box sx={{ display: "flex" }}>
                    <ArticlesButton
                        small
                        sx={{ width: "50%" }}
                        onClick={reloadScene}
                        startIcon={<RestartAltIcon />}
                    >
                        Reload Game
                    </ArticlesButton>
                    <ArticlesButton
                        small
                        sx={{ width: "50%" }}
                        onClick={reloadScene}
                        startIcon={<RestartAltIcon />}
                    >
                        Reset Camera
                    </ArticlesButton>
                </Box>
            </CardContent>
        </Card>
    );
}
