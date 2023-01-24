import {setupHooks, Web3Hooks} from "@hooks/web3/setupHooks"
import {Web3Dependencies} from "@_types/hooks"
import {Contract, ethers, providers} from "ethers"
import {CustomNodeConfiguration, Magic} from "magic-sdk"
import {ConnectExtension} from "@magic-ext/connect"
import {NftMarketContract} from "@_types/nftMarketContract";


const MAGIK_PK_FOR_GOERLI_NET = process.env.NEXT_PUBLIC_MAGIC_PK_FOR_GOERLI_NET


type Nullable<T> = {
    [P in keyof T]: T[P] | null
}

export type Web3State = {
    isLoading: boolean
    hooks: Web3Hooks
} & Nullable<Web3Dependencies>

export const createDefaultState = () => {
    return {
        provider:  null,
        contract:  null,
        isLoading: true,
        hooks: setupHooks({isLoading: true} as any)
    }
}

export const createWeb3State = (
    {
        provider,
        contract,
        isLoading,
    }: Web3Dependencies) => {
    return {
        provider,
        contract,
        isLoading,
        hooks: setupHooks(
            {
                provider,
                contract,
                isLoading,
            }
        )
    }
}

export const loadContract = async (
    name: string,  // NftMarket
    provider: providers.Web3Provider,
    net_id: string
): Promise<Contract> => {
    if (!net_id) {
        return Promise.reject("Network ID is not defined!")
    }

    const res = await fetch(`/contracts/${name}.json`)
    const Artifact = await res.json()

    if (Artifact.networks[net_id].address) {
        const contract = new ethers.Contract(
            Artifact.networks[net_id].address,
            Artifact.abi,
            provider
        )
        return contract
    } else {
        return Promise.reject(`Contract: [${name}] cannot be loaded!`)
    }
}

export const OptimismNodeOptions = {
    rpcUrl: "https://goerli.optimism.io",
    chainId: 420
}
export const PolygonNodeOptions = {
    rpcUrl: 'https://rpc-mumbai.maticvigil.com/', // Polygon RPC URL
    chainId: 80001, // Polygon chain id
}

export const GoerliOptionNode = {
    rpcUrl: "https://rpc.ankr.com/eth_goerli",
    chainId: 5
}
export const networkOptions = [PolygonNodeOptions, OptimismNodeOptions]
export const quantityNetworks = networkOptions.length
const magicInit = (network: CustomNodeConfiguration) => {
    return new Magic(MAGIK_PK_FOR_GOERLI_NET, {
        network: network,
        locale: "en_US",
        extensions: [new ConnectExtension()]
    })
}

export const initContractInNetwork = async (network: CustomNodeConfiguration, contractName: string) => {
    const magic = magicInit(network)
    const provider = new ethers.providers.Web3Provider(magic.rpcProvider as any)
    const netContract = await loadContract(contractName, provider, `${network.chainId}`)
    const signerNet = provider.getSigner()
    const signedContractNet = netContract.connect(signerNet)

    return {
        provider,
        signedContractNet
    }
}