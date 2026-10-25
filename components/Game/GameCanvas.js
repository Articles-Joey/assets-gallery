import { memo, useEffect, useRef } from "react";
import { Physics } from "@react-three/cannon";
import { Stats } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { PCFSoftShadowMap } from "three";
import { useStore } from "@/hooks/useStore";
import { useAssetGalleryStore } from "@/hooks/useAssetGalleryStore";
import Ground from "./Ground";
import Alley from "./Alley";
import AssetSections from "./AssetSections";
import { Player } from "./Player";
import { FPV } from "./FPV";
import SocketPlayers from "./SocketPlayers";
import SceneLighting from "./SceneLighting";
import MuseumPhysics from "./MuseumPhysics";
import MuseumLighting from "./MuseumLighting";

function TouchControls3D() {
    const { gl } = useThree();
    const setTouchCameraAngle = useAssetGalleryStore(
        (state) => state.setTouchCameraAngle,
    );
    const yawRef = useRef(0);
    const pitchRef = useRef(-0.1);
    const lastPosRef = useRef(null);

    useEffect(() => {
        const canvas = gl.domElement;

        // --- Touch ---
        const onTouchStart = (e) => {
            if (e.touches.length !== 1) return;
            lastPosRef.current = {
                x: e.touches[0].clientX,
                y: e.touches[0].clientY,
            };
        };
        const onTouchMove = (e) => {
            if (e.touches.length !== 1 || !lastPosRef.current) return;
            const touch = e.touches[0];
            const dx = touch.clientX - lastPosRef.current.x;
            const dy = touch.clientY - lastPosRef.current.y;
            yawRef.current -= dx * 0.003;
            pitchRef.current -= dy * 0.003;
            pitchRef.current = Math.max(
                -Math.PI / 2 + 0.1,
                Math.min(Math.PI / 2 - 0.1, pitchRef.current),
            );
            setTouchCameraAngle(yawRef.current, pitchRef.current);
            lastPosRef.current = { x: touch.clientX, y: touch.clientY };
            e.preventDefault();
        };
        const onTouchEnd = () => {
            lastPosRef.current = null;
        };

        // --- Mouse ---
        const onMouseDown = (e) => {
            lastPosRef.current = { x: e.clientX, y: e.clientY };
        };
        const onMouseMove = (e) => {
            if (!lastPosRef.current) return;
            const dx = e.clientX - lastPosRef.current.x;
            const dy = e.clientY - lastPosRef.current.y;
            yawRef.current -= dx * 0.003;
            pitchRef.current -= dy * 0.003;
            pitchRef.current = Math.max(
                -Math.PI / 2 + 0.1,
                Math.min(Math.PI / 2 - 0.1, pitchRef.current),
            );
            setTouchCameraAngle(yawRef.current, pitchRef.current);
            lastPosRef.current = { x: e.clientX, y: e.clientY };
        };
        const onMouseUp = () => {
            lastPosRef.current = null;
        };

        canvas.addEventListener("touchstart", onTouchStart, { passive: true });
        canvas.addEventListener("touchmove", onTouchMove, { passive: false });
        canvas.addEventListener("touchend", onTouchEnd, { passive: true });
        canvas.addEventListener("mousedown", onMouseDown);
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);

        return () => {
            canvas.removeEventListener("touchstart", onTouchStart);
            canvas.removeEventListener("touchmove", onTouchMove);
            canvas.removeEventListener("touchend", onTouchEnd);
            canvas.removeEventListener("mousedown", onMouseDown);
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
        };
    }, [gl, setTouchCameraAngle]);

    return null;
}

function TouchMarker() {
    const touchTarget = useAssetGalleryStore((state) => state.touchTarget);
    if (!touchTarget) return null;
    return (
        <mesh position={[touchTarget[0], -0.5, touchTarget[2]]}>
            <cylinderGeometry args={[0.15, 0.15, 1, 24]} />
            <meshStandardMaterial
                color="#00ff88"
                transparent
                opacity={0.7}
            />
        </mesh>
    );
}

function GameCanvas() {
    const controlType = useStore((state) => state.controlType);
    const showStats = useStore((state) => state?.debugConfig?.showStats);
    const quality = useStore((state) => state.graphicsQuality);
    const museum = useAssetGalleryStore(
        (state) => state.galleryTheme === "Museum",
    );
    const dpr = museum
        ? quality === "Low"
            ? 1
            : [1, quality === "High" ? 1.5 : 1.25]
        : [1, 2];

    return (
        <Canvas
            shadows={PCFSoftShadowMap}
            dpr={dpr}
            style={{ zIndex: 1 }}
            id="gallery-canvas"
        >
            {showStats && <Stats className="stats-overlay" />}
            {controlType === "Touch" && (
                <>
                    <TouchControls3D />
                    <TouchMarker />
                </>
            )}
            <SceneLighting />
            <MuseumLighting />
            {controlType === "Mouse and Keyboard" && <FPV />}
            <AssetSections />
            <Physics
                iterations={10}
                gravity={[0, -10, 0]}
                defaultContactMaterial={{ friction: 0, restitution: 0 }}
            >
                <Player />
                <SocketPlayers />
                <Alley />
                <MuseumPhysics />
                <Ground />
            </Physics>
        </Canvas>
    );
}

export default memo(GameCanvas);
