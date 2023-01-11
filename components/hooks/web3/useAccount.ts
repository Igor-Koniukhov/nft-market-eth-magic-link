import {CryptoHookFactory} from "@_types/hooks";
import {useEffect} from "react";
import useSWR from "swr";
import {ethers} from "ethers";

type UseAccountResponse = {
    connect: () => void;
    isLoading: boolean;
    isInstalled: boolean;

}

type AccountHookFactory = CryptoHookFactory<string, UseAccountResponse>

export type UseAccountHook = ReturnType<AccountHookFactory>

export const hookFactory: AccountHookFactory = (
    {
        provider,
        ethereum,
        isLoading
    }
) => () => {

    const {
        data,
        mutate,
        isValidating,
        ...swr
    } = useSWR(
        provider ? "web3/useAccount" : null,
        async () => {
            const accounts = await provider!.listAccounts();
            const account = accounts[0];

            if (!account) {
                throw "Cannot retrieve account! Please, connect to web3 wallet."
            }

            return account;
        }, {
            revalidateOnFocus: false,
            shouldRetryOnError: false
        }
    )

    useEffect(() => {
        provider?.on("accountsChanged", handleAccountsChanged);
        return () => {
            provider?.removeListener("accountsChanged", handleAccountsChanged);
        }
    })

    const handleAccountsChanged = (...args: unknown[]) => {
        const accounts = args[0] as string[];
        if (accounts.length === 0) {
            console.error("Please, connect to Web3 wallet");
        } else if (accounts[0] !== data) {
            mutate(accounts[0]);
        }
    }

    const connect = async () => {
        console.log(provider, " this is ethereum on connect")
        try {

            //ethereum?.request({method: "eth_requestAccounts"});
        } catch (e) {
            console.error(e);
        }
    }

    const balanceState = async () => {
       await provider?.getSigner().getAddress().then((account: string) => {
            if (account) {
                provider!.getBalance(account).then(balance => {
                   return  ethers.utils.formatEther(balance)
                })

            }
        })
            .catch((error) => {
                console.log(error, " console error");
            });
    }


    return {
        ...swr,
        data,
        isValidating,
        isLoading: isLoading as boolean,
        isInstalled: true,
        mutate,
        connect,

    };
}