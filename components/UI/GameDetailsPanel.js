
import ArticlesButton from "./Button"
import { useSearchParams } from "next/navigation"
import { useSocketStore } from "@/hooks/useSocketStore"
import { useGameStore } from "@/hooks/useGameStore"
import { radToDeg } from "three/src/math/MathUtils.js"
// import { useIceSlideStore } from "@/hooks/useIceSlideStore"

export default function GameDetailsPanel() {

    const players = useGameStore(state => state.gameState.players)
    const fallingItems = useGameStore(state => state.gameState.fallingItems)

    return (
        <div className="card game-details-panel">

            <div className="card-body">

                <div className="h6 mb-0 d-flex justify-content-between">
                    <RoundAndTimer />
                </div>

                {/* <div>Players</div> */}

                {players?.length > 0 &&
                    <div
                        className="mt-2"
                        style={{
                            maxHeight: '300px',
                            overflowY: 'auto'
                        }}
                    >
                        {players.map((player, index) => (
                            <div key={index} className="player-entry border p-2">

                                {/* <div className="player-color" style={{ backgroundColor: player.color }}></div> */}

                                <div className="" style={{ fontSize: "0.6rem" }}>ID: {player.id}</div>

                                <div className="player-name d-flex align-items-center mb-2">
                                    <span>{player.nickname || "?"} </span>
                                </div>

                                <div className="d-flex justify-content-between">

                                    <div className="d-flex">
                                        <div className="badge bg-black">{player?.x?.toFixed(2) || 0}</div>
                                        <div className="badge bg-black">{player?.y?.toFixed(2) || 0}</div>
                                        <div className="badge bg-black">{player?.z?.toFixed(2) || 0}</div>
                                    </div>

                                    <div className="d-flex">
                                        <div className="badge bg-black">
                                            {radToDeg(player?.rotation?.[1] || 0).toFixed(0)}
                                        </div>
                                    </div>

                                </div>

                            </div>
                        ))}
                    </div>
                }

            </div>

        </div>
    )
}

function RoundAndTimer() {

    const timer = useGameStore(state => state.gameState.timer)
    const status = useGameStore(state => state.gameState.status)

    const startGame = useSocketStore(state => state.startGame)
    const socket = useSocketStore(state => state.socket)

    const searchParams = useSearchParams()
    const params = Object.fromEntries(searchParams.entries());
    const { server } = params

    const players = useGameStore(state => state.gameState.players)

    return (
        <div className="w-100">

            <div className="d-flex flex-column align-items-start w-100 justify-content-between">
                <div>People Connected: {players?.length || 0}</div>
                <div className="small">{socket?.id ? `(You: ${socket.id})` : ""}</div>
                {/* <div>Status: {status || "N/A"}</div> */}
            </div>

            {/* <ArticlesButton
                small
                className="w-100 mt-1"
                disabled={status === "In Progress"}
                onClick={() => {
                    startGame(server, "In Progress")
                }}
            >
                Start Game
            </ArticlesButton> */}

        </div>
    )
}