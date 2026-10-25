"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ArticlesButton from "@/components/UI/Button";
import { useAssetGalleryStore } from "@/hooks/useAssetGalleryStore";
import { useStore } from "@/hooks/useStore";
import { useSocketStore } from "@/hooks/useSocketStore";
import logo from "@/app/icon.png";
import SessionButton from "@articles-media/articles-dev-box/SessionButton";
import GameMenuPrimaryButtonGroup from "@articles-media/articles-dev-box/GameMenuPrimaryButtonGroup";
import NicknameInput from "@articles-media/articles-dev-box/NicknameInput";
import useUserDetails from "@articles-media/articles-dev-box/useUserDetails";
import useUserToken from "@articles-media/articles-dev-box/useUserToken";

const ReturnToLauncherButton = dynamic(
    () => import("@articles-media/articles-dev-box/ReturnToLauncherButton"),
    { ssr: false },
);
const Ad = dynamic(() => import("@articles-media/articles-dev-box/Ad"), {
    ssr: false,
});

export const locations = [
    {
        name: "Forest",
        thumb: `${process.env.NEXT_PUBLIC_CDN}games/Assets Gallery/Forest.png`,
    },
    {
        name: "Alley",
        thumb: `${process.env.NEXT_PUBLIC_CDN}games/Assets Gallery/Alley.png`,
    },
    {
        name: "Museum",
        thumb: `${process.env.NEXT_PUBLIC_CDN}games/Assets Gallery/asset-gallery.jpg`,
    },
];

function FlatBackground({ galleryTheme, sx }) {
    return (
        <Box
            component="img"
            src={
                locations.find((location) => location.name === galleryTheme)
                    ?.thumb
            }
            alt=""
            sx={{
                display: "block",
                width: "100%",
                height: "100%",
                objectFit: "cover",
                ...sx,
            }}
        />
    );
}

