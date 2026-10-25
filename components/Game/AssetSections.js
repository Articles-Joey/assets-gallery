import { useEffect, useMemo, useState } from "react";
import { Image, Text } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { degToRad } from "three/src/math/MathUtils";
import { useStore } from "@/hooks/useStore";
import { useAssetGalleryStore } from "@/hooks/useAssetGalleryStore";
import Tree from "./Tree";
import GallerySection from "./GallerySection";
import MuseumTrees from "./MuseumTrees";
import TrailheadKiosk from "./TrailheadKiosk";
import AlleyImageFrame from "./AlleyImageFrame";
import {
    ALLEY_SIDE_OFFSET,
    CORRIDOR_WIDTH_SCALE,
    MUSEUM_LAYOUT,
    section_spacing,
} from "./sceneLayout";

function AssetSectionImageAsset({ asset_obj, ...props }) {
    const galleryTheme = useAssetGalleryStore((state) => state.galleryTheme);

    // const textColor = galleryTheme !== 'Museum' ? '#fff' : '#000'
    const textColor = useMemo(
        () => (galleryTheme !== "Museum" ? "#fff" : "#000"),
        [galleryTheme],
    );
    const Wrapper =
        galleryTheme === "Forest"
            ? TrailheadKiosk
            : galleryTheme === "Alley"
              ? AlleyImageFrame
              : "mesh";
    // const textColor = "#000"

    return (
        <group>
            <Wrapper {...props}>
                {galleryTheme !== "Forest" && galleryTheme !== "Alley" && (
                    <>
                        <boxGeometry
                            args={props.testArgs || [0.95, 0.75, 0.12]}
                        />
                        <meshStandardMaterial color={props.color || "#fff"} />
                    </>
                )}

                {asset_obj?.file?.thumbnail?.key && (
                    <Image
                        url={`${process.env.NEXT_PUBLIC_CDN}${asset_obj?.file?.thumbnail?.key}`}
                        position={[0, 0.11, 0.07]}
                        scale={[0.9, 0.9 * (9 / 16)]}
                        zoom={1}
                        toneMapped={false}
                        color={[1.15, 1.15, 1.15]}
                    />
                )}

                <group position={[0, 0.03, 0]}>
                    <Text
                        position={[0, -0.21, 0.07]}
                        fontSize={0.06}
                        color={textColor}
                        anchorX="center"
                        anchorY="middle"
                        maxWidth={0.85}
                    >
                        {asset_obj.name}
                    </Text>
                    <Text
                        position={[0, -0.29, 0.07]}
                        fontSize={0.04}
                        color={textColor}
                        anchorX="center"
                        anchorY="middle"
                        maxWidth={0.85}
                    >
                        {asset_obj.city}, {asset_obj.state}
                    </Text>
                    <Text
                        position={[0, -0.35, 0.07]}
                        fontSize={0.04}
                        color={textColor}
                        anchorX="center"
                        anchorY="middle"
                        maxWidth={0.85}
                    >
                        By @{asset_obj.populated_user.username}
                    </Text>
                </group>
            </Wrapper>
        </group>
    );
}

function AssetSectionModelAsset({ asset_obj }) {
    const [blobUrl, setBlobUrl] = useState(null);

    // Fetch modelUrl and convert it to Blob
    useEffect(() => {
        if (asset_obj?.glb_file) {
            fetch(asset_obj?.glb_file?.location)
                .then((response) => response.blob())
                .then((blob) => {
                    const url = URL.createObjectURL(blob);
                    setBlobUrl(url);
                })
                .catch((error) => {
                    console.error("Error fetching model:", error);
                });
        }
    }, [asset_obj?.glb_file]);

    const [gltf, setGltf] = useState(null);

    useEffect(() => {
        if (blobUrl) {
            const loader = new GLTFLoader();
            loader.load(
                blobUrl,
                (loadedGltf) => {
                    setGltf(loadedGltf);
                },
                undefined,
                (error) => {
                    console.error("Error loading GLTF model:", error);
                },
            );
        }
    }, [blobUrl]);

    return (
        <group position={[2.25 * CORRIDOR_WIDTH_SCALE, -0.8, 0]}>
            <mesh position={[0, 0, 0]}>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color={gltf ? "gray" : "red"} />
            </mesh>

            {gltf && (
                <group
                    position={[0, 0.55, 0]}
                    rotation={[0, degToRad(-90), 0]}
                >
                    <primitive
                        scale={0.1}
                        object={gltf.scene}
                    />
                </group>
            )}

            <Text
                rotation={[0, degToRad(-90), 0]}
                position={[-0.51, 0.38, 0]}
                scale={0.1}
                color="white"
            >
                {asset_obj.name}
            </Text>

            <Text
                rotation={[0, degToRad(-90), 0]}
                position={[-0.51, 0.28, 0]}
                scale={0.05}
                color="white"
            >
                @{asset_obj?.populated_user?.username}
            </Text>
        </group>
    );
}

