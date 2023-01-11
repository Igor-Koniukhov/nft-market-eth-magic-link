import {createContext, FunctionComponent, useContext, useEffect, useState} from "react"
import {
    createDefaultState,
    createWeb3State,
    GoerliOptionNode,
    loadContract,
    magicConnectProvider,
    OptimismNodeOptions,
    PolygonNodeOptions,
    Web3State
} from "./utils";

import {providers} from "ethers";
import {NftMarketContract} from "@_types/nftMarketContract";
import {useDispatch, useSelector} from "react-redux";
import {
    selectNameNetwork,
    selectNetworkId, setNameNetwork,
    setNetworkId
} from "../../../store/slices/networkSlice";



const pageReload = () => {
    window.location.reload();
}

const handleAccount = (provider: providers.Web3Provider) => async () => {
    console.log(" accountsChacnged")
    const isLocked = !(provider.provider);
    if (isLocked) {
        pageReload();
    }
}


const setGlobalListeners = (provider: providers.Web3Provider) => {
    provider.on("chainChanged", pageReload);
    provider.on("accountsChanged", handleAccount(provider));
}

const removeGlobalListeners = (provider: providers.Web3Provider) => {
    provider?.removeListener("chainChanged", pageReload);
    provider?.removeListener("accountsChanged", handleAccount);
}


const MAGIK_PK_FOR_GOERLI_NET = process.env.NEXT_PUBLIC_MAGIK_PK_FOR_GOERLI_NET;
const Web3Context = createContext<Web3State>(createDefaultState());


const Web3Provider: FunctionComponent<any> = ({children}) => {

    const [web3Api, setWeb3Api] = useState<Web3State>(createDefaultState());
    const dispatch = useDispatch();
    const netId = useSelector(selectNetworkId)
    const [netNameState, setNetNameState]=useState(GoerliOptionNode)
    const initContractInNetwork = async (key: string, network: any, contractName: string , network_id: string) => {
        const magic = await magicConnectProvider(key, network);

        const netContract = await loadContract(contractName, magic.provider, network_id);
        const signerNet = magic.provider.getSigner();
        const signedContractNet = netContract.connect(signerNet);
        return {magic, signedContractNet}
    }

    useEffect(() => {
        const previousSessionNetwork  = localStorage.getItem("network") || "Goerli Test Network"
        console.log(previousSessionNetwork, " network in storaged")
        dispatch(setNameNetwork(previousSessionNetwork))
    }, []);

    let networkName = useSelector(selectNameNetwork);


    useEffect(() => {
        let isLoad = false;
        if (!isLoad){
            const switchNetworkName = () => {

                switch (networkName) {
                    case 'Optimism Goerli':
                        setNetNameState(OptimismNodeOptions);
                        dispatch(setNetworkId('420'));
                        localStorage.setItem("network","Optimism Goerli" )
                        break;
                    case 'Polygon':
                        setNetNameState(PolygonNodeOptions)
                        dispatch(setNetworkId('80001'));
                        localStorage.setItem("network","Polygon" )
                        break

                    case 'Goerli Test Network':
                        setNetNameState(GoerliOptionNode);
                        dispatch(setNetworkId('5'));
                        localStorage.setItem("network","Goerli Test Network" )
                        break;
                }
            }
            switchNetworkName();
        }
        return ()=>{
            isLoad=false;
        }

    }, [networkName]);



    useEffect(() => {
        async function initWeb3() {
            try {
                const web3 = initContractInNetwork(MAGIK_PK_FOR_GOERLI_NET, netNameState, "NftMarket", netId)
                web3.then(data => {
                    setTimeout(() => setGlobalListeners(data.magic.magic.rpcProvider), 500);
                    setWeb3Api(createWeb3State({
                        ethereum: window.provider,
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

        return () => {
            removeGlobalListeners(window.provider);
        }
    }, [netNameState])

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







