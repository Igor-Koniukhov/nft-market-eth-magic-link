import useSWR from "swr"

const URL = "https://api.coingecko.com/api/v3/coins/ethereum?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=false"


const fetcherMarketData = async url => {
    const res = await fetch(url)
    const json = await res.json()
    return json ?? null
}

export const useMarketData = () => {
    const {data, ...rest} = useSWR(
        URL,
        fetcherMarketData,
        {refreshInterval: 10000}
    )

    return {
        ath: {
            data,
            ...
                rest
        }
    }
}


