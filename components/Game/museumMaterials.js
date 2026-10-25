import {
    BoxGeometry,
    CanvasTexture,
    RepeatWrapping,
    SRGBColorSpace,
} from "three";

let brickMaps;
let frostedGlassTexture;

function noise(x, y, seed) {
    let value = Math.imul(x + seed, 374761393) ^ Math.imul(y + seed, 668265263);
    value = Math.imul(value ^ (value >>> 13), 1274126177);
    return ((value ^ (value >>> 16)) >>> 0) / 4294967295;
}

export function getMuseumBrickMaps() {
    if (brickMaps) return brickMaps;
    if (typeof document === "undefined") return {};
    const size = 512;
    const canvases = Array.from({ length: 3 }, () => {
        const canvas = document.createElement("canvas");
        canvas.width = canvas.height = size;
        return canvas;
    });
    const contexts = canvases.map((canvas) => canvas.getContext("2d"));
    const images = contexts.map((context) =>
        context.createImageData(size, size),
    );

    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            const row = Math.floor(y / 64);
            const shiftedX = (x + (row % 2) * 64) % size;
            const column = Math.floor(shiftedX / 128);
            const edge = Math.min(
                shiftedX % 128,
                127 - (shiftedX % 128),
                y % 64,
                63 - (y % 64),
            );
            const mortar = edge < 3;
            const bevel = Math.min(1, Math.max(0, (edge - 3) / 4));
            const grain = noise(x, y, 19);
            const coarse = noise(Math.floor(x / 4), Math.floor(y / 4), 41);
            const pits = grain < 0.09 ? -0.2 : 0;
            const variation = noise(column, row, 73);
            const shade = mortar
                ? 188 + grain * 8
                : 223 +
                  variation * 13 +
                  (grain - 0.5) * 13 +
                  (coarse - 0.5) * 5 +
                  pits * 35;
            const relief = mortar
                ? 0.23 + grain * 0.04
                : 0.48 + bevel * 0.19 + (grain - 0.5) * 0.12 + pits;
            const index = (y * size + x) * 4;
            images[0].data.set([shade + 4, shade + 2, shade - 4, 255], index);
            const bump = relief * 255;
            images[1].data.set([bump, bump, bump, 255], index);
            const roughness = 230 + grain * 25;
            images[2].data.set([roughness, roughness, roughness, 255], index);
        }
    }

    const maps = canvases.map((canvas, index) => {
        contexts[index].putImageData(images[index], 0, 0);
        const texture = new CanvasTexture(canvas);
        texture.wrapS = texture.wrapT = RepeatWrapping;
        texture.anisotropy = 8;
        return texture;
    });
    maps[0].colorSpace = SRGBColorSpace;
    brickMaps = { map: maps[0], bumpMap: maps[1], roughnessMap: maps[2] };
    return brickMaps;
}

export function createMuseumBrickGeometry(size, position, sectionZ) {
    const geometry = new BoxGeometry(...size);
    return projectMuseumBrickUVs(geometry, position, sectionZ);
}

export function projectMuseumBrickUVs(
    geometry,
    position = [0, 0, 0],
    sectionZ = 0,
) {
    const vertices = geometry.getAttribute("position");
    const normals = geometry.getAttribute("normal");
    const uv = geometry.getAttribute("uv");
    const origin = [position[0], position[1], position[2] + sectionZ];
    // A tile represents 1.28 metres: bricks keep their size as spacing changes.
    for (let i = 0; i < uv.count; i++) {
        const axes =
            Math.abs(normals.getX(i)) > 0.5
                ? [2, 1]
                : Math.abs(normals.getY(i)) > 0.5
                  ? [0, 2]
                  : [0, 1];
        uv.setXY(
            i,
            (vertices.getComponent(i, axes[0]) + origin[axes[0]]) / 1.28,
            (vertices.getComponent(i, axes[1]) + origin[axes[1]]) / 1.28,
        );
    }
    return geometry;
}

export function getMuseumFrostedGlassTexture() {
    if (frostedGlassTexture) return frostedGlassTexture;
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 128;
    const context = canvas.getContext("2d");
    const pixels = context.createImageData(128, 128);
    for (let y = 0; y < 128; y++) {
        for (let x = 0; x < 128; x++) {
            const value = 207 + noise(x, y, 193) * 48;
            pixels.data.set([value, value, value, 255], (y * 128 + x) * 4);
        }
    }
    context.putImageData(pixels, 0, 0);
    frostedGlassTexture = new CanvasTexture(canvas);
    frostedGlassTexture.wrapS = frostedGlassTexture.wrapT = RepeatWrapping;
    return frostedGlassTexture;
}
