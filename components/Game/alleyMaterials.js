import { CanvasTexture, RepeatWrapping, SRGBColorSpace } from "three";

const surfaces = new Map();

function hash(x, y, seed) {
    let n = Math.imul(x + seed, 374761393) ^ Math.imul(y + seed, 668265263);
    n = Math.imul(n ^ (n >>> 13), 1274126177);
    return ((n ^ (n >>> 16)) >>> 0) / 4294967295;
}

// Actual color, relief and roughness textures, generated once per surface type.
export function getAlleySurface(kind) {
    if (surfaces.has(kind)) return surfaces.get(kind);
    if (typeof document === "undefined") return {};
    const size = 256;
    const canvases = Array.from({ length: 3 }, () => {
        const canvas = document.createElement("canvas");
        canvas.width = canvas.height = size;
        return canvas;
    });
    const contexts = canvases.map((canvas) => canvas.getContext("2d"));
    const images = contexts.map((context) =>
        context.createImageData(size, size),
    );
    const brick = kind === "brick";
    const tunnelBrick = kind === "tunnel-brick";
    const asphalt = kind === "asphalt";
    const base = brick
        ? [206, 188, 167]
        : asphalt
          ? [43, 45, 46]
          : [157, 155, 145];

    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            const fine = hash(x, y, 11);
            const coarse = hash(Math.floor(x / 8), Math.floor(y / 8), 73);
            const pores = fine < 0.08 ? -0.25 : 0;
            const relief =
                0.5 + (fine - 0.5) * 0.42 + (coarse - 0.5) * 0.13 + pores;
            const shade = (relief - 0.5) * (asphalt ? 55 : 66);
            const index = (y * size + x) * 4;
            let color = base.map((value) => value + shade);
            let surfaceRelief = relief;
            if (tunnelBrick) {
                const row = Math.floor(y / 32);
                const shiftedX = (x + (row % 2) * 32) % size;
                const column = Math.floor(shiftedX / 64);
                const edge = Math.min(
                    shiftedX % 64,
                    63 - (shiftedX % 64),
                    y % 32,
                    31 - (y % 32),
                );
                const mortar = edge < 2;
                const variation = hash(column, row, 107) * 25;
                color = mortar
                    ? [79 + shade * 0.2, 68 + shade * 0.2, 57 + shade * 0.2]
                    : [
                          150 + variation + shade * 0.4,
                          77 + variation * 0.6 + shade * 0.3,
                          49 + variation * 0.3 + shade * 0.2,
                      ];
                surfaceRelief = mortar
                    ? 0.2
                    : 0.55 +
                      Math.min(1, (edge - 2) / 2) * 0.2 +
                      (fine - 0.5) * 0.08;
            }
            images[0].data.set([...color, 255], index);
            const bump = surfaceRelief * 255;
            images[1].data.set([bump, bump, bump, 255], index);
            const roughness = 220 + fine * 30;
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
    const result = { map: maps[0], bumpMap: maps[1], roughnessMap: maps[2] };
    surfaces.set(kind, result);
    return result;
}

export function alleyRandom(index, seed = 1) {
    return hash(index, seed, 193);
}
