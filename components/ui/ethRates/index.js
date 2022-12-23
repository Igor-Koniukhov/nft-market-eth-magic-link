import {useEthPrice} from "../../hooks/useEthPrice";
import Loader from "../loader";
import Image from "next/image"
import {useFiatOnRamp} from "../../hooks/web3";


export default function EthRates() {
    const {eth} = useEthPrice()
    const {magicWallet} = useFiatOnRamp();

    return (

            <div className="flex drop-shadow rounded-md mr-2">
            <button type="button" className="
            flex
            flex-column
            z-20
            items-center
            justify-center
            rounded-md
            border
            border-transparent
            bg-orange-500
            px-10 py-10
            font-bold
            text-lg
            font-medium
            text-white
            hover:bg-orange-700
            md:py-4 md:px-10
            md:text-lg"
                    onClick={() => {
                        magicWallet.showWallet()
                    }}>SHOW WALLET
                <div className="text-sm text-white-500">Current eth Price:</div>
                <div className="flex items-center justify-center">
                    {eth.data ?
                        <>
                         1 <Image
                                layout="fixed"
                                height="35"
                                width="35"
                                src="/images/small-eth.webp"
                            />
                            <span className="text-xl font-bold">
                = {eth.data}$
              </span>
                        </> :
                        <div className="w-full flex justify-center">
                            <Loader size="md"/>
                        </div>
                    }
                </div>

            </button>


            </div>


    )
}
