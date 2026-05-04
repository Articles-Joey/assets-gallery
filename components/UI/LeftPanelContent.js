import { memo } from "react";

import { useStore } from "@/hooks/useStore";
import DebugCard from "./DebugCard";
import GameDetailsPanel from "./GameDetailsPanel";

import useFullscreen from '@articles-media/articles-dev-box/useFullscreen';
import GameMenuPrimaryButtonGroup from '@articles-media/articles-dev-box/GameMenuPrimaryButtonGroup';

function LeftPanelContent(props) {

    const { isFullscreen, requestFullscreen, exitFullscreen } = useFullscreen();

    const reloadScene = useStore((state) => state.reloadScene)
    const debug = useStore((state) => state.debug)

    return (
        <div className='w-100'>

            <div className="card card-articles card-sm">

                <div className="card-body d-flex flex-wrap">

                    <GameMenuPrimaryButtonGroup 
                        useStore={useStore}
                        type="GameMenu"
                    />

                </div>

            </div>

            <GameDetailsPanel />

            {/* Debug Controls */}
            {debug && <DebugCard
                reloadScene={reloadScene}
            />}

        </div>
    )

}

export default memo(LeftPanelContent)