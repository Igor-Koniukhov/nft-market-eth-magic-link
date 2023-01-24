/* eslint-disable @next/next/no-img-element */
import type {NextPage} from "next";
import {BaseLayout} from "@ui";
import {Nft} from "@_types/nft";
import {useAccount, useOwnedNfts} from "@hooks/web3";
import React, {useEffect, useState} from "react";
import {useWeb3} from "@providers/web3";

const tabs = [{name: "Your Collection", href: "#", current: true}];

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}


const Profile: NextPage = () => {
    const {nfts} = useOwnedNfts();
    const [activeNft, setActiveNft] = useState<Nft>();
    const {account} = useAccount();
    const [blockState, setBlockState] = useState({})
    const [transactionState, setTransactionState] = useState({})

    useEffect(() => {
        if (nfts.data && nfts.data.length > 0) {
            setActiveNft(nfts.data[0]);
        }
        return () => setActiveNft(undefined);
    }, [nfts.data])

    const {provider} = useWeb3();
    const [transactionsCount, setTransactionsCount] = useState(null);
    const getData = async () => {
        await provider.getTransactionCount(account.data).then(data => {
            setTransactionsCount(data)
            console.log(data, " transaction count in pages/index 13")
        })
        await provider.getTransaction("0x05faa4dcb3ee03d2133d21d62f2d42ae349aa6d56b3e699de31012ff6f181df3").then(data=>{
            console.log(data, " tx from hash")
        })



    }

    const getNetwork = async () => {
        await provider.getNetwork().then(data => {
            console.log(data, " network")
        });
        Object.entries(blockState).map((value: [string, any], index: number) => {
            console.log(index, value[1])
        })
        console.log(Object.entries(transactionState), " this is tx")
    }

    const reduceData = (data) => {
        return {
            blockMap: Object.entries(data).reduce((a, c, i) => {
                a[c[0]] = c
                a[c[0]].index = i
                return a

            }, {})
        }
    }

    const getBlockInfo = async () => {
        await provider.getBlockNumber().then(data => {
            provider.getBlockWithTransactions(data).then(data => {
                const a = reduceData(data)
                setBlockState(a.blockMap);
                const tx = reduceData(data.transactions)
                setTransactionState(tx.blockMap)

            })

        })
    }


    return (
        <BaseLayout>


            <div className="h-full flex">
                <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex-1 flex items-stretch overflow-hidden">
                        <main className="flex-1 overflow-y-auto">
                            <div className="pt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                <div className="flex">
                                    <h1 className="flex-1 text-2xl font-bold text-gray-900">
                                        Your NFTs
                                    </h1>
                                </div>
                                <div className="mt-3 sm:mt-2">
                                    <div className="hidden sm:block">
                                        <div className="flex items-center border-b border-gray-200">
                                            <nav
                                                className="flex-1 -mb-px flex space-x-6 xl:space-x-8"
                                                aria-label="Tabs"
                                            >
                                                {tabs.map((tab) => (
                                                    <a
                                                        key={tab.name}
                                                        href={tab.href}
                                                        aria-current={tab.current ? "page" : undefined}
                                                        className={classNames(
                                                            tab.current
                                                                ? "border-indigo-500 text-indigo-600"
                                                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                                                            "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
                                                        )}
                                                    >
                                                        {tab.name}
                                                    </a>
                                                ))}
                                            </nav>
                                        </div>
                                    </div>
                                </div>

                                <section
                                    className="mt-8 pb-16"
                                    aria-labelledby="gallery-heading"
                                >
                                    <ul
                                        role="list"
                                        className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8"
                                    >
                                        {(nfts.data as Nft[]).map((nft) => (
                                            <li
                                                key={nft.meta.name}
                                                onClick={() => setActiveNft(nft)}
                                                className="relative"
                                            >
                                                <div
                                                    className={classNames(
                                                        nft.tokenId === activeNft?.tokenId
                                                            ? "ring-2 ring-offset-2 ring-indigo-500"
                                                            : "focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 focus-within:ring-indigo-500",
                                                        "group block w-full aspect-w-10 aspect-h-7 rounded-lg bg-gray-100 overflow-hidden"
                                                    )}
                                                >
                                                    <img
                                                        src={nft.meta.image as string}
                                                        alt=""
                                                        className={classNames(
                                                            true ? "" : "group-hover:opacity-75",
                                                            "object-cover pointer-events-none"
                                                        )}
                                                    />
                                                    <button
                                                        type="button"
                                                        className="absolute inset-0 focus:outline-none"
                                                    >
                            <span className="sr-only">
                              View details for {nft.meta.name}
                            </span>
                                                    </button>
                                                </div>
                                                <p className="mt-2 block text-sm font-medium text-gray-900 truncate pointer-events-none">
                                                    {nft.meta.name}
                                                </p>
                                            </li>
                                        ))}
                                    </ul>
                                </section>
                            </div>
                        </main>

                        {/* Details sidebar */}
                        <aside className="hidden w-96 bg-white p-8 border-l border-gray-200 overflow-y-auto lg:block">
                            {activeNft && (
                                <div className="pb-16 space-y-6">
                                    <div>
                                        <div className="block w-full aspect-w-10 aspect-h-7 rounded-lg overflow-hidden">
                                            <img
                                                src={activeNft.meta.image as string}
                                                alt=""
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="mt-4 flex items-start justify-between">
                                            <div>
                                                <h2 className="text-lg font-medium text-gray-900">
                                                    <span className="sr-only">Details for </span>
                                                    {activeNft.meta.name}
                                                </h2>
                                                <p className="text-sm font-medium text-gray-500">
                                                    {activeNft.meta.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-900">Information</h3>
                                        <dl className="mt-2 border-t border-b border-gray-200 divide-y divide-gray-200">
                                            {activeNft.meta.attributes.map((attr) => (
                                                <div
                                                    key={attr.trait_type}
                                                    className="py-3 flex justify-between text-sm font-medium"
                                                >
                                                    <dt className="text-gray-500">{attr.trait_type}:</dt>
                                                    <dd className="text-gray-900 text-right">
                                                        {attr.value}
                                                    </dd>
                                                </div>
                                            ))}
                                        </dl>
                                    </div>

                                    <div className="flex">
                                        <button
                                            type="button"
                                            className="flex-1 bg-indigo-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            Download Image
                                        </button>
                                        {activeNft.isListed ? <div className="m-2">Already on market </div> :
                                            <button
                                                onClick={() => {
                                                    nfts.listNft(
                                                        activeNft.tokenId,
                                                        activeNft.price
                                                    )
                                                }}
                                                type="button"
                                                className="flex-1 ml-3 bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                            >
                                                To market (sale)
                                            </button>}
                                    </div>
                                </div>
                            )}
                        </aside>
                    </div>
                </div>
            </div>
            <div className="flex">

                <button
                    type="button"
                    onClick={getData}
                    className="
                flex
                btn-danger
                bg-orange-500
                hover:bg-orange-500
                rounded-3
                px-2 py-2">
                    Click for getting tx count: {transactionsCount}</button>
                <button
                    type="button"
                    onClick={getNetwork}
                    className="
                flex
                btn-danger
                bg-orange-500
                hover:bg-orange-500
                rounded-3
                px-2 py-2">
                    Click for get network
                </button>
                <button
                    type="button"
                    onClick={getBlockInfo}
                    className="
                flex
                btn-danger
                bg-orange-500
                hover:bg-orange-500
                rounded-3
                px-2 py-2">
                    Click for get blockInfo
                </button>
            </div>
            <div>
                {Object.entries(blockState).map((value: [string, any], index: number) =>
                    <>
                        <div key={value[0].toString()}>{value[1].map((data) =>
                            <p key={data.toString()}>{data.toString()}</p>

                        )} </div>

                    </>

                )}
            </div>
            <div>
                {Object.entries(transactionState).map((value, index)=>
                    <div key={index}>
                        <h3>Transaction {index} in block: {value[1][1].blockNumber}</h3>
                        <p >blockHash: {value[1][1].blockHash}</p>
                        <p >blockNumber: {value[1][1].blockNumber}</p>
                        <p >chainId: {value[1][1].chainId}</p>
                        <p >confirmations: {value[1][1].confirmations}</p>
                        <p >data: {value[1][1].data}</p>
                        <p >from: {value[1][1].from}</p>
                        <p >gasLimit: {value[1][1].gasLimit.toString()}</p>
                        <p >gasPrice: {value[1][1].gasPrice.toString()}</p>
                        <p >hash: {value[1][1].hash}</p>
                        <p >nonce: {value[1][1].nonce}</p>
                        <p >r: {value[1][1].r}</p>
                        <p >s: {value[1][1].s}</p>
                        <p >to: {value[1][1].to}</p>
                        <p >transactionIndex: {value[1][1].transactionIndex}</p>
                        <p >value: {value[1][1].value.toString()}</p>
                    </div>


                )}
            </div>
        </BaseLayout>
    );
};

export default Profile;