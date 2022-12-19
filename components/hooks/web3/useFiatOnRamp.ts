import {CryptoHookFactory} from "@_types/hooks";
import useSWR from "swr";
import {useState} from "react";
import {ethers} from "ethers";


type UseFiatOnRampResponse = {
    login: () => Promise<void>,
    isLogin: boolean,
    disconnect: () => Promise<void>,
    showWallet: () => void,
    sendTransaction: () => void
}
type FiatOnRampHookFactory = CryptoHookFactory<UseFiatOnRampResponse>

export type UseFiatOnRampHook = ReturnType<FiatOnRampHookFactory>

export const hookFactory: FiatOnRampHookFactory = (
    {
        magic, provider
    }
) => () => {
    const [isLogin, setIsLogin] = useState(false);

    const {
        data,
        mutate,
        isValidating,
        ...swr
    } = useSWR(
        provider ? "web3/useFiatOnRamp" : null,
        async () => {
            const account = await provider!.getSigner().getAddress();

            if (!account) {
                throw "Cannot retrieve account! Please, connect to web3 wallet."
            }
            setIsLogin(true)
            return account
        },{}
    )


    const login = async () => {
        provider?.getSigner().getAddress().then((account) => {
            if (account) {
                setIsLogin(true);
            }
        })
            .catch((error) => {
                console.log(error, " console error");
            });
    };

    const showWallet = () => {
        magic.connect.showWallet().catch((e: any) => {
            console.log(e);
        });
    };

    const disconnect = async () => {
        await magic.connect.disconnect().catch((e: any) => {
            console.log(e);
        });
        setIsLogin(false);
        console.log(" disconnected");

    };
    const sendTransaction = async (to, NftPrice) => {
        const signer = await provider!.getSigner();
        const account = await signer.getAddress();
        console.log(account)
        const txnParams = {
            from: account,
            to: to,
            value: magic.utils.toWei(NftPrice, "ether"),
            gasPrice: magic.utils.toWei("30", "gwei")
        };
        magic.eth
            .sendTransaction(txnParams as any)
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


    return {
        ...swr,
        data,
        isValidating,
        login,
        isLogin,
        disconnect,
        showWallet,
        sendTransaction
    };
}