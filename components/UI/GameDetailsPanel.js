"use client";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import { useSocketStore } from "@/hooks/useSocketStore";
import { useGameStore } from "@/hooks/useGameStore";
import { radToDeg } from "three/src/math/MathUtils.js";
import { SceneButtons } from "@/app/(landing)";

export default function GameDetailsPanel() {
    const players = useGameStore((state) => state.gameState.players);
    const socket = useSocketStore((state) => state.socket);

    return (
        <Card sx={{ bgcolor: "game.card", backgroundImage: "none", border: 1, borderColor: "divider" }}>
            <CardContent>

                <Box
                    sx={{
                        width: "100%",
                        fontSize: "1rem",
                        mb: 2,
                    }}
                >
                    <Box>Scene</Box>
                    <SceneButtons />
                </Box>

                <Box sx={{ width: "100%", fontSize: "1rem" }}>
                    <Box>People Connected: {players?.length || 0}</Box>
                    <Box sx={{ fontSize: "0.875em" }}>{socket?.id ? `(You: ${socket.id})` : ""}</Box>
                </Box>
                {players?.length > 0 && (
                    <Box sx={{ mt: 1, maxHeight: 300, overflowY: "auto" }}>
                        {players.map((player) => (
                            <Box key={player.id} sx={{ border: 1, borderColor: "divider", p: 1 }}>
                                <Box sx={{ fontSize: "0.6rem" }}>ID: {player.id}</Box>
                                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>{player.nickname || "?"}</Box>
                                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                    <Box sx={{ display: "flex" }}>
                                        {["x", "y", "z"].map((axis) => (
                                            <Chip key={axis} size="small" label={player?.[axis]?.toFixed(2) || 0} sx={{ bgcolor: "#000", color: "#fff", height: 20, fontSize: "0.75rem" }} />
                                        ))}
                                    </Box>
                                    <Chip size="small" label={radToDeg(player?.rotation?.[1] || 0).toFixed(0)} sx={{ bgcolor: "#000", color: "#fff", height: 20, fontSize: "0.75rem" }} />
                                </Box>
                            </Box>
                        ))}
                    </Box>
                )}
            </CardContent>
        </Card>
    );
}
