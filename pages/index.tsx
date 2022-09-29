/* eslint-disable @next/next/no-img-element */
import type {NextPage} from 'next';
import {BaseLayout, NftList} from '@ui';
import {useNetwork} from '@hooks/web3';
import {ExclamationIcon} from '@heroicons/react/solid';

import { Magic } from "magic-sdk";
import { ConnectExtension } from "@magic-ext/connect";
import Web3 from "web3";
import {useState} from "react";

const magic = new Magic("pk_live_267F04951ED39D06", {
    network: "rinkeby",
    locale: "en_US",
    extensions: [new ConnectExtension()]
});


const web3 = new Web3(magic.rpcProvider)  as any;


const Home: NextPage = () => {
    const {network} = useNetwork();

    const [account, setAccount] = useState(null);

    const sendTransaction = async () => {
        const publicAddress = (await web3.eth.getAccounts())[0];
        const txnParams = {
            from: publicAddress,
            to: publicAddress,
            value: web3.utils.toWei("0.01", "ether"),
            gasPrice: web3.utils.toWei("30", "gwei")
        };
        web3.eth
            .sendTransaction(txnParams)
            .on("transactionHash", (hash) => {
                console.log("the txn hash that was returned to the sdk:", hash);
            })
            .then((receipt) => {
                console.log("the txn receipt that was returned to the sdk:", receipt);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const login = async () => {
        web3.eth.getAccounts().then((accounts) => {
            return setAccount(accounts[0]);
        })
            .catch((error) => {
                console.log(error, " console error");
            });
    };

    const signMessage = async () => {
        const publicAddress = (await web3.eth.getAccounts())[0];
        const signedMessage = await web3.eth.personal
            .sign("My Message", publicAddress, "")
            .catch((e) => console.log(e));
        console.log(signedMessage);
    };

    const showWallet = () => {
        magic.connect.showWallet().catch((e) => {
            console.log(e);
        });
    };

    const disconnect = async () => {
        await magic.connect.disconnect().catch((e) => {
            console.log(e);
        });
        setAccount(null);
    };

    return (
       account ? <BaseLayout>
            <div className="relative bg-gray-50 pt-16 pb-20 px-4 sm:px-6 lg:pt-24 lg:pb-28 lg:px-8">
                <div className="absolute inset-0">
                    <div className="bg-white "/>
                    <button onClick={showWallet} className="button-row">
                        Show Wallet
                    </button>
                    <button onClick={sendTransaction} className="button-row">
                        Send Transaction
                    </button>
                    <button onClick={signMessage} className="button-row">
                        Sign Message
                    </button>
                    <button onClick={disconnect} className="button-row">
                        Disconnect
                    </button>
                </div>
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
        </BaseLayout> :
           <BaseLayout>
               <button onClick={login} className="button-row">
                   Sign In
               </button>
           </BaseLayout>


    )
}

export default Home