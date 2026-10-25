"use client";

import { memo } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import GameMenuPrimaryButtonGroup from "@articles-media/articles-dev-box/GameMenuPrimaryButtonGroup";
import { useStore } from "@/hooks/useStore";
import DebugCard from "./DebugCard";
import GameDetailsPanel from "./GameDetailsPanel";
import { useAudioStore } from "@/hooks/useAudioStore";

function LeftPanelContent() {
    const reloadScene = useStore((state) => state.reloadScene);
    const debug = useStore((state) => state.debug);

    return (
        <Box sx={{ width: "100%" }}>
            <Card
                sx={{
                    bgcolor: "game.card",
                    backgroundImage: "none",
                    fontSize: "0.875rem",
                    border: 1,
                    borderColor: "divider",
                }}
            >
                <CardContent
                    sx={{
                        p: 1,
                        "&:last-child": { pb: 1 },
                        display: "flex",
                        flexWrap: "wrap",
                    }}
                >
                    <GameMenuPrimaryButtonGroup
                        useStore={useStore}
                        type="GameMenu"
                        useRouter={useRouter}
                        useAudioStore={useAudioStore}
                    />
                </CardContent>
            </Card>
            <GameDetailsPanel />
            {debug && <DebugCard reloadScene={reloadScene} />}
        </Box>
    );
}

export default memo(LeftPanelContent);
