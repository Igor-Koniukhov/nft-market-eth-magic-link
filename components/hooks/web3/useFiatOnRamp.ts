import {CryptoHookFactory} from "@_types/hooks";
import useSWR from "swr";
import {useState} from "react";


type UseFiatOnRampResponse = {
    login: () => Promise<void>,
    isLogin: boolean,
    disconnect: () => Promise<void>,
    showWallet: () => void
}
type FiatOnRampHookFactory = CryptoHookFactory<UseFiatOnRampResponse>

export type UseFiatOnRampHook = ReturnType<FiatOnRampHookFactory>

export const hookFactory: FiatOnRampHookFactory = (
    {
        magic, magicProvider
    }
) => () => {
    const [isLogin, setIsLogin] = useState(false);

    const {
        data,
        mutate,
        isValidating,
        ...swr
    } = useSWR(
        magicProvider ? "web3/useFiatOnRamp" : null,
        async () => {
            const accounts = await magicProvider!.listAccounts();
            const account = accounts[0];

            if (!account) {
                throw "Cannot retrieve account! Please, connect to web3 wallet."
            }
            setIsLogin(true)
            return account
        },{}
    )


    const login = async () => {
        magicProvider?.listAccounts().then((accounts) => {
            if (accounts[0]) {
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


    return {
        ...swr,
        data,
        isValidating,
        login,
        isLogin,
        disconnect,
        showWallet
    };
}