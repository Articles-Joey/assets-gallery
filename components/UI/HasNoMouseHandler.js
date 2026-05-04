"use client"
import { useStore } from "@/hooks/useStore";
import { useEffect } from "react";

export default function HasNoMouseHandler({ children }) {

    const hasHydrated = useStore((state) => state._hasHydrated);

    const hasNoMouse = useStore((state) => state.hasNoMouse);
    const setHasNoMouse = useStore((state) => state.setHasNoMouse);
    const hasNoMouseCheck = useStore((state) => state.hasNoMouseCheck);
    const setHasNoMouseCheck = useStore((state) => state.setHasNoMouseCheck);

    // Set value for controlType based on hasNoMouse, also will handle showing first load controlType modal when done

    useEffect(() => {

        return

        if (!hasHydrated) return;

        if (hasNoMouseCheck == null) {
            const hasMouse = window.matchMedia("(pointer: fine)").matches;
            setHasNoMouse(!hasMouse);
            setHasNoMouseCheck(true);
        }

    }, [hasHydrated, hasNoMouseCheck, setHasNoMouse, setHasNoMouseCheck]);

    return (
        <>
        </>
    );
}