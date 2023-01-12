import { providers} from "ethers";
import {SWRResponse} from "swr";
import {NftMarketContract} from "@_types/nftMarketContract";

export type Web3Dependencies = {
    provider: providers.Web3Provider;
    contract: NftMarketContract;
    isLoading: boolean;
}
export const NETWORKS: {[k: string]: string} = {
    5: "Goerli Test Network",
    420: "Optimism Goerli",
    80001: "Polygon",
}


export type CryptoHookFactory<D=any, R= any, P=any> = {
    (d: Partial<Web3Dependencies>): CryptoHandlerHook<D, R, P>
}

export type CryptoHandlerHook<D=any, R=any, P=any> = (params?: P) => CryptoSWRResponse<D, R>
export type CryptoSWRResponse<D=any, R=any> = SWRResponse<D> & R;


/*export type CryptoHookFactory<D = any, P = any> = {
    (d: Partial<Web3Dependencies>): (params: P) => SWRResponse<D>
}*/
