import useSWR from "swr";
import { useState } from "react";

import { useAssetGalleryStore } from "./useAssetGalleryStore";

const fetcher = (url) => fetch(url).then((res) => {
    if (!res.ok) throw new Error(res.statusText);
    return res.json();
});

const useAssets = (params) => {

    // const [useFallback, setUseFallback] = useState(false);
    const useFallback = useAssetGalleryStore((state) => state.useFallback);
    const setUseFallback = useAssetGalleryStore((state) => state.setUseFallback);

    const isDev = process.env.NODE_ENV === "development";
    const devUrl = "http://localhost:3001/api/community/assets";
    const prodUrl = "https://articles.media/api/community/assets";

    const url = isDev && !useFallback ? devUrl : prodUrl;

    const { data, error, isLoading, mutate } = useSWR(
        url,
        fetcher,
        {
            dedupingInterval: ((1000 * 60) * 5),
            ...(params?.preload && {fallbackData: params.preload}),
            onError: () => {
                if (isDev && !useFallback) {
                    setUseFallback(true);
                }
            }
        }
    );

    return {
        data,
        error,
        isLoading,
        mutate,
    };
};

export default useAssets;