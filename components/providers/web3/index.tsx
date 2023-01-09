import {createContext, FunctionComponent, useContext, useEffect, useState} from "react"
import {
    createDefaultState,
    createWeb3State,
    GoerliOptionNode,
    loadContract,
    magicConnectProvider,
    OptimismNodeOptions,
    PolygonNodeOptions,
    GanacheNodeOptions,
    Web3State
} from "./utils";
import {ethers, providers} from "ethers";
import {NftMarketContract} from "@_types/nftMarketContract";
import {useDispatch, useSelector} from "react-redux";
import {
    selectNameNetwork,
    selectNetworkId,
    setAccount,
    setBalance,
    setNetworkId
} from "../../../store/slices/networkSlice";
import {setAuthState} from "../../../store/slices/authSlice";


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
    let networkName = useSelector(selectNameNetwork);


    useEffect(() => {
        let isLoad = false;
        if (!isLoad){
            const switchNetworkName = () => {

                switch (networkName) {
                    case 'Optimism Goerli':
                        setNetNameState(OptimismNodeOptions);
                        dispatch(setNetworkId('420'));
                        break;
                    case 'Polygon':
                        setNetNameState(PolygonNodeOptions)
                        dispatch(setNetworkId('80001'));
                        break

                    case 'Goerli Test Network':
                        setNetNameState(GoerliOptionNode);
                        dispatch(setNetworkId('5'));
                        break;
                    case 'Ganache':
                        setNetNameState(GanacheNodeOptions);
                        dispatch(setNetworkId('1337'));
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

        return () => {
            removeGlobalListeners(window.ethereum);
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







