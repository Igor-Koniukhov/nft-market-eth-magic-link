
import { CryptoHookFactory, NETWORKS } from "@_types/hooks";
import useSWR from "swr";
import {useSelector} from "react-redux";
import {selectNetworkId} from "../../../store/slices/networkSlice";



type UseNetworkResponse = {
    isLoading: boolean;
    isSupported: boolean;
    targetNetwork: string;
    isConnectedToNetwork: boolean;
}

type NetworkHookFactory = CryptoHookFactory<string, UseNetworkResponse>

export type UseNetworkHook = ReturnType<NetworkHookFactory>

export const hookFactory: NetworkHookFactory = ({provider, isLoading}) => () => {
    const {data, isValidating, ...swr} = useSWR(
        provider ? "web3/useNetwork" : null,
        async () => {
            const chainId = (await provider!.getNetwork()).chainId;
            if (!chainId) {
                throw "Cannot retreive network. Please, refresh browser or connect to other one."
            }

            return NETWORKS[chainId];
        }, {
            revalidateOnFocus: false
        }
    )
    //const targetId = process.env.NEXT_PUBLIC_TARGET_CHAIN_ID as string;
    const targetId = useSelector(selectNetworkId) as string;
    const targetNetwork = NETWORKS[targetId];

    console.log(data, " data ")

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
    };
}