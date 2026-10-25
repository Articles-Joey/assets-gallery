import { CORRIDOR_WIDTH_SCALE, MUSEUM_LAYOUT } from "./sceneLayout";

// All roof dimensions are in world units, preserving the pitch when the room widens.
export function getMuseumRoofLayout(spacing) {
    const angle = (MUSEUM_LAYOUT.roofPitch * Math.PI) / 180;
    const halfWidth = (MUSEUM_LAYOUT.width * CORRIDOR_WIDTH_SCALE) / 2;
    const outerHalfWidth = halfWidth + MUSEUM_LAYOUT.roofOverhang;
    const ridgeY = MUSEUM_LAYOUT.ceilingY + halfWidth * Math.tan(angle);
    const outerEaveY =
        MUSEUM_LAYOUT.ceilingY - MUSEUM_LAYOUT.roofOverhang * Math.tan(angle);
    const thickness = MUSEUM_LAYOUT.roofThickness;
    const skylightX = halfWidth * 0.52;

    return {
        angle,
        outerHalfWidth,
        ridgeY,
        outerEaveY,
        thickness,
        slopeLength: outerHalfWidth / Math.cos(angle),
        slopeCenterY: (ridgeY + outerEaveY + thickness) / 2,
        skylightX,
        skylightY: ridgeY - skylightX * Math.tan(angle) + thickness / 2,
        skylightWidth: Math.min(1.8, halfWidth * 0.35),
        skylightDepth: Math.min(1.6, spacing * 0.45),
    };
}
