import {CryptoHookFactory, NETWORKS} from "@_types/hooks"
import useSWR from "swr"
import {useSelector} from "react-redux"
import {selectNetworkId} from "../../../store/slices/networkSlice"
import {useEffect} from "react"
import {quantityNetworks} from "@providers/web3/utils";


type UseNetworkResponse = {
    isLoading: boolean
    isSupported: boolean
    targetNetwork: string
    isConnectedToNetwork: boolean
}

type NetworkHookFactory = CryptoHookFactory<Map<string, string>, UseNetworkResponse>

export type UseNetworkHook = ReturnType<NetworkHookFactory>

export const hookFactory: NetworkHookFactory = ({providers, isLoading}) => () => {
    const {data, mutate, isValidating, ...swr} = useSWR(
        providers ? "web3/useNetwork" : {} as Map<string, string>,
        async () => {
            const networksMap = new Map<string, string>()
            if(providers.size===quantityNetworks){
                providers.forEach((provider, chainId)=>{
                    if (!chainId) {
                        throw "Cannot retreive network."
                    }
                    networksMap.set(chainId, NETWORKS[chainId])
                })
            }

            return networksMap
        }, {
            revalidateOnFocus: false
        }
    )

    const targetId = useSelector(selectNetworkId) as string
    const targetNetwork = NETWORKS[targetId]
    let isSupported = true
    /*if(providers.size===quantityNetworks){
         isSupported = data.get(targetId)===targetNetwork
    }*/


    return {
        ...swr,
        data,
        isValidating,
        targetNetwork,
        isSupported,
        isConnectedToNetwork: !isLoading && isSupported,
        isLoading: isLoading as boolean,
        mutate,
    }
}