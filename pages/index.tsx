/* eslint-disable @next/next/no-img-element */
import type {NextPage} from 'next';
import {BaseLayout, EthRates, NftList} from '@ui';
import {useNetwork} from '@hooks/web3';
import {ExclamationIcon} from '@heroicons/react/solid';
import {useWeb3} from "@providers/web3";
import {useEffect, useState} from "react";
import {ethers} from "ethers";


const Home: NextPage = () => {
    const {network} = useNetwork();
    const isConnected = network.isConnectedToNetwork
    const {provider} = useWeb3()
    const [balanceState, setBalanceState] = useState(null)

    useEffect(() => {
        const checkIsOwner = async () => {
            if (isConnected){
                const account = await provider!.getSigner().getAddress();

                const balance = ethers.utils.formatEther(
                    await provider!.getBalance(account), // Balance is in wei
                );
                setBalanceState(balance)
            }


        }
        checkIsOwner()
    }, [isConnected])


    return (
        <BaseLayout>
            <h3> Your balance: </h3>
            <h4>{balanceState} Eth</h4>
            <div className="relative bg-gray-50 pt-16 pb-20 px-4 sm:px-6 lg:pt-24 lg:pb-28 lg:px-8">
                <EthRates/>
                <div className="relative">
                    <div className="text-center">
                        <h2 className="text-3xl tracking-tight font-extrabold text-gray-900 sm:text-4xl">
                            Halloween Pumpkins NFTs</h2>
                        <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
                            Create, Sale and Buy Nft! Get unlimited ownership forever!
                        </p>
                    </div>
                    {network.isConnectedToNetwork ?
                        <NftList/> :
                        <div className="rounded-md bg-yellow-50 p-4 mt-10">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <ExclamationIcon className="h-5 w-5 text-yellow-400" aria-hidden="true"/>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-yellow-800">Attention needed</h3>
                                    <div className="mt-2 text-sm text-yellow-700">
                                        <p>
                                            {network.isLoading ?
                                                "Loading..." :
                                                `Connect to ${network.targetNetwork}`
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>


        </BaseLayout>
    )
}

export default Home