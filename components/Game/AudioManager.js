"use client"

import { useEffect, useRef } from "react";
import { useAssetGalleryStore } from "@/hooks/useAssetGalleryStore";
import { useAudioStore } from "@/hooks/useAudioStore";

export default function AudioManager() {

    const galleryTheme = useAssetGalleryStore(state => state.galleryTheme);
    // const music = useAssetGalleryStore(state => state.music);
    const enabled = useAudioStore(state => state.audioSettings.enabled);

    const game_volume = useAudioStore(state => state.audioSettings.game_volume);
    const musicRef = useRef(null);

    useEffect(() => {

        if (!galleryTheme || !enabled) {
            if (musicRef.current) {
                musicRef.current.pause();
                musicRef.current = null;
            }
            return
        }

        console.log("assetGalleryTheme changed, reload sound")

        let musicElement

        switch (galleryTheme) {
            case "Forest":
                musicElement = new Audio(`${process.env.NEXT_PUBLIC_CDN}audio-test/nature-sounds.mp3`)
                break;
            case "Museum":
                musicElement = new Audio(`${process.env.NEXT_PUBLIC_CDN}games/Assets+Gallery/peaceful-piano-loop-6903.mp3`)
                break;
            case "Alley":
                musicElement = new Audio(`${process.env.NEXT_PUBLIC_CDN}games/Assets+Gallery/Street-Ambience-3.mp3`)
                break;
        }

        if (!musicElement) return

        musicElement.currentTime = 0
        musicElement.volume = Math.max(0, Math.min(1, game_volume / 100));
        musicElement.loop = true;

        const startAudio = () => {
            musicElement.play().catch(err => {
                // If it fails, we wait for the next user interaction on the window
                console.warn("Audio autoplay blocked, waiting for interaction...");
                window.addEventListener('click', startAudio, { once: true });
                window.addEventListener('keydown', startAudio, { once: true });
                window.addEventListener('touchstart', startAudio, { once: true });
            });
        };

        startAudio();

        musicRef.current = musicElement;

        return () => {
            window.removeEventListener('click', startAudio);
            window.removeEventListener('keydown', startAudio);
            window.removeEventListener('touchstart', startAudio);
            musicElement.pause();
            musicElement.src = "";
            musicElement.load();
            if (musicRef.current === musicElement) {
                musicRef.current = null;
            }
        }

    }, [galleryTheme, enabled])

    // Update volume dynamically without restarting the tracks
    useEffect(() => {
        if (musicRef.current) {
            musicRef.current.volume = Math.max(0, Math.min(1, game_volume / 100));
        }
    }, [game_volume])

    return null;
}