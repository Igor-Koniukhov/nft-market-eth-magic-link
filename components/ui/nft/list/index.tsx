import React, {FunctionComponent, useEffect} from "react"
import NftItem from "../item"
import {useListedNfts, useTransak} from "@hooks/web3"
import {useSelector} from "react-redux"
import {selectNetworkId} from "../../../../store/slices/networkSlice"
import {useSWRConfig} from "swr"
import {useWeb3} from "@providers/web3"


const NftList: FunctionComponent = () => {
    const {nfts} = useListedNfts()
    const {transakWallet} = useTransak()
    const {mutate} = useSWRConfig()
    const {contracts} = useWeb3()
    const chainId = useSelector(selectNetworkId)


    /*useEffect(() => {
        mutate(contract ? "web3/useListedNfts" : null, nfts.data, {populateCache: true})
    }, [networkId])*/
    return (
        <div className="mt-12 max-w-lg mx-auto grid gap-5 lg:grid-cols-3 lg:max-w-none">
            {nfts.data[chainId]?.map(nft =>
                <div key={nft.meta.image as string} className="flex flex-col rounded-lg shadow-lg overflow-hidden">
                    <NftItem
                        item={nft}
                        buyNft={nfts[chainId].buyNft}
                        transakWallet={transakWallet.showTransakWallet}
                    />
                </div>
            )}
        </div>
    )
}

export default NftList