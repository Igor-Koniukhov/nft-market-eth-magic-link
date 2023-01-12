import {CryptoHookFactory} from "@_types/hooks"
import useSWR from "swr"

type UseAccountResponse = {
    isLoading: boolean
    isInstalled: boolean
}

type AccountHookFactory = CryptoHookFactory<string, UseAccountResponse>

export type UseAccountHook = ReturnType<AccountHookFactory>

export const hookFactory: AccountHookFactory = (
    {
        provider,
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
            const accounts = await provider!.listAccounts()
            const account = accounts[0]
            if (!account) {
                throw "Cannot retrieve account! Please, connect to web3 wallet."
            }
            return account
        }, {
            revalidateOnFocus: false,
            shouldRetryOnError: false
        }
    )
    return {
        ...swr,
        data,
        isValidating,
        isLoading: isLoading as boolean,
        isInstalled: true,
        mutate,


    }
}