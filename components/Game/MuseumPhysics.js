import { useBox } from "@react-three/cannon";
import { useStore } from "@/hooks/useStore";
import { useAssetGalleryStore } from "@/hooks/useAssetGalleryStore";
import {
    CORRIDOR_WIDTH_SCALE,
    MUSEUM_LAYOUT,
    section_spacing,
} from "./sceneLayout";
import { getMuseumRoofLayout } from "./museumRoofLayout";
import MuseumEndWalls from "./MuseumEndWalls";
import MuseumBenchColliders from "./MuseumBenchColliders";
import MuseumExteriorSidewalks from "./MuseumExteriorSidewalks";

function StaticBounds({ position, size, rotation = [0, 0, 0] }) {
    // Cannon uses world coordinates, so these bodies stay outside visual groups.
    useBox(
        () => ({ type: "Static", position, rotation, args: size }),
        undefined,
        [...position, ...size, ...rotation],
    );
    return null;
}

export default function MuseumPhysics() {
    const theme = useAssetGalleryStore((state) => state.galleryTheme);
    const count = useStore((state) => state.assets?.length ?? 0);
    if (theme !== "Museum" || count === 0) return null;

    const {
        width,
        floorY,
        ceilingY,
        wallThickness,
        wallOffset,
        originX,
        originY,
    } = MUSEUM_LAYOUT;
    const length = count * section_spacing;
    const centerZ = (-(count - 1) * section_spacing) / 2;
    const worldWidth = width * CORRIDOR_WIDTH_SCALE;
    const wallHeight = ceilingY - floorY;
    const wallCenterY = originY + (floorY + ceilingY) / 2;
    const wallX = (width / 2 + wallOffset) * CORRIDOR_WIDTH_SCALE;
    const roof = getMuseumRoofLayout(section_spacing);

    return (
        <>
            <MuseumEndWalls
                count={count}
                section_spacing={section_spacing}
            />
            <MuseumBenchColliders
                count={count}
                section_spacing={section_spacing}
            />
            <MuseumExteriorSidewalks
                count={count}
                section_spacing={section_spacing}
            />
            {/* Continuous bounds also cover the glass between solid panels. */}
            {[-1, 1].map((side) => (
                <StaticBounds
                    key={side}
                    position={[originX + side * wallX, wallCenterY, centerZ]}
                    size={[
                        wallThickness * CORRIDOR_WIDTH_SCALE,
                        wallHeight,
                        length,
                    ]}
                />
            ))}
            <StaticBounds
                position={[originX, originY + floorY - 0.05, centerZ]}
                size={[worldWidth, 0.1, length]}
            />
            {[-1, 1].map((side) => (
                <StaticBounds
                    key={`roof-${side}`}
                    position={[
                        originX + (side * roof.outerHalfWidth) / 2,
                        originY + roof.slopeCenterY,
                        centerZ,
                    ]}
                    rotation={[0, 0, -side * roof.angle]}
                    size={[
                        roof.slopeLength,
                        roof.thickness * Math.cos(roof.angle),
                        length,
                    ]}
                />
            ))}
        </>
    );
}
