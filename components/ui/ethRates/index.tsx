
import {useEthPrice} from "@hooks/useEthPrice";
import Loader from "../loader";
import Image from "next/image";
import {useWeb3} from "../../providers/web3";
import {useSelector} from "react-redux";
import {selectNetworkId} from "../../../store/slices/networkSlice";
import {NETWORKS_SYMBOL} from "@_types/hooks";


export default function EthRates() {

    const networkId = useSelector(selectNetworkId)
    const {eth} = useEthPrice(networkId)
    const {provider} = useWeb3();


    const showWallet = () => {
                     // @ts-ignore
            provider.provider.sdk.connect.showWallet().catch((e: any) => {
                console.log(e, " wallet connection error")
            })
        }
    return (
        <div className="flex flex-column  text-center drop-shadow rounded-md mr-2 bg-orange-500 max-w-fit">
            <button type="button" className="
            flex
            flex-row
            z-20
            items-center
            justify-center
            rounded-md
            px-10 py-10
            font-bold
            text-lg
            font-medium
            text-white
            hover:bg-orange-700
            md:py-4 md:px-10
            md:text-lg"
                    onClick={() => {
                        showWallet()
                    }}>SHOW WALLET
                <Image
                    className="mx-1"
                    alt="wallet image"
                    height="50"
                    width="55"
                    src="/images/wallet.png"
                />

            </button>


            <div className="text-sm text-white font-bold">Current eth Price:</div>
            <div className="flex items-center justify-center">
                {eth.data ?
                    <>
                        1 <Image
                        alt="eth symbol"
                        height="22"
                        width="22"
                        src={NETWORKS_SYMBOL[networkId]}
                    />
                        <span className="text-xl font-bold text-white">
                = {eth.data}$
              </span>
                    </> :
                    <div className="w-full flex justify-center">
                        <Loader size="md"/>
                    </div>
                }
            </div>
        </div>
    )
}
