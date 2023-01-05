import {setupHooks, Web3Hooks} from "@hooks/web3/setupHooks";
import {Web3Dependencies} from "@_types/hooks";
import {Contract, ethers, providers} from "ethers";
import {Magic} from "magic-sdk";
import {ConnectExtension} from "@magic-ext/connect";


declare global {
    interface Window {
        ethereum: providers.Web3Provider;

    }
}

type Nullable<T> = {
    [P in keyof T]: T[P] | null;
}

export type Web3State = {
    isLoading: boolean; // true while loading web3State
    hooks: Web3Hooks;
} & Nullable<Web3Dependencies>

export type NetworkState = {
    isNetwork: boolean;
    networkName: string;
    networkId: string;
}

export const createDefaultState = () => {
    return {
        ethereum: null,
        provider: null,
        contract: null,
        isLoading: true,
        magic: null,
        hooks: setupHooks({isLoading: true} as any)
    }
}

export const createWeb3State = (
    {
        ethereum,
        provider,
        contract,
        isLoading,
        magic
    }: Web3Dependencies) => {
    return {
        ethereum,
        provider,
        contract,
        isLoading,
        magic,
        hooks: setupHooks(
            {
                ethereum,
                provider,
                contract,
                isLoading,
                magic
            }
        )
    }
}

const NETWORK_ID = process.env.NEXT_PUBLIC_NETWORK_ID;

export const loadContract = async (
    name: string,  // NftMarket
    provider: providers.Web3Provider,
    net_id: string
): Promise<Contract> => {
    if (!net_id) {
        return Promise.reject("Network ID is not defined!");
    }

    const res = await fetch(`/contracts/${name}.json`);
    const Artifact = await res.json();

    if (Artifact.networks[net_id].address) {
        const contract = new ethers.Contract(
            Artifact.networks[net_id].address,
            Artifact.abi,
            provider
        )
        return contract;
    } else {
        return Promise.reject(`Contract: [${name}] cannot be loaded!`);
    }
}

export const OptimismNodeOptions = {
    rpcUrl: "https://goerli.optimism.io",
    chainId: 420
};
export const PolygonNodeOptions = {
    rpcUrl: 'https://rpc-mumbai.maticvigil.com/', // Polygon RPC URL
    chainId: 80001, // Polygon chain id
}


export const GoerliOptionNode = {
    rpcUrl: "https://rpc.ankr.com/eth_goerli",
    chainId: 5
};

export const GoerliNodeOptions = 'eth'


export const magicConnectProvider = async (apiKey: string, net: any): Promise<{ magic: any, provider: providers.Web3Provider }> => {

    const magic = new Magic(apiKey, {
        network: net,
        locale: "en_US",
        extensions: [new ConnectExtension()]
    });

    const provider = new ethers.providers.Web3Provider(magic.rpcProvider as any);

    return {magic, provider};
}