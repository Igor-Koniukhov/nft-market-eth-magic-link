import {createContext, FunctionComponent, useContext, useEffect, useState} from "react"
import {
    createDefaultState,
    createWeb3State,
    GoerliNodeOptions,
    loadContract,
    magicConnectProvider,
    OptimismNodeOptions,
    PolygonNodeOptions,
    Web3State
} from "./utils";
import {providers} from "ethers";
import {NftMarketContract} from "@_types/nftMarketContract";

const pageReload = () => {
    window.location.reload();
}

const handleAccount = (ethereum: providers.Web3Provider) => async () => {
    const isLocked = !(ethereum.provider);
    if (isLocked) {
        pageReload();
    }
}

const setGlobalListeners = (ethereum: providers.Web3Provider) => {
    ethereum.on("chainChanged", pageReload);
    ethereum.on("accountsChanged", handleAccount(ethereum));
}

const removeGlobalListeners = (ethereum: providers.Web3Provider) => {
    ethereum?.removeListener("chainChanged", pageReload);
    ethereum?.removeListener("accountsChanged", handleAccount);
}

const Web3Context = createContext<Web3State>(createDefaultState());

const Web3Provider: FunctionComponent = ({children}) => {
    const [web3Api, setWeb3Api] = useState<Web3State>(createDefaultState());

    const initContractInNetwork = async (network: any) => {
        const magic = await magicConnectProvider(network);
        const netContract = await loadContract("NftMarket", magic.provider);
        const signerNet = magic.provider.getSigner();
        const signedContractNet = netContract.connect(signerNet);
        return {magic, signedContractNet}
    }

    useEffect(() => {
        async function initWeb3() {
            try {
                const goerly = initContractInNetwork(GoerliNodeOptions)
                goerly.then(data => {
                    setTimeout(() => setGlobalListeners(data.magic.magic.rpcProvider), 500);
                    setWeb3Api(createWeb3State({
                        ethereum: window.ethereum,
                        provider: data.magic.provider,
                        providerPolygon: web3Api.providerPolygon,
                        providerOptimism: web3Api.providerOptimism,
                        contract: data.signedContractNet as unknown as NftMarketContract,
                        contractOptimism: web3Api.contractOptimism,
                        contractPolygon: web3Api.contractPolygon,
                        isLoading: false,
                        magic: data.magic.magic,
                        magicOptimism: web3Api.magicOptimism,
                        magicPolygon: web3Api.magicPolygon
                    }))

                })

                const optimism = initContractInNetwork(OptimismNodeOptions)
                optimism.then(data => {
                    setTimeout(() => setGlobalListeners(data.magic.magic.rpcProvider), 500);
                    setWeb3Api(createWeb3State({
                        ethereum: window.ethereum,
                        provider: web3Api.provider,
                        providerPolygon: web3Api.providerPolygon,
                        providerOptimism: data.magic.provider,
                        contract: web3Api.contract,
                        contractOptimism: data.signedContractNet as unknown as NftMarketContract,
                        contractPolygon: web3Api.contractPolygon,
                        isLoading: false,
                        magic: web3Api.magic,
                        magicOptimism: data.magic.magic,
                        magicPolygon: web3Api.magicPolygon
                    }))

                })

                const polygon = initContractInNetwork(PolygonNodeOptions)
                polygon.then(data => {
                    setTimeout(() => setGlobalListeners(data.magic.magic.rpcProvider), 500);
                    setWeb3Api(createWeb3State({
                        ethereum: window.ethereum,
                        provider: web3Api.provider,
                        providerPolygon: data.magic.provider,
                        providerOptimism: web3Api.providerPolygon,
                        contract: web3Api.contract,
                        contractOptimism: web3Api.contractPolygon,
                        contractPolygon: data.signedContractNet as unknown as NftMarketContract,
                        isLoading: false,
                        magic: web3Api.magic,
                        magicOptimism: web3Api.magicPolygon,
                        magicPolygon: data.magic.magic
                    }))

                })


            } catch (e) {

                console.error(e, "Please, install web3 wallet. Msg from providers/web3 - 53");

                setWeb3Api((api) => createWeb3State({
                    ...api as any,
                    isLoading: true,
                }))
            }
        }

        initWeb3();
        return () => removeGlobalListeners(window.ethereum);
    }, [])

    return (
        <Web3Context.Provider value={web3Api}>
            {children}
        </Web3Context.Provider>
    )
}

export function useWeb3() {
    return useContext(Web3Context);
}

export function useHooks() {
    const {hooks} = useWeb3();
    return hooks;
}

export default Web3Provider;