function getForestTreeVariation(assetId, side, row, salt = "") {
    const seed = `${assetId}:${side}:${row}${salt}`;
    let hash = 2166136261;
    for (let i = 0; i < seed.length; i++) {
        hash = Math.imul(hash ^ seed.charCodeAt(i), 16777619);
    }
    return (hash >>> 0) / 4294967295;
}

function getForestTreeScale(baseScale, assetId, side, row) {
    // Stable +/-10% variation avoids changing sizes on re-render or theme switch.
    return baseScale * (0.9 + getForestTreeVariation(assetId, side, row) * 0.2);
}

export default function AssetSections() {
    const assets = useStore((state) => state.assets);
    const galleryTheme = useAssetGalleryStore((state) => state.galleryTheme);

    return (
        <group name="asset-sections">
            {galleryTheme === "Museum" && (
                <MuseumTrees count={assets?.length ?? 0} />
            )}
            {assets?.map((asset_obj, i) => (
                <group
                    key={asset_obj._id}
                    position={[0, 0, section_spacing * -i]}
                >
                    {asset_obj.asset_type === "Image" && (
                        <AssetSectionImageAsset
                            asset_obj={asset_obj}
                            color={
                                galleryTheme === "Museum"
                                    ? "#ffffff"
                                    : "#000000"
                            }
                            scale={2}
                            position={[
                                galleryTheme === "Alley"
                                    ? 2.5 + ALLEY_SIDE_OFFSET
                                    : 2.5 * CORRIDOR_WIDTH_SCALE,
                                0.5,
                                0,
                            ]}
                            rotation={[0, -Math.PI / 2, 0]}
                        />
                    )}
                    {asset_obj.asset_type === "3D Model" && (
                        <AssetSectionModelAsset asset_obj={asset_obj} />
                    )}
                    {galleryTheme === "Forest" &&
                        [-1, 1].map((side) => (
                            <group key={side}>
                                <Tree
                                    scale={getForestTreeScale(0.2, asset_obj._id, side, 0)}
                                    rotation={[0, getForestTreeVariation(asset_obj._id, side, 0, ":rotation") * Math.PI * 2, 0]}
                                    position={[
                                        side * 4 * CORRIDOR_WIDTH_SCALE,
                                        -1,
                                        0,
                                    ]}
                                />
                                <Tree
                                    scale={getForestTreeScale(0.4, asset_obj._id, side, 1)}
                                    rotation={[0, getForestTreeVariation(asset_obj._id, side, 1, ":rotation") * Math.PI * 2, 0]}
                                    position={[
                                        side * 6 * CORRIDOR_WIDTH_SCALE,
                                        -1,
                                        0,
                                    ]}
                                />
                            </group>
                        ))}
                    {galleryTheme === "Museum" && (
                        <>
                            <GallerySection
                                scale={[CORRIDOR_WIDTH_SCALE, 1, 1]}
                                position={[
                                    MUSEUM_LAYOUT.originX,
                                    MUSEUM_LAYOUT.originY,
                                    0,
                                ]}
                                section_i={i}
                                section_spacing={section_spacing}
                                isLast={i === assets.length - 1}
                            />
                        </>
                    )}
                </group>
            ))}
        </group>
    );
}
