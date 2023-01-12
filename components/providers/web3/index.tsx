import {createContext, FunctionComponent, useContext, useEffect, useState} from "react"
import {
    createDefaultState,
    createWeb3State,
    GoerliOptionNode,
    initContractInNetwork,
    OptimismNodeOptions,
    PolygonNodeOptions,
    Web3State
} from "./utils";

import {providers} from "ethers";
import {NftMarketContract} from "@_types/nftMarketContract";
import {useDispatch, useSelector} from "react-redux";
import {selectNameNetwork, selectNetworkId, setNameNetwork, setNetworkId} from "../../../store/slices/networkSlice";
import {NETWORKS} from "@_types/hooks";
import {setAuthState} from "../../../store/slices/authSlice";
import {CustomNodeConfiguration} from "magic-sdk";

const DEFAULT_NET_ID = process.env.NEXT_PUBLIC_DEFAULT_CHAIN_ID;
const MAGIK_PK_FOR_GOERLI_NET = process.env.NEXT_PUBLIC_MAGIK_PK_FOR_GOERLI_NET;

const pageReload = () => {
    window.location.reload();
}

const handleAccount = (provider: providers.Web3Provider) => async () => {
    // @ts-ignore
    const isLocked = !(provider.provider.sdk.connect.__is_initialized__);
    if (isLocked) {
        pageReload();
    }
}

const setGlobalListeners = (provider: providers.Web3Provider) => {
    provider.on("chainChanged", pageReload);
    provider.on("networksChanged", handleAccount(provider));
}

const removeGlobalListeners = (provider: providers.Web3Provider) => {
    provider?.removeListener("chainChanged", pageReload);
    provider?.removeListener("networksChanged", handleAccount);
}

const Web3Context = createContext<Web3State>(createDefaultState());

const Web3Provider: FunctionComponent<any> = ({children}) => {
    const [web3Api, setWeb3Api] = useState<Web3State>(createDefaultState())
    const dispatch = useDispatch();
    const [netNameState, setNetNameState] = useState(GoerliOptionNode)
    let netId = useSelector(selectNetworkId) || DEFAULT_NET_ID
    let networkName = useSelector(selectNameNetwork)

    useEffect(() => {
        const setPreviousOptions = () => {
            if (localStorage.getItem("isLogin") === "1") {
                dispatch(setAuthState(true))
            }
            dispatch(setNameNetwork(localStorage.getItem("network") || NETWORKS[DEFAULT_NET_ID]))
            dispatch(setNetworkId(localStorage.getItem("networkId") || DEFAULT_NET_ID))
        }
        setPreviousOptions()
    }, []);

    const setNodeOptions = (options: CustomNodeConfiguration) => {
        setNetNameState(options as unknown as any);
        dispatch(setNetworkId(`${options.chainId}`))
        localStorage.setItem("network", NETWORKS[options.chainId])
        localStorage.setItem("networkId", `${options.chainId}`)
    }
    useEffect(() => {
        const switchNetworkName = () => {
            switch (networkName) {
                case NETWORKS[OptimismNodeOptions.chainId]:
                    setNodeOptions(OptimismNodeOptions);
                    break;
                case NETWORKS[PolygonNodeOptions.chainId]:
                    setNodeOptions(PolygonNodeOptions)
                    break

                case NETWORKS[GoerliOptionNode.chainId]:
                    setNodeOptions(GoerliOptionNode)
                    break;
            }
        }
        switchNetworkName();
    }, [networkName]);

    useEffect(() => {
        async function initWeb3() {
            try {
                const web3 = initContractInNetwork(MAGIK_PK_FOR_GOERLI_NET, netNameState, "NftMarket", netId)
                web3.then(data => {
                    setTimeout(() => setGlobalListeners(data.provider), 500);
                    setWeb3Api(createWeb3State({
                        ethereum: window.provider,
                        provider: data.provider,
                        contract: data.signedContractNet as unknown as NftMarketContract,
                        isLoading: false,

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

        initWeb3().catch(e => {
            console.error(e)
        })
        return () => {
            removeGlobalListeners(web3Api.provider);
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







