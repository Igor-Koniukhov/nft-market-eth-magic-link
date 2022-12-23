import { ethers, providers} from "ethers";
import Web3 from "web3";
import {SWRResponse} from "swr";
import {NftMarketContract} from "@_types/nftMarketContract";

export type Web3Dependencies = {
    provider: providers.Web3Provider;
    contract: NftMarketContract;
    ethereum: providers.Web3Provider;
    isLoading: boolean;
    magic: any;
}
export const NETWORKS: {[k: string]: string} = {
    1: "Ethereum Main Network",
    5: "Goerli Test Network",
    56: "Binance Smart Chain",
    420: "Optimism Goerli",
    137: "Polygon",
    1337: "Ganache",
}




export type CryptoHookFactory<D=any, R= any, P=any> = {
    (d: Partial<Web3Dependencies>): CryptoHandlerHook<D, R, P>
}

export type CryptoHandlerHook<D=any, R=any, P=any> = (params?: P) => CryptoSWRResponse<D, R>
export type CryptoSWRResponse<D=any, R=any> = SWRResponse<D> & R;


/*export type CryptoHookFactory<D = any, P = any> = {
    (d: Partial<Web3Dependencies>): (params: P) => SWRResponse<D>
}*/
