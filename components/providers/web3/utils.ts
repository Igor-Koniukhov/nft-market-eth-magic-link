import {setupHooks, Web3Hooks} from "@hooks/web3/setupHooks";
import {MetaMaskInpageProvider} from "@metamask/providers";
import {Web3Dependencies} from "@_types/hooks";
import {Contract, ethers, providers} from "ethers";
import {Magic, CustomNodeConfiguration} from "magic-sdk";
import {ConnectExtension} from "@magic-ext/connect";
import Web3 from "web3";


declare global {
    interface Window {
        ethereum: Magic["rpcProvider"];
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
        contract: null,
        isLoading: true,
        magic: null,
        magicProvider: null,
        hooks: setupHooks({isLoading: true} as any)
    }
}

export const createWeb3State = (
    {
        ethereum,
        provider,
        contract,
        isLoading,
        magic,
        magicProvider,
    }: Web3Dependencies) => {
    return {
        ethereum,
        provider,
        contract,
        isLoading,
        magic,
        magicProvider,
        hooks: setupHooks(
            {
                ethereum,
                provider,
                contract,
                isLoading,
                magic,
                magicProvider,
            }
        )
    }
}

const NETWORK_ID = process.env.NEXT_PUBLIC_NETWORK_ID;

export const loadContract = async (
    name: string,  // NftMarket
    provider: ethers.providers.Web3Provider
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

const customNodeOptions = {
    rpcUrl: "https://goerli.optimism.io",
    chainId: 420
};
export const magicConnectProvider = async () : Promise<{magic: any, magicProvider: Web3}> =>{
    const magic = new Magic("pk_live_8EBC0E6F41C015D8", {
        network: 'goerli',
        locale: "en_US",
        extensions: [new ConnectExtension()]
    } );

  const magicProvider = new Web3(magic.rpcProvider as any);

  return {magic, magicProvider};
}