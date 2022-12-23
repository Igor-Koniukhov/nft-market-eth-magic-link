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


export const createDefaultState = () => {
    return {
        ethereum: null,
        provider: null,
        providerOptimism: null,
        providerPolygon: null,
        contract: null,
        contractOptimism: null,
        contractPolygon: null,
        isLoading: true,
        magic: null,
        magicPolygon: null,
        magicOptimism: null,
        hooks: setupHooks({isLoading: true} as any)
    }
}

export const createWeb3State = (
    {
        ethereum,
        provider,
        providerOptimism,
        providerPolygon,
        contract,
        contractOptimism,
        contractPolygon,
        isLoading,
        magic,
        magicOptimism,
        magicPolygon,
    }: Web3Dependencies) => {
    return {
        ethereum,
        provider,
        providerOptimism,
        providerPolygon,
        contract,
        contractOptimism,
        contractPolygon,
        isLoading,
        magic,
        magicOptimism,
        magicPolygon,
        hooks: setupHooks(
            {
                ethereum,
                provider,
                providerOptimism,
                providerPolygon,
                contract,
                contractOptimism,
                contractPolygon,
                isLoading,
                magic,
                magicOptimism,
                magicPolygon,
            }
        )
    }
}

const NETWORK_ID = process.env.NEXT_PUBLIC_NETWORK_ID;

export const loadContract = async (
    name: string,  // NftMarket
    provider: providers.Web3Provider
): Promise<Contract> => {
    if (!NETWORK_ID) {
        return Promise.reject("Network ID is not defined!");
    }

    const res = await fetch(`/contracts/${name}.json`);
    const Artifact = await res.json();

    if (Artifact.networks[NETWORK_ID].address) {
        const contract = new ethers.Contract(
            Artifact.networks[NETWORK_ID].address,
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
    rpcUrl: 'https://polygon-rpc.com/',
    chainId: 137,
}
export const GoerliNodeOptions = 'goerli'


export const magicConnectProvider = async (net: any) : Promise<{magic: any, provider: providers.Web3Provider}> =>{

    const magic = new Magic("pk_live_DE9DCFDD500A3F8D", {
        network: net,
        locale: "en_US",
        extensions: [new ConnectExtension()]
    } );

    const provider = new ethers.providers.Web3Provider(magic.rpcProvider as any);
    console.log(provider)

    return {magic, provider};

}