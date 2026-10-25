import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Environment, Lightformer, Sky, Stars } from "@react-three/drei";
import { Object3D } from "three";
import { useStore } from "@/hooks/useStore";
import { useAssetGalleryStore } from "@/hooks/useAssetGalleryStore";

export default function SceneLighting() {
    const darkMode = useStore((state) => state.darkMode !== false);
    const quality = useStore((state) => state.graphicsQuality);
    const museum = useAssetGalleryStore(
        (state) => state.galleryTheme === "Museum",
    );
    const light = useRef();
    const target = useMemo(() => new Object3D(), []);
    const shadowSize = museum
        ? quality === "High"
            ? 2048
            : quality === "Low"
              ? 512
              : 1024
        : quality === "High"
          ? 4096
          : quality === "Low"
            ? 1024
            : 2048;

    useFrame(() => {
        if (!light.current) return;
        const [x, , z] = useAssetGalleryStore.getState().position;
        // Snap the moving shadow volume to texels to reduce crawling edges.
        const texel = 44 / shadowSize;
        const px = Math.round(x / texel) * texel;
        const pz = Math.round(z / texel) * texel;
        light.current.position.set(px + 12, 22, pz + 8);
        target.position.set(px, -1, pz);
        target.updateMatrixWorld();
    });

    return (
        <>
            <color
                attach="background"
                args={[darkMode ? "#0c1626" : "#b9d5e3"]}
            />
            <fog
                attach="fog"
                args={[darkMode ? "#0c1626" : "#c2d6d9", 32, 95]}
            />
            {darkMode ? (
                <Stars
                    radius={100}
                    depth={35}
                    count={1500}
                    factor={2}
                    saturation={0}
                    fade
                />
            ) : (
                <Sky
                    sunPosition={[12, 22, 8]}
                    turbidity={5}
                    rayleigh={1.5}
                />
            )}
            <hemisphereLight
                args={[
                    darkMode ? "#8daee0" : "#d9edff",
                    darkMode ? "#283428" : "#77724b",
                    darkMode ? 0.5 : 0.95,
                ]}
            />
            <ambientLight
                color={darkMode ? "#a4bbdc" : "#fff2db"}
                intensity={darkMode ? 0.12 : 0.18}
            />
            <Environment
                key={darkMode ? "night-reflections" : "day-reflections"}
                resolution={128}
                frames={1}
                environmentIntensity={darkMode ? 0.06 : 0.12}
            >
                <color
                    attach="background"
                    args={[darkMode ? "#172238" : "#9eafb6"]}
                />
                <Lightformer
                    form="rect"
                    position={[0, 8, 0]}
                    rotation={[Math.PI / 2, 0, 0]}
                    scale={[20, 20, 1]}
                    color={darkMode ? "#b5ceff" : "#f4f6ff"}
                    intensity={2}
                />
                <Lightformer
                    form="rect"
                    position={[8, 4, -5]}
                    rotation={[0, -Math.PI / 2, 0]}
                    scale={[3, 8, 1]}
                    color={darkMode ? "#a0bfff" : "#fff1d8"}
                    intensity={3}
                />
                <Lightformer
                    form="rect"
                    position={[-6, 2, 2]}
                    rotation={[0, Math.PI / 2, 0]}
                    scale={[4, 6, 1]}
                    color="#739071"
                    intensity={0.65}
                />
            </Environment>
            <primitive object={target} />
            <directionalLight
                key={`${museum}-${shadowSize}`}
                ref={light}
                target={target}
                position={[12, 22, 8]}
                color={darkMode ? "#adc9ff" : "#ffecd0"}
                intensity={darkMode ? 0.85 : 2}
                castShadow
                shadow-mapSize-width={shadowSize}
                shadow-mapSize-height={shadowSize}
                shadow-camera-left={-22}
                shadow-camera-right={22}
                shadow-camera-top={22}
                shadow-camera-bottom={-22}
                shadow-camera-near={0.5}
                shadow-camera-far={85}
                shadow-bias={-0.00015}
                shadow-normalBias={0.035}
                shadow-radius={3}
            />
        </>
    );
}
