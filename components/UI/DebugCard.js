// import { useGameStore } from "@/hooks/useGameStore"
import { useGameStore } from "@/hooks/useGameStore";
import ArticlesButton from "./Button"
import { useStore } from "@/hooks/useStore";
import { useAssetGalleryStore } from "@/hooks/useAssetGalleryStore";

export default function DebugCard({
    reloadScene
}) {

    const position = useAssetGalleryStore((state) => state.position);
    // const score = useGameStore((state) => state.score);
    // const setPlayerLocation = useAssetGalleryStore(state => state.setPlayerLocation)
    // const playerLocation = useAssetGalleryStore((state) => state.playerLocation);
    // const playerLocation = useGameStore((state) => state.playerLocation);

    const lastAssetUpdate = useStore((state) => state.lastAssetUpdate);

    return (
        <div
            className="card card-articles card-sm"
        >
            <div className="card-body">

                <div className="mb-2">
                    <div className="small text-muted">Debug Related</div>
    
                    {lastAssetUpdate &&
                        <small className='mb-3'>
                            Last update: {new Date(lastAssetUpdate).toLocaleTimeString()}
                        </small>
                    }
                </div>

                <div className="small border p-2">
                    <div>
                        <span>Position: </span>
                        <span>
                            {position[0]?.toFixed(2)}
                            <span> - </span>
                            {position[1]?.toFixed(2)}
                            <span> - </span>
                            {position[2]?.toFixed(2)}
                        </span>
                    </div>
                </div>

                <div className='d-flex flex-column'>

                    <div>
                        <ArticlesButton
                            size="sm"
                            className="w-50"
                            onClick={reloadScene}
                        >
                            <i className="fad fa-redo"></i>
                            Reload Game
                        </ArticlesButton>

                        <ArticlesButton
                            size="sm"
                            className="w-50"
                            onClick={reloadScene}
                        >
                            <i className="fad fa-redo"></i>
                            Reset Camera
                        </ArticlesButton>
                    </div>

                </div>

            </div>
        </div>
    )

}