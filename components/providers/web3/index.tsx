import {createContext, FunctionComponent, useContext, useEffect, useState} from "react"
import {NftMarketContract} from "@_types/nftMarketContract";
import {useDispatch, useSelector} from "react-redux";
import {selectNetworkId, setNameNetwork, setNetworkId} from "../../../store/slices/networkSlice";
import {NETWORKS} from "@_types/hooks";
import {setAuthState} from "../../../store/slices/authSlice";
import {CustomNodeConfiguration} from "magic-sdk";
import {
    createDefaultState,
    createWeb3State,
    initContractInNetwork,
    GoerliOptionNode,
    OptimismNodeOptions,
    PolygonNodeOptions,
    Web3State
} from "./utils";

const DEFAULT_NET_ID = process.env.NEXT_PUBLIC_DEFAULT_CHAIN_ID;
const Web3Context = createContext<Web3State>(createDefaultState());


const Web3Provider: FunctionComponent<any> = ({children}) => {

    const [web3Api, setWeb3Api] = useState<Web3State>(createDefaultState())
    const dispatch = useDispatch()
    let netId = useSelector(selectNetworkId) || DEFAULT_NET_ID

    const setPreviousSessionNodOptions = () => {
        if (localStorage.getItem("isLogin") === "1") {
            dispatch(setAuthState(true))
        }
        dispatch(setNameNetwork(localStorage.getItem("network") || NETWORKS[DEFAULT_NET_ID]))
        dispatch(setNetworkId(localStorage.getItem("networkId") || DEFAULT_NET_ID))
    }

    const setNetworkChainId = (options: CustomNodeConfiguration) => {
        dispatch(setNetworkId(`${options.chainId}`))
        dispatch(setNameNetwork(`${NETWORKS[options.chainId]}`))
        localStorage.setItem("networkId", `${options.chainId}`)
        localStorage.setItem("network", `${NETWORKS[options.chainId]}`)
    }

    const setWeb3WithNodeOptions = (options: CustomNodeConfiguration, contractName: string) => {
        setPreviousSessionNodOptions()
        setNetworkChainId(options)
        initContractInNetwork(options, contractName)
            .then(data => {
                setWeb3Api(createWeb3State({
                    provider: data.provider,
                    contract: data.signedContractNet as unknown as NftMarketContract,
                    isLoading: false,
                }))
            })
    }

    const switchNetworkChain = (id: string) => {
        switch (id) {
            case `${OptimismNodeOptions.chainId}`:
                setWeb3WithNodeOptions(OptimismNodeOptions, "NftMarket")
                break
            case `${PolygonNodeOptions.chainId}`:
                setWeb3WithNodeOptions(PolygonNodeOptions, "NftMarket")
                break
            case `${GoerliOptionNode.chainId}`:
                setWeb3WithNodeOptions(GoerliOptionNode, "NftMarket")
                break
        }
    }

    useEffect(() => {
        async function initWeb3() {
            console.log(" initWeb3")
            try {
                await switchNetworkChain(netId)
            } catch (e) {
                console.error(e, "Please, install web3 wallet. Msg from providers/web3 - 53");
                setWeb3Api((api) => createWeb3State({
                    ...api as any,
                    isLoading: true,
                }))
            }
        }

        initWeb3()

    }, [netId])

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







