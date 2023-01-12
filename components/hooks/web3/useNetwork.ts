
import { CryptoHookFactory, NETWORKS } from "@_types/hooks";
import useSWR from "swr";
import {useSelector} from "react-redux";
import {selectNetworkId} from "../../../store/slices/networkSlice";
import {useEffect} from "react";



type UseNetworkResponse = {
    isLoading: boolean;
    isSupported: boolean;
    targetNetwork: string;
    isConnectedToNetwork: boolean;
}

type NetworkHookFactory = CryptoHookFactory<string, UseNetworkResponse>

export type UseNetworkHook = ReturnType<NetworkHookFactory>

export const hookFactory: NetworkHookFactory = ({provider, isLoading}) => () => {
    const {data, mutate, isValidating, ...swr} = useSWR(
        provider ? "web3/useNetwork" : null,
        async () => {
            const chainId = (await provider!.getNetwork()).chainId;
            if (!chainId) {
                throw "Cannot retreive network."
            }

            return NETWORKS[chainId];
        }, {
            revalidateOnFocus: false
        }
    )
    useEffect(() => {
        provider?.on("networksChanged", handleNetworksChanged);
        return () => {
            provider?.removeListener("networksChanged", handleNetworksChanged);
        }
    })

    const handleNetworksChanged = (network: string) => {
        if (network.length === 0) {
            console.error("Please, connect to Web3 wallet");
        } else if (network !== data) {
            mutate(network);
        }
    }

    const targetId = useSelector(selectNetworkId) as string;
    const targetNetwork = NETWORKS[targetId];

    //const isSupported = data===targetNetwork;
    const isSupported = true;

    return {
        ...swr,
        data,
        isValidating,
        targetNetwork,
        isSupported,
        isConnectedToNetwork: !isLoading && isSupported,
        isLoading: isLoading as boolean,
        mutate,
    };
}