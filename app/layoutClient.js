"use client";
import { useStore } from "@/hooks/useStore";
import DarkModeHandler from "@articles-media/articles-dev-box/DarkModeHandler";
import GlobalBody from '@articles-media/articles-dev-box/GlobalBody';
import HasNoMouseHandler from '@articles-media/articles-dev-box/HasNoMouseHandler';

export default function LayoutClient({

}) {

    return (
        <>
            <GlobalBody />
            <DarkModeHandler
                useStore={useStore}
            />
            <HasNoMouseHandler
                useStore={useStore}
            />
        </>
    );
}
