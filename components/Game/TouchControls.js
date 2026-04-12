import { useAssetGalleryStore } from '@/hooks/useAssetGalleryStore';

export default function TouchControls({ touchControlsEnabled }) {
    function doJump() {
        useAssetGalleryStore.getState().requestJump();
    }

    return (
        <div className={`touch-controls-area ${!touchControlsEnabled && 'd-none'}`}>
            <button
                className="btn btn-dark"
                onTouchStart={(e) => { e.preventDefault(); doJump(); }}
                onClick={doJump}
            >
                Jump
            </button>
        </div>
    );
}
