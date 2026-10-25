"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import Slider from "@mui/material/Slider";
import Switch from "@mui/material/Switch";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import ArticlesModal from "@/components/UI/ArticlesModal";
import ArticlesButton from "@/components/UI/Button";

const keyBindings = [
    { action: "Move Up", defaultKeyboardKey: "W" },
    { action: "Move Down", defaultKeyboardKey: "S" },
    { action: "Move Left", defaultKeyboardKey: "A" },
    { action: "Move Right", defaultKeyboardKey: "D" },
    { action: "Drop Insect", defaultKeyboardKey: "Space" },
    { action: "Stop Powerup", defaultKeyboardKey: "ArrowDown" },
    {
        emote: true,
        action: "Stick out Tongue",
        defaultKeyboardKey: "ArrowDown",
    },
    { emote: true, action: "Rotate Left", defaultKeyboardKey: "ArrowLeft" },
    { emote: true, action: "Rotate Right", defaultKeyboardKey: "ArrowRight" },
];

export default function FourFrogsSettingsModal({ show, setShow }) {
    const [tab, setTab] = useState("Controls");

    return (
        <ArticlesModal
            show={show}
            setShow={setShow}
            title="Game Settings"
            centered={false}
            contentSx={{ p: 0 }}
            footerOverride={(setOpen) => (
                <Box sx={{ display: "flex", gap: 2 }}>
                    <ArticlesButton
                        variant="outline-dark"
                        onClick={() => setOpen(false)}
                    >
                        Close
                    </ArticlesButton>
                    <ArticlesButton
                        variant="outline-danger"
                        onClick={() => setOpen(false)}
                    >
                        Reset
                    </ArticlesButton>
                </Box>
            )}
        >
            <Tabs
                value={tab}
                onChange={(_, value) => setTab(value)}
                aria-label="Settings sections"
                sx={{ px: 1 }}
            >
                {["Controls", "Audio", "Chat"].map((item) => (
                    <Tab
                        key={item}
                        value={item}
                        label={item}
                    />
                ))}
            </Tabs>
            <Divider />
            <Box sx={{ p: 1 }}>
                {tab === "Controls" &&
                    keyBindings.map((binding) => (
                        <Box
                            key={binding.action}
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                borderBottom: 1,
                                borderColor: "divider",
                                pb: 0.5,
                                mb: 0.5,
                            }}
                        >
                            <Box>
                                <Box>{binding.action}</Box>
                                {binding.emote && (
                                    <Chip
                                        size="small"
                                        label="Emote"
                                        sx={{
                                            bgcolor: "#212529",
                                            color: "#fff",
                                        }}
                                    />
                                )}
                            </Box>
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 0.5,
                                }}
                            >
                                <Chip
                                    size="small"
                                    label={binding.defaultKeyboardKey}
                                />
                                <ArticlesButton small>
                                    Change Key
                                </ArticlesButton>
                            </Box>
                        </Box>
                    ))}
                {tab === "Audio" && (
                    <>
                        <Typography id="game-volume-label">
                            Game Volume
                        </Typography>
                        <Slider
                            aria-labelledby="game-volume-label"
                            defaultValue={50}
                        />
                        <Typography id="music-volume-label">
                            Music Volume
                        </Typography>
                        <Slider
                            aria-labelledby="music-volume-label"
                            defaultValue={50}
                        />
                    </>
                )}
                {tab === "Chat" && (
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                        {[
                            "Game chat panel",
                            "Censor chat",
                            "Game chat speech bubbles",
                        ].map((label) => (
                            <FormControlLabel
                                key={label}
                                control={<Switch />}
                                label={label}
                            />
                        ))}
                    </Box>
                )}
            </Box>
        </ArticlesModal>
    );
}