function GalleryFilter({ label, value, onChange, options }) {
    return (
        <FormControl size="small">
            <Typography
                component="label"
                htmlFor={label === "Authors" ? "author-filter" : "type-filter"}
                variant="caption"
            >
                {label}
            </Typography>
            <Select
                id={label === "Authors" ? "author-filter" : "type-filter"}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                disabled
                startAdornment={
                    <InputAdornment position="start">
                        <FilterAltIcon fontSize="small" />
                    </InputAdornment>
                }
                inputProps={{ "aria-label": label }}
                sx={{ fontSize: "0.875rem" }}
            >
                {options.map((option) => (
                    <MenuItem
                        key={option}
                        value={option}
                    >
                        {option}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}

export default function AssetsMuseumLobbyPage() {
    const socket = useSocketStore((state) => state.socket);
    const connected = useSocketStore((state) => state.connected);
    const darkMode = useStore((state) => state.darkMode);
    const galleryTheme = useAssetGalleryStore((state) => state.galleryTheme);
    const lobbyDetails = useStore((state) => state.lobbyDetails);
    const [authorFilter, setAuthorFilter] = useState("Anyone");
    const [typeFilter, setTypeFilter] = useState("Anything");
    const { data: userToken } = useUserToken(process.env.NEXT_PUBLIC_GAME_PORT);
    const { data: userDetails, isLoading: userDetailsLoading } = useUserDetails(
        { token: userToken },
    );

    useEffect(() => {
        if (!socket?.connected) return;
        const room = `game:${process.env.NEXT_PUBLIC_GAME_KEY}-landing`;
        socket.emit("join-room", room);
        return () => socket.emit("leave-room", room);
    }, [socket, connected]);

    return (
        <Box
            sx={{
                minHeight: "100vh",
                position: "relative",
                isolation: "isolate",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                "& .ad-wrap": {
                    position: "absolute",
                    right: "1rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    display: "none",
                    "@media (min-width: 992px)": { display: "block" },
                },
            }}
        >
            <Box
                sx={{
                    position: "fixed",
                    inset: 0,
                    zIndex: -1,
                    overflow: "hidden",
                }}
            >
                <FlatBackground
                    galleryTheme={galleryTheme}
                    sx={{
                        filter:
                            darkMode === false
                                ? "blur(3px)"
                                : "blur(3px) brightness(0.5)",
                        transform: "scale(1.2)",
                    }}
                />
            </Box>
            <Box
                sx={{
                    width: "100%",
                    maxWidth: 1320,
                    px: 1.5,
                    py: 2,
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                <Box
                    sx={{
                        width: "24rem",
                        maxWidth: "100%",
                        position: "relative",
                    }}
                >
                    <Box sx={{ textAlign: "center", mb: 2 }}>
                        <Box
                            component="img"
                            src={logo.src}
                            alt="Game Logo"
                            sx={{
                                mb: 1,
                                height: 150,
                                objectFit: "contain",
                                width: "100%",
                            }}
                        />
                        <Typography
                            component="h1"
                            sx={{
                                mb: 0,
                                fontSize: "2.5rem",
                                fontWeight: 500,
                                lineHeight: 1.2,
                            }}
                        >
                            Assets Gallery
                        </Typography>
                    </Box>
                    <Card
                        sx={{
                            bgcolor: "game.card",
                            backgroundImage: "none",
                            fontSize: "0.875rem",
                            mb: 3,
                            overflow: "visible",
                            border: 1,
                            borderColor: "divider",
                        }}
                    >
                        <Box
                            sx={{
                                p: 1,
                                borderBottom: 1,
                                borderColor: "divider",
                            }}
                        >
                            <NicknameInput useStore={useStore} />
                        </Box>
                        <CardContent sx={{ p: 1, "&:last-child": { pb: 1 } }}>
                            <ScenePicker />
                            <Box
                                sx={{
                                    bgcolor: "#000",
                                    p: 0.5,
                                    mb: 2,
                                    fontWeight: 700,
                                    color: connected
                                        ? "success.light"
                                        : "warning.light",
                                }}
                            >
                                {connected
                                    ? `${lobbyDetails?.players?.length || 0} player(s) currently on the site.`
                                    : "Connecting to online services..."}
                            </Box>
                            {/* <Box sx={{ display: "flex", gap: 1 }}>
                                <GalleryFilter label="Authors" value={authorFilter} onChange={setAuthorFilter} options={["Anyone", "@Joey"]} />
                                <GalleryFilter label="Asset Types" value={typeFilter} onChange={setTypeFilter} options={["Anything", "Images", "Videos", "Gifs", "3D Models"]} />
                            </Box> */}
                            {/* <Divider sx={{ my: 2 }} /> */}
                            <ArticlesButton
                                component={Link}
                                href="/play"
                                fullWidth
                                large
                                startIcon={<PlayArrowIcon />}
                            >
                                Enter Asset Gallery
                            </ArticlesButton>
                        </CardContent>
                        <Box
                            sx={{
                                p: 1,
                                borderTop: 1,
                                borderColor: "divider",
                                display: "flex",
                                flexWrap: "wrap",
                                justifyContent: "center",
                            }}
                        >
                            <GameMenuPrimaryButtonGroup
                                useStore={useStore}
                                type="Landing"
                            />
                        </Box>
                    </Card>
                    <Box sx={{ mb: 2 }}>
                        <SessionButton
                            port={process.env.NEXT_PUBLIC_GAME_PORT}
                            friendsButton
                        />
                        <ReturnToLauncherButton />
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <ArticlesButton
                            component="a"
                            href="https://articles.media/community/assets?utm_source=assets-gallery"
                            target="_blank"
                            rel="noopener noreferrer"
                            small
                        >
                            View Community Assets
                        </ArticlesButton>
                    </Box>
                </Box>
                <Ad
                    style="Default"
                    section="Games"
                    section_id={process.env.NEXT_PUBLIC_GAME_NAME}
                    darkMode={darkMode !== false}
                    user_ad_token={userToken}
                    userDetails={userDetails}
                    userDetailsLoading={userDetailsLoading}
                />
            </Box>
        </Box>
    );
}

export function SceneButtons() {
    const galleryTheme = useAssetGalleryStore((state) => state.galleryTheme);
    const setGalleryTheme = useAssetGalleryStore(
        (state) => state.setGalleryTheme,
    );

    return (
        <>
            {locations.map((location) => (
                <ArticlesButton
                    key={location.name}
                    active={galleryTheme === location.name}
                    small
                    onClick={() => setGalleryTheme(location.name)}
                >
                    {location.name}
                </ArticlesButton>
            ))}
        </>
    );
}

function ScenePicker() {
    const galleryTheme = useAssetGalleryStore((state) => state.galleryTheme);
    const setGalleryTheme = useAssetGalleryStore(
        (state) => state.setGalleryTheme,
    );

    return (
        <Box
            sx={{
                mb: 2,
                bgcolor: "game.card",
                border: 1,
                borderColor: "divider",
                borderRadius: 1,
                overflow: "hidden",
                "@media (min-width: 992px)": {
                    position: "absolute",
                    left: "calc(-220px - 1rem)",
                    width: 220,
                    top: "50%",
                    transform: "translateY(-50%)",
                },
            }}
        >
            <Box
                sx={{
                    aspectRatio: "16 / 9",
                    bgcolor: "#000",
                    border: "2px solid #212529",
                    "@media (min-width: 992px)": { borderRadius: "5px" },
                }}
            >
                <FlatBackground galleryTheme={galleryTheme} />
            </Box>
            <Box
                sx={{
                    borderTop: 1,
                    borderColor: "divider",
                    display: "flex",
                    justifyContent: "center",
                    p: 0.5,
                }}
            >
                <SceneButtons />
            </Box>
        </Box>
    );
}
