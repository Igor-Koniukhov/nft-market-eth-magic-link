import { createContext, FunctionComponent, useContext, useEffect, useState } from "react"
import { createDefaultState, createWeb3State, loadContract, Web3State, magicConnectProvider } from "./utils";
import { ethers } from "ethers";
import { MetaMaskInpageProvider } from "@metamask/providers";
import { NftMarketContract } from "@_types/nftMarketContract";
import {Magic} from "magic-sdk";

const pageReload = () => { window.location.reload(); }

const handleAccount = (ethereum: Magic["rpcProvider"]) => async () => {
    const isLocked =  !( ethereum.isMagic);
    if (isLocked) { pageReload(); }
}

const setGlobalListeners = (ethereum: Magic["rpcProvider"]) => {
    ethereum.on("chainChanged", pageReload);
    ethereum.on("accountsChanged", handleAccount(ethereum));
}

const removeGlobalListeners = (ethereum: Magic["rpcProvider"]) => {
    ethereum?.removeListener("chainChanged", pageReload);
    ethereum?.removeListener("accountsChanged", handleAccount);
}

const Web3Context = createContext<Web3State>(createDefaultState());

const Web3Provider: FunctionComponent = ({children}) => {
    const [web3Api, setWeb3Api] = useState<Web3State>(createDefaultState());

    useEffect(() => {
        async function initWeb3() {
            try {

                const {magic, magicProvider} = await magicConnectProvider();
                const provider = new ethers.providers.Web3Provider(magic.rpcProvider as any);
                const contract =  await loadContract("NftMarket", provider);
                const signer = provider.getSigner();
                const signedContract = contract.connect(signer);
                console.log(magic.rpcProvider, " magic")

                setTimeout(() => setGlobalListeners(magic.rpcProvider), 500);
                setWeb3Api(createWeb3State({
                    ethereum: magic.rpcProvider,
                    provider,
                    contract: signedContract as unknown as NftMarketContract,
                    isLoading: false,
                    magic,
                    magicProvider,
                }))
            } catch(e) {
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
    const { hooks } = useWeb3();
    return hooks;
}

export default Web3Provider;








