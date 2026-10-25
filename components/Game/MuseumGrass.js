import { memo, useMemo } from "react";
import GrassArea from "./GrassArea";
import {
    CORRIDOR_WIDTH_SCALE,
    MUSEUM_LAYOUT,
    SCENE_HALF_SIZE,
    getMuseumExteriorSegments,
    getMuseumSiteBounds,
    section_spacing,
} from "./sceneLayout";

function MuseumGrass({ count }) {
    const layout = useMemo(() => {
        const site = getMuseumSiteBounds(count, section_spacing);
        const halfWidth =
            (MUSEUM_LAYOUT.width / 2 +
                MUSEUM_LAYOUT.wallOffset +
                MUSEUM_LAYOUT.wallThickness / 2) *
            CORRIDOR_WIDTH_SCALE;
        return {
            outer: {
                minX: -SCENE_HALF_SIZE,
                maxX: SCENE_HALF_SIZE,
                minZ: site.minZ,
                maxZ: site.maxZ,
            },
            building: {
                minX: MUSEUM_LAYOUT.originX - halfWidth,
                maxX: MUSEUM_LAYOUT.originX + halfWidth,
                minZ: site.rearEndZ - MUSEUM_LAYOUT.wallThickness / 2,
                maxZ: site.frontEndZ + MUSEUM_LAYOUT.wallThickness / 2,
            },
            pavement: getMuseumExteriorSegments(count, section_spacing).map(
                (segment) => ({
                    minX: segment.x - segment.width / 2,
                    maxX: segment.x + segment.width / 2,
                    minZ: segment.z - segment.depth / 2,
                    maxZ: segment.z + segment.depth / 2,
                }),
            ),
        };
    }, [count]);

    return (
        <GrassArea
            outerBounds={layout.outer}
            innerBounds={layout.building}
            exclusionBounds={layout.pavement}
            groundHeight={-1}
            count={32000}
            clearance={0.4}
        />
    );
}

export default memo(MuseumGrass);
