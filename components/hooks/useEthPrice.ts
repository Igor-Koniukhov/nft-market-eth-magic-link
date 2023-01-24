import useSWR from "swr"


export const URL = "https://api.coingecko.com/api/v3/coins/ethereum?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=false"
export const URLMatic="https://api.coingecko.com/api/v3/coins/matic-network?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=false"
export const URLOptimism="https://api.coingecko.com/api/v3/coins/optimism?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=false"
export const NETWORKS_COINS_PRICE: { [k: string]: string } = {
    420: URLOptimism,
    80001: URLMatic,
}

const fetcher = async url => {
    const res = await fetch(url)
    const json = await res.json()
    return json.market_data.current_price.usd ?? null
}

export const useEthPrice = (id: string) => {
    const {data, ...rest} = useSWR(
        NETWORKS_COINS_PRICE[id],
        fetcher,
        {refreshInterval: 50000}
    )
    return {eth: {data, ...rest}}
}


