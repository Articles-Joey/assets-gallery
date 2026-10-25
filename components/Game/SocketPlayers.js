import { useGameStore } from "@/hooks/useGameStore";
import { useSocketStore } from "@/hooks/useSocketStore";
import { useSearchParams } from "next/navigation";

import SpacesuitModel from "@/components/Models/Spacesuit";
import Nickname from "./Nickname";

export default function SocketPlayers() {
    const players = useGameStore((state) => state.gameState.players);
    const socket = useSocketStore((state) => state.socket);

    const searchParams = useSearchParams();
    const { server } = Object.fromEntries(searchParams.entries());

    return (
        <group>
            {players?.length > 0 &&
                players?.map((player, index) => {
                    if (socket?.id === player.id) {
                        return null; // Skip rendering the current player's model
                    }

                    return (
                        <group
                            key={player.id}
                            position={[
                                player?.x || 0,
                                (player?.y || 0) - 1,
                                player?.z || 0,
                            ]}
                        >
                            <SpacesuitModel
                                scale={0.5}
                                action={player?.action || "Idle"}
                                rotation={[0, player?.rotation?.[1] || 0, 0]}
                            />

                            <Nickname>{player.nickname}</Nickname>
                        </group>
                    );
                })}
        </group>
    );
}
