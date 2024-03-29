/* eslint-disable @next/next/no-img-element */

import React, {FunctionComponent, useEffect, useState} from "react";
import {Nft} from "../../../../types/nft";
import {useEthPrice} from "../../../hooks/useEthPrice";
import {useWeb3} from "@providers/web3";
import {ethers} from "ethers";
import {useSelector} from "react-redux";
import {selectNetworkId} from "../../../../store/slices/networkSlice";
import {NETWORKS_SYMBOL} from "@_types/hooks";

const TRANSAK_API_KEY = process.env.NEXT_PUBLIC_TRANSAK_API_KEY;
const TRANSAK_ENV = process.env.NEXT_PUBLIC_TRANSAK_ENV;


type NftItemProps = {
    item: Nft;
    buyNft: (token: number, value: number) => Promise<void>;
    transakWallet: (
        cryptoCurrency: string,
        fiatValue: string,
        address: string,
        fiatCurrency: string,
        customersEmail: string,
        apiKey: string,
        env: string,
        tokenId: number,
        value: number
    ) => Promise<void>;

}

function shortifyAddress(address: string) {
    return `0x****${address.slice(-4)}`
}

const NftItem: FunctionComponent<NftItemProps> = ({item, buyNft, transakWallet}) => {
    const networkId = useSelector(selectNetworkId)
    const {eth} = useEthPrice(networkId);
    const {contract, provider} = useWeb3();
    const [isOwner, setIsOwner] = useState(false);
    const [addressState, setAddress]=useState(null);
    const [balanceState, setBalanceState] = useState(null);

    const defaultButtonStyle = `disabled:bg-slate-50
    disabled:text-slate-500
    disabled:border-slate-200
    disabled:shadow-none
    disabled:cursor-not-allowed
    mx-auto  block
    items-center
    px-4 py-2 border
    border-transparent
    text-base font-medium
    rounded-md shadow-sm    
    hover:bg-grey-700
    focus:outline-none
    focus:ring-2
    focus:ring-offset-2
    focus:ring-yellow-500`

    useEffect(() => {
        let isBalanceSet = false
        if(!isBalanceSet){
            const checkIsOwner = async () => {
                const account = await provider!.getSigner().getAddress();
                const owner = await contract.ownerOf(item.tokenId)
                setAddress(account)
                const balance = ethers.utils.formatEther(
                    await provider.getBalance(account), // Balance is in wei
                );
                setBalanceState(balance)
                if (owner === account) {
                    setIsOwner(true)
                }
            }
            checkIsOwner()
        }

        return ()=>{
            isBalanceSet=false
        }
    }, [balanceState, isOwner, networkId])

    return (
        <>
            <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                <div className="flex-1">
                    <details className="flex flex-col justify-between items-center">
                        <summary className="text-xl font-semibold text-gray-900 text-center">{item.meta.name} </summary>
                        <h3>Collection info:</h3>
                        <p className="mt-3 mb-3 text-base text-gray-500 text-center">{item.meta.description}</p>
                        <div className="flex-1">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center mt-2">
                                    <div>
                                        <img
                                            className="inline-block h-9 w-9 rounded-full"
                                            src="/images/page_logo.png"
                                            alt=""
                                        />
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Creator</p>
                                        <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">{shortifyAddress(item.creator)}</p>
                                    </div>
                                </div>
                                <p className="text-sm font-medium text-yellow-600">
                                    Pumpkin NFT
                                </p>
                            </div>
                        </div>
                    </details>
                </div>
            </div>
            <div className="flex-shrink-0">
                <img
                    className={`h-full w-full object-cover`}
                    src={item.meta.image as string}
                    alt="New NFT"
                />
            </div>
            <div className="flex-1 bg-white p-6 flex flex-col justify-around">
                <div className="flex justify-center items-center">
                    {item.price}
                    <img className="h-6 mr-1" src={NETWORKS_SYMBOL[networkId]} alt="ether icon"/>
                     = {(item.price * eth.data).toFixed(2)} $
                </div>
                <div className="overflow-hidden mb-4 flex justify-around">
                    <dl className="-mx-4 -mt-4 flex flex-wrap">
                        <div className="flex flex-col px-4 pt-4">
                            <dt className="order-2 text-sm font-medium text-gray-500">Price</dt>
                            <dd className="order-1 text-xl font-extrabold text-yellow-600">
                                <div className="flex justify-center items-center">
                                    {item.price}
                                    <img className="h-6" src={NETWORKS_SYMBOL[networkId]} alt="ether icon"/>
                                </div>

                            </dd>
                        </div>
                        {item.meta.attributes.map(attribute =>
                            <div key={attribute.trait_type} className="flex flex-col px-4 pt-4">
                                <dt className="order-2 text-sm font-medium text-gray-500">
                                    {attribute.trait_type}
                                </dt>
                                <dd className="order-1 text-xl font-extrabold text-yellow-600">
                                    {attribute.value}
                                </dd>
                            </div>
                        )}
                    </dl>

                </div>

                <div>
                    <button
                        onClick={() => {
                            buyNft(item.tokenId, item.price);
                        }}
                        disabled={isOwner ? true : false}
                        type="button"
                        className={`${defaultButtonStyle} ${isOwner ? `text-black bg-yellow-600` : `text-white bg-yellow-600`}`}
                    >
                        {isOwner ? `You are owner` : `Buy with MW`}

                    </button>
                    <button
                        onClick={() => {
                            transakWallet(
                                'GoerliETH',
                                `${(item.price * eth.data).toFixed(2)}`,
                                `${addressState}`,
                                'USD',
                                'ikoniukhov@gmail.com',
                                `${TRANSAK_API_KEY}`,
                                `${TRANSAK_ENV}`,
                                item.tokenId,
                                item.price
                            );
                        }}
                        disabled={isOwner ? true : false}
                        type="button"
                        className={`${defaultButtonStyle} ${isOwner ? `text-black bg-yellow-600` : `text-white bg-yellow-600`}`}
                    >
                        {isOwner ? `You are owner` : `Buy with TW`}

                    </button>


                </div>
            </div>
        </>
    )
}

export default NftItem;