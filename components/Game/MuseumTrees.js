import { memo, useLayoutEffect, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { Object3D } from "three";
import { getTreeResources } from "./treeResources";
import {
    CORRIDOR_WIDTH_SCALE,
    MUSEUM_LAYOUT,
    section_spacing,
} from "./sceneLayout";

function MuseumTrees({ count }) {
    const { nodes } = useGLTF("/models/Tree-transformed.glb");
    const resources = getTreeResources(nodes["tree-spruce"].geometry);
    const trunks = useRef();
    const foliage = useRef();
    useLayoutEffect(() => {
        if (!trunks.current || !foliage.current) return;
        const dummy = new Object3D();
        const wallEdge =
            (MUSEUM_LAYOUT.width / 2 +
                MUSEUM_LAYOUT.wallOffset +
                MUSEUM_LAYOUT.wallThickness / 2) *
            CORRIDOR_WIDTH_SCALE;
        let instance = 0;
        for (let section = 0; section < count; section++) {
            for (const side of [-1, 1]) {
                for (let row = 0; row < 2; row++) {
                    dummy.position.set(
                        MUSEUM_LAYOUT.originX +
                            side * (wallEdge + (row ? 4.5 : 2.25)),
                        -1,
                        -section * section_spacing -
                            (row ? section_spacing / 2 : 0),
                    );
                    dummy.scale.setScalar(
                        row
                            ? 0.42 + (section % 2) * 0.03
                            : 0.32 + (section % 3) * 0.02,
                    );
                    dummy.rotation.set(
                        0,
                        row ? section * 1.7 - side : section * 2.4 + side,
                        0,
                    );
                    dummy.updateMatrix();
                    trunks.current.setMatrixAt(instance, dummy.matrix);
                    foliage.current.setMatrixAt(instance++, dummy.matrix);
                }
            }
        }
        for (const mesh of [trunks.current, foliage.current]) {
            mesh.instanceMatrix.needsUpdate = true;
            mesh.computeBoundingSphere();
        }
    }, [count]);
    if (count === 0) return null;

    return (
        <group
            name="instanced-museum-tree-rows"
            dispose={null}
        >
            <instancedMesh
                ref={trunks}
                args={[resources.trunk, resources.barkMaterial, count * 4]}
                castShadow
                receiveShadow
            />
            <instancedMesh
                ref={foliage}
                args={[resources.foliage, resources.foliageMaterial, count * 4]}
                castShadow
                receiveShadow
            />
        </group>
    );
}

export default memo(MuseumTrees);
