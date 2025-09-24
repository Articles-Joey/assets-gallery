"use client"

import { useEffect } from "react";
import { useAssetGalleryStore } from "@/hooks/useAssetGalleryStore";

export default function AudioManager() {

    const galleryTheme = useAssetGalleryStore(state => state.galleryTheme);
    const music = useAssetGalleryStore(state => state.music);

    useEffect(() => {

        if (!galleryTheme || !music) {
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
        // ping.volume = clamp(velocity / 20, 0, 1)
        musicElement.play()

        musicElement.onended = function () {
            console.log("audio ended")
            musicElement.currentTime = 0
            musicElement.play()
        };

        return () => {
            musicElement.pause();
        }

    }, [galleryTheme, music])

    return null;
}