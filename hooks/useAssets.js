import useSWR from "swr";

import axios from "axios";

const fetcher = (url) => axios.get(url).then((res) => res.data);

const useAssets = (params) => {

    const { data, error, isLoading, mutate } = useSWR(
        process.env.NODE_ENV === "development" ?
        "http://localhost:3001/api/community/assets"
        :
        "https://articles.media/api/community/assets",
        fetcher,
        {
            dedupingInterval: ((1000 * 60) * 5),
            ...(params?.preload && {fallbackData: params.preload})
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