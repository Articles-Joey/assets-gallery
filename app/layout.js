import { Suspense } from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import AppThemeProvider from "@/components/AppThemeProvider";
import SocketLogicHandler from "@/components/SocketLogicHandler";
import AudioManager from "@/components/Game/AudioManager";
import LayoutClient from "./layoutClient";

import "@articles-media/articles-gamepad-helper/dist/articles-gamepad-helper.css";

export const metadata = {
    title: "Assets Gallery",
    description:
        "View assets submitted via the Articles Media Community Assets page in a 3D world.",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <AppRouterCacheProvider options={{ enableCssLayer: true }}>
                    <AppThemeProvider>
                        <LayoutClient />
                        <Suspense>
                            <SocketLogicHandler />
                            <AudioManager />
                        </Suspense>
                        {children}
                    </AppThemeProvider>
                </AppRouterCacheProvider>
            </body>
        </html>
    );
}
