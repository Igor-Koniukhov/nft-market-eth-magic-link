import {createContext, FunctionComponent, useContext, useEffect, useState} from "react"
import {
    createDefaultState,
    createWeb3State,
    GoerliNodeOptions,
    loadContract,
    magicConnectProvider,
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


const NETWORK_ID = process.env.NEXT_PUBLIC_NETWORK_ID;
const MAGIK_PK_FOR_GOERLI_NET = process.env.NEXT_PUBLIC_MAGIK_PK_FOR_GOERLI_NET;
const Web3Context = createContext<Web3State>(createDefaultState());

const Web3Provider: FunctionComponent = ({children}) => {
    const [web3Api, setWeb3Api] = useState<Web3State>(createDefaultState());
    const initContractInNetwork = async (key: string, network: any, contractName: string) => {
        const magic = await magicConnectProvider(key, network);
        const netContract = await loadContract(contractName, magic.provider, NETWORK_ID);
        const signerNet = magic.provider.getSigner();
        const signedContractNet = netContract.connect(signerNet);
        return {magic, signedContractNet}
    }

    useEffect(() => {
        async function initWeb3() {
            try {
                const web3 = initContractInNetwork(MAGIK_PK_FOR_GOERLI_NET, GoerliNodeOptions, "NftMarket")
                web3.then(data => {
                    setTimeout(() => setGlobalListeners(data.magic.magic.rpcProvider), 500);
                    setWeb3Api(createWeb3State({
                        ethereum: window.ethereum,
                        provider: data.magic.provider,
                        contract: data.signedContractNet as unknown as NftMarketContract,
                        isLoading: false,
                        magic: data.magic.magic,
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







