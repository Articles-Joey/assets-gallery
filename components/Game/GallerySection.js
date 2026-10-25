import { memo, useEffect, useMemo } from "react";
import { useTexture } from "@react-three/drei";
import getAssetSource from "@articles-media/articles-dev-box/getAssetSource";
import {
    DoubleSide,
    NearestFilter,
    RepeatWrapping,
    SRGBColorSpace,
} from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import {
    MUSEUM_LAYOUT,
    section_spacing as defaultSectionSpacing,
} from "./sceneLayout";
import {
    createMuseumBrickGeometry,
    getMuseumBrickMaps,
} from "./museumMaterials";
import MuseumRoof from "./MuseumRoof";
import MuseumArtLight from "./MuseumArtLight";
import MuseumTrim from "./MuseumTrim";

const {
    width: ROOM_WIDTH,
    floorY: FLOOR_Y,
    ceilingY: CEILING_Y,
} = MUSEUM_LAYOUT;
const WALL_HEIGHT = CEILING_Y - FLOOR_Y;

function BrickWalls({ solidDepth, sectionZ }) {
    const geometry = useMemo(() => {
        const parts = [-1, 1].map((side) => {
            const position = [
                side * (ROOM_WIDTH / 2 + MUSEUM_LAYOUT.wallOffset),
                (FLOOR_Y + CEILING_Y) / 2,
                0,
            ];
            const part = createMuseumBrickGeometry(
                [MUSEUM_LAYOUT.wallThickness, WALL_HEIGHT, solidDepth],
                position,
                sectionZ,
            );
            part.translate(...position);
            return part;
        });
        const result = mergeGeometries(parts, false);
        parts.forEach((part) => part.dispose());
        return result;
    }, [solidDepth, sectionZ]);
    const maps = useMemo(() => getMuseumBrickMaps(), []);
    useEffect(() => () => geometry.dispose(), [geometry]);
    return (
        <mesh
            geometry={geometry}
            castShadow
            receiveShadow
        >
            <meshStandardMaterial
                {...maps}
                color="#ffffff"
                roughness={1}
                bumpScale={0.018}
            />
        </mesh>
    );
}

function Glass({ position, size }) {
    return (
        <mesh
            position={position}
            rotation={[0, Math.PI / 2, 0]}
        >
            <planeGeometry args={size} />
            <meshStandardMaterial
                color="#8dd4da"
                transparent
                opacity={0.25}
                roughness={0.2}
                side={DoubleSide}
                depthWrite={false}
            />
        </mesh>
    );
}

function GallerySection({
    section_i = 0,
    section_spacing = defaultSectionSpacing,
    isLast = false,
    ...props
}) {
    const solidDepth = (section_spacing * 2) / 3;
    const glassDepth = (section_spacing - solidDepth) / 2;
    const glassCenter = section_spacing / 2 - glassDepth / 2;
    const wallCenterY = (FLOOR_Y + CEILING_Y) / 2;
    const sourceTexture = useTexture(getAssetSource("textures/plazz_tile.png"));
    const floorTexture = useMemo(() => {
        const texture = sourceTexture.clone();
        texture.magFilter = NearestFilter;
        texture.wrapS = texture.wrapT = RepeatWrapping;
        texture.colorSpace = SRGBColorSpace;
        const repeatsAlongZ = (5 * section_spacing) / 3;
        texture.repeat.set(15, repeatsAlongZ);
        texture.offset.y = section_i * repeatsAlongZ;
        texture.needsUpdate = true;
        return texture;
    }, [sourceTexture, section_spacing, section_i]);
    useEffect(() => () => floorTexture.dispose(), [floorTexture]);

    return (
        <group
            {...props}
            name="museum-section"
        >
            <MuseumTrim
                section_spacing={section_spacing}
                isLast={isLast}
            />
            <BrickWalls
                solidDepth={solidDepth}
                sectionZ={-section_i * section_spacing}
            />
            {[-1, 1].map((side) =>
                [-1, 1].map((end) => (
                    <Glass
                        key={`${side}-${end}`}
                        position={[
                            (side * ROOM_WIDTH) / 2,
                            wallCenterY,
                            end * glassCenter,
                        ]}
                        size={[glassDepth, WALL_HEIGHT]}
                    />
                )),
            )}
            <MuseumRoof
                section_spacing={section_spacing}
                section_i={section_i}
                isLast={isLast}
            />
            <MuseumArtLight
                section_i={section_i}
                section_spacing={section_spacing}
            />
            <mesh
                rotation={[-Math.PI / 2, 0, 0]}
                position={[0, FLOOR_Y, 0]}
                receiveShadow
            >
                <planeGeometry args={[ROOM_WIDTH, section_spacing]} />
                <meshStandardMaterial
                    map={floorTexture}
                    roughness={0.8}
                />
            </mesh>
        </group>
    );
}

export default memo(GallerySection);
