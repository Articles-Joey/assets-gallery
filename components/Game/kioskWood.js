import {
    BoxGeometry,
    CanvasTexture,
    RepeatWrapping,
    SRGBColorSpace,
} from "three";

let woodMaps;

// Shared, deterministic textures generated locally, without external assets.
export function getKioskWoodMaps() {
    if (woodMaps) return woodMaps;
    if (typeof document === "undefined") return {};

    const width = 256;
    const height = 512;
    const canvases = Array.from({ length: 3 }, () => {
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        return canvas;
    });
    const contexts = canvases.map((canvas) => canvas.getContext("2d"));
    const images = contexts.map((context) =>
        context.createImageData(width, height),
    );
    const tau = Math.PI * 2;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const u = x / width;
            const v = y / height;
            // Periodic warping gives seamless, elongated growth fibers.
            const warp =
                0.012 * Math.sin(v * tau) +
                0.006 * Math.sin(v * tau * 3 + u * tau);
            let grainX = u + warp;
            let knotShade = 0;
            for (const [kx, ky] of [
                [0.28, 0.32],
                [0.76, 0.81],
            ]) {
                const dx = Math.sin((u - kx) * Math.PI) / Math.PI;
                const dy = Math.sin((v - ky) * Math.PI) / Math.PI;
                const radius = Math.sqrt(dx * dx * 8 + dy * dy);
                const influence = Math.exp(-radius * radius * 95);
                grainX += Math.sin(radius * 72) * influence * 0.018;
                knotShade += influence * 0.2;
            }
            const broad = Math.sin(grainX * tau * 7 + Math.sin(v * tau) * 0.4);
            const fibers = Math.sin(
                grainX * tau * 57 + Math.sin(v * tau * 2) * 0.7,
            );
            const pores = Math.pow(
                0.5 + 0.5 * Math.sin(grainX * tau * 113),
                12,
            );
            const noise =
                ((Math.imul(x + 1, 374761393) ^ Math.imul(y + 1, 668265263)) >>>
                    0) /
                    4294967295 -
                0.5;
            const grain =
                broad * 0.09 +
                fibers * 0.035 -
                pores * 0.045 -
                knotShade +
                noise * 0.025;
            const index = (y * width + x) * 4;
            images[0].data.set(
                [185 + grain * 140, 142 + grain * 120, 91 + grain * 90, 255],
                index,
            );
            const relief = Math.round((0.55 + grain) * 255);
            images[1].data.set([relief, relief, relief, 255], index);
            const roughness = Math.round((0.79 - grain * 0.4) * 255);
            images[2].data.set([roughness, roughness, roughness, 255], index);
        }
    }

    const textures = canvases.map((canvas, index) => {
        contexts[index].putImageData(images[index], 0, 0);
        const texture = new CanvasTexture(canvas);
        texture.wrapS = texture.wrapT = RepeatWrapping;
        texture.anisotropy = 8;
        return texture;
    });
    textures[0].colorSpace = SRGBColorSpace;
    woodMaps = {
        map: textures[0],
        bumpMap: textures[1],
        roughnessMap: textures[2],
    };
    return woodMaps;
}

export function createTimberGeometry(size) {
    const geometry = new BoxGeometry(...size);
    const positions = geometry.getAttribute("position");
    const normals = geometry.getAttribute("normal");
    const uv = geometry.getAttribute("uv");
    for (let i = 0; i < positions.count; i++) {
        let axes =
            Math.abs(normals.getX(i)) > 0.5
                ? [2, 1]
                : Math.abs(normals.getY(i)) > 0.5
                  ? [0, 2]
                  : [0, 1];
        // Grain follows each beam's longest dimension, including horizontal trim.
        if (size[axes[0]] > size[axes[1]]) axes = [axes[1], axes[0]];
        uv.setXY(
            i,
            positions.getComponent(i, axes[0]) / 0.24 + 0.5,
            positions.getComponent(i, axes[1]) + 0.5,
        );
    }
    return geometry;
}
