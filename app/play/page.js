import { Suspense } from "react"
import { cacheLife } from "next/cache"
import GamePage from "./play"
// import metadataAppend from "util/metadataAppend"

export const metadata = {
    title: `Assets Gallery`,
}

async function fetchAssets() {
    "use cache"
    cacheLife({
        stale: 0,          // never serve stale content
        revalidate: 3600,  // revalidate every hour
        expire: 3600,      // expire after 1 hour
    })

    const devUrl = "http://localhost:3001/api/community/assets";
    const prodUrl = "https://articles.media/api/community/assets";

    const isDev = process.env.NODE_ENV === "development";

    const headers = {
        ...(process.env.CLOUDFLARE_BACKDOOR_SECRET && {
            "cloudflare-backdoor": process.env.CLOUDFLARE_BACKDOOR_SECRET,
        }),
    };

    let res;
    let devFailed = false;
    if (isDev) {
        try {
            res = await fetch(devUrl, { headers });
        } catch {
            res = null;
        }
        if (!res?.ok) {
            devFailed = true;
            res = await fetch(prodUrl, { headers });
        }
    } else {
        res = await fetch(prodUrl, { headers });
    }
    if (!res.ok) {
        console.error("Failed to fetch assets", res.status, res.statusText);
        throw new Error("Failed to fetch assets");
    }
    const data = await res.json();
    return { data, fetchedAt: Date.now(), devFailed };
}

export default async function Page() {

    const { data: assets, fetchedAt: lastAssetUpdate, devFailed } = await fetchAssets();

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <GamePage
                assets={assets}
                lastAssetUpdate={lastAssetUpdate}
                devFailed={devFailed}
            />
        </Suspense>
    )
}