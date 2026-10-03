"use client";

import { memo, useState } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Slider from "@mui/material/Slider";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import LogoutIcon from "@mui/icons-material/Logout";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import DoorFrontIcon from "@mui/icons-material/DoorFront";
import ArticlesButton from "@/components/UI/Button";
import { useAssetGalleryStore } from "@/hooks/useAssetGalleryStore";
import { useStore } from "@/hooks/useStore";
import useFullscreen from "@articles-media/articles-dev-box/useFullscreen";

const MIN_DISTANCE = 2;
const MAX_DISTANCE = 20;
const themes = ["Forest", "Museum", "Alley"];

function PlayerPosition() {
    const position = useAssetGalleryStore((state) => state.position);
    return <Box component="small">X: {position[0].toFixed(2)} - Y: {position[1].toFixed(2)} - Z: {position[2].toFixed(2)}</Box>;
}

function GalleryMenu({ menuOpen, reloadScene, lastAssetUpdate }) {
    const { isFullscreen, requestFullscreen, exitFullscreen } = useFullscreen();
    const controlType = useStore((state) => state.controlType);
    const setControlType = useStore((state) => state.setControlType);
    const galleryTheme = useAssetGalleryStore((state) => state.galleryTheme);
    const setGalleryTheme = useAssetGalleryStore((state) => state.setGalleryTheme);
    const music = useAssetGalleryStore((state) => state.music);
    const setMusic = useAssetGalleryStore((state) => state.setMusic);
    const isThirdPerson = useAssetGalleryStore((state) => state.isThirdPerson);
    const setIsThirdPerson = useAssetGalleryStore((state) => state.setIsThirdPerson);
    const cameraDistance = useAssetGalleryStore((state) => state.cameraDistance);
    const setCameraDistance = useAssetGalleryStore((state) => state.setCameraDistance);
    const [themeAnchor, setThemeAnchor] = useState(null);
    const zoomPercent = Math.round((1 - (cameraDistance - MIN_DISTANCE) / (MAX_DISTANCE - MIN_DISTANCE)) * 100);

    return (
        <Box className={`menu ${menuOpen ? "menu-open" : ""}`} sx={{ width: "100%" }}>
            <Box sx={{ width: "100%", px: 1.5, mx: "auto" }}>
                {lastAssetUpdate && <Box component="small" sx={{ mb: 2 }}>Last update: {new Date(lastAssetUpdate).toLocaleTimeString()}</Box>}
                <Box sx={{ fontWeight: 700 }}>Controls</Box>
                <Box sx={{ mb: 1 }}>
                    {["Mouse and Keyboard", "Touch"].map((item) => (
                        <ArticlesButton key={item} small active={item === controlType} onClick={() => setControlType(item)}>{item}</ArticlesButton>
                    ))}
                </Box>
                <Box sx={{ fontWeight: 700, mb: 0.5 }}>
                    Camera Position <Chip label="V" size="small" sx={{ ml: 1, bgcolor: "#000", color: "#fff" }} />
                </Box>
                <Box sx={{ mb: 1 }}>
                    {["First Person", "Third Person"].map((item) => (
                        <ArticlesButton key={item} small active={item === "First Person" ? !isThirdPerson : isThirdPerson} onClick={() => setIsThirdPerson(item === "Third Person")}>{item}</ArticlesButton>
                    ))}
                </Box>
                {isThirdPerson && (
                    <>
                        <Box sx={{ fontWeight: 700, mb: 0.5 }}>
                            Camera Zoom <Chip label="Mouse Wheel / Pinch" size="small" sx={{ ml: 1, bgcolor: "#000", color: "#fff" }} />
                        </Box>
                        <Box sx={{ mb: 1, display: "flex", alignItems: "center", gap: 2 }}>
                            <Box component="span" sx={{ fontWeight: 700 }}>{zoomPercent}%</Box>
                            <Slider aria-label="Camera zoom" value={zoomPercent} onChange={(_, value) => setCameraDistance(MIN_DISTANCE + (1 - value / 100) * (MAX_DISTANCE - MIN_DISTANCE))} sx={{ flex: 1 }} />
                        </Box>
                    </>
                )}
                <Box sx={{ fontWeight: 700 }}>Theme</Box>
                <Box sx={{ mb: 1 }}>
                    {themes.map((theme, index) => (
                        <ArticlesButton key={theme} active={galleryTheme === theme} small onClick={(event) => { event.preventDefault(); event.stopPropagation(); setGalleryTheme(theme); }}>
                            {theme}<Box component="span" sx={{ ml: 0.5, bgcolor: "#000", color: "#fff", px: 0.5, borderRadius: 0.5 }}>{index + 1}</Box>
                        </ArticlesButton>
                    ))}
                </Box>
                <Box sx={{ fontWeight: 700 }}>Music</Box>
                <Box sx={{ mb: 1 }}>
                    {["On", "Off"].map((value) => (
                        <ArticlesButton key={value} active={value === "On" ? music : !music} small onClick={(event) => { event.preventDefault(); event.stopPropagation(); setMusic(!music); }}>{value}</ArticlesButton>
                    ))}
                </Box>
                <ArticlesButton small sx={{ mb: 1 }} onClick={reloadScene} startIcon={<RestartAltIcon />}>Reload Game</ArticlesButton>
                <Card sx={{ textAlign: "center", p: 0, borderRadius: 0, bgcolor: "game.card", backgroundImage: "none", mb: 1, border: 1, borderColor: "divider" }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.875em", p: 0.5, borderBottom: 1, borderColor: "divider" }}>
                        <Box sx={{ fontSize: "0.875em" }}>{galleryTheme}</Box>
                        <PlayerPosition />
                    </Box>
                    <Box sx={{ p: 0.5, display: "flex" }}>
                        <ArticlesButton small active={music} aria-label="Toggle music" onClick={() => setMusic(!music)}><MusicNoteIcon fontSize="small" /></ArticlesButton>
                        <ArticlesButton small active={isFullscreen} aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"} onClick={() => isFullscreen ? exitFullscreen() : requestFullscreen()}>
                            {isFullscreen ? <FullscreenExitIcon fontSize="small" /> : <FullscreenIcon fontSize="small" />}
                        </ArticlesButton>
                        <ArticlesButton small onClick={() => console.log("Soon")} startIcon={<DoorFrontIcon />}>Teleport</ArticlesButton>
                        <ArticlesButton small aria-haspopup="menu" aria-expanded={Boolean(themeAnchor)} aria-controls={themeAnchor ? "gallery-theme-menu" : undefined} onClick={(event) => setThemeAnchor(event.currentTarget)}>Theme</ArticlesButton>
                        <Menu id="gallery-theme-menu" anchorEl={themeAnchor} open={Boolean(themeAnchor)} onClose={() => setThemeAnchor(null)}>
                            {themes.map((theme) => (
                                <MenuItem key={theme} selected={galleryTheme === theme} onClick={(event) => { event.preventDefault(); event.stopPropagation(); setGalleryTheme(theme); setThemeAnchor(null); }}>{theme}</MenuItem>
                            ))}
                        </Menu>
                    </Box>
                </Card>
                <ArticlesButton component={Link} href="/" fullWidth small sx={{ mb: 1 }} startIcon={<LogoutIcon />}>Leave Game</ArticlesButton>
            </Box>
        </Box>
    );
}

export default memo(GalleryMenu);
