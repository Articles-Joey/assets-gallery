import { useAssetGalleryStore } from '@/hooks/useAssetGalleryStore';

const MIN_DISTANCE = 2;
const MAX_DISTANCE = 20;

export default function CameraZoomIndicator() {

    const cameraDistance = useAssetGalleryStore(state => state.cameraDistance);
    const isThirdPerson = useAssetGalleryStore(state => state.isThirdPerson);

    if (!isThirdPerson) return null;

    const zoomPercent = Math.round((1 - (cameraDistance - MIN_DISTANCE) / (MAX_DISTANCE - MIN_DISTANCE)) * 100);

    return (
        <>
            <style jsx>{`
                .camera-zoom-indicator {
                    position: absolute;
                    right: 16px;
                    top: 50%;
                    transform: translateY(-50%);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 4px;
                    z-index: 2;
                    pointer-events: none;
                }

                .camera-zoom-bar {
                    width: 6px;
                    height: 100px;
                    background-color: rgba(255, 255, 255, 0.2);
                    border-radius: 3px;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-end;
                }

                .camera-zoom-fill {
                    width: 100%;
                    background-color: rgba(255, 255, 255, 0.8);
                    border-radius: 3px;
                    transition: height 0.1s ease-out;
                }

                .camera-zoom-label {
                    color: rgba(255, 255, 255, 0.8);
                    font-size: 0.65rem;
                    font-weight: 600;
                }
            `}</style>
            <div className="camera-zoom-indicator">
                <div className="camera-zoom-bar">
                    <div
                        className="camera-zoom-fill"
                        style={{ height: `${zoomPercent}%` }}
                    />
                </div>
                <span className="camera-zoom-label">{zoomPercent}%</span>
            </div>
        </>
    );
}
