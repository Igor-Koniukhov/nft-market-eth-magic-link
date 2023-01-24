import {useEthPrice} from "@hooks/useEthPrice";
import Loader from "../loader";
import Image from "next/image";
import {useWeb3} from "../../providers/web3";


export default function EthRates() {

    const {eth} = useEthPrice()
    const {provider} = useWeb3();

    const showWallet = () => {
        // @ts-ignore
        provider.provider.sdk.connect.showWallet().catch((e: any) => {
            console.log(e, " wallet connection error");
        });

    };
    const handleProvider = () => {
        // @ts-ignore
        console.log(provider.provider.sdk.connect.__sdk_access_field_descriptors__, " from show wallet")
        // @ts-ignore
        console.log(provider.provider.sdk.connect.utils.storage, " from show wallet")
        // @ts-ignore
        console.log(provider.provider.sdk.connect.__sdk_access_field_descriptors__, " from show wallet")
        // @ts-ignore
        console.log(provider.provider.sdk.connect.__is_initialized__, " from show wallet")
    };

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
            <button type="button" onClick={handleProvider}>Click</button>
            <div className="text-sm text-white font-bold">Current eth Price:</div>
            <div className="flex items-center justify-center">
                {eth.data ?
                    <>
                        1 <Image
                        alt="eth symbol"
                        layout="fixed"
                        height="35"
                        width="35"
                        src="/images/small-eth.webp"
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