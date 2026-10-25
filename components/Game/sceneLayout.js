// Distance between consecutive gallery items, shared by every scene.
export const section_spacing = 4;
export const SCENE_HALF_SIZE = 50;

export const CORRIDOR_WIDTH_SCALE = 1.2;
// Move complete alley sides together so walls, curbs and images stay aligned.
export const ALLEY_SIDE_OFFSET = 2.88 * (CORRIDOR_WIDTH_SCALE - 1);

export const MUSEUM_LAYOUT = {
    width: 10,
    floorY: -0.4,
    ceilingY: 2.35,
    wallThickness: 0.25,
    wallOffset: 0.1,
    originX: -2.5 * CORRIDOR_WIDTH_SCALE,
    originY: -0.599,
    roofPitch: 30,
    roofThickness: 0.16,
    roofOverhang: 0.24,
    doorWidth: 1.25,
    doorHeight: 2.15,
};

export function getMuseumSiteBounds(count, spacing = section_spacing) {
    const sections = Math.max(1, count);
    const frontEndZ = spacing / 2;
    const rearEndZ = -(sections - 1) * spacing - spacing / 2;
    return {
        minZ: Math.min(-SCENE_HALF_SIZE, rearEndZ - 10),
        maxZ: Math.max(SCENE_HALF_SIZE, frontEndZ + 10),
        frontEndZ,
        rearEndZ,
    };
}

export function getMuseumExteriorSegments(count, spacing = section_spacing) {
    const bounds = getMuseumSiteBounds(count, spacing);
    const landingWidth =
        (MUSEUM_LAYOUT.width +
            MUSEUM_LAYOUT.wallOffset * 2 +
            MUSEUM_LAYOUT.wallThickness) *
        CORRIDOR_WIDTH_SCALE;
    return [-1, 1].flatMap((end) => {
        const capZ = end === 1 ? bounds.frontEndZ : bounds.rearEndZ;
        const edgeZ = end === 1 ? bounds.maxZ : bounds.minZ;
        const available = end * (edgeZ - capZ);
        const landingDepth = Math.min(2.4, available);
        const result = [
            {
                x: MUSEUM_LAYOUT.originX,
                z: capZ + (end * (landingDepth - 0.025)) / 2,
                width: landingWidth,
                depth: landingDepth + 0.025,
            },
        ];
        const remaining = available - landingDepth;
        if (remaining > 0.01)
            result.push({
                x: MUSEUM_LAYOUT.originX,
                z: (capZ + end * landingDepth + edgeZ) / 2,
                width: 3,
                depth: remaining,
            });
        return result;
    });
}
