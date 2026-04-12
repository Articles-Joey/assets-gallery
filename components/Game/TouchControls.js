import { useAssetGalleryStore } from '@/hooks/useAssetGalleryStore';

const JUMP_FORCE = 4;

export default function TouchControls({ touchControlsEnabled }) {
    return (
        <div className={`touch-controls-area ${!touchControlsEnabled && 'd-none'}`}>
            <button
                className="btn btn-dark"
                onTouchStart={(e) => {
                    e.preventDefault();
                    const { api, position } = useAssetGalleryStore.getState();
                    if (api) api.velocity.set(0, JUMP_FORCE, 0);
                }}
            >
                Jump
            </button>
        </div>
    );
}
