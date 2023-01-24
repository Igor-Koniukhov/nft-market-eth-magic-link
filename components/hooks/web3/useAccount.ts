import {CryptoHookFactory} from "@_types/hooks"
import useSWR from "swr"
import {quantityNetworks} from "@providers/web3/utils";

type UseAccountResponse = {
    isLoading: boolean
    isInstalled: boolean
}

type AccountHookFactory = CryptoHookFactory<Map<string, string>, UseAccountResponse>

export type UseAccountHook = ReturnType<AccountHookFactory>

export const hookFactory: AccountHookFactory = (
    {
        providers,
        isLoading
    }
) => () => {

    const {
        data,
        mutate,
        isValidating,
        ...swr
    } = useSWR(
        providers ? "web3/useAccount" : {},
        async () => {

            const accountsMap = new Map<string, string>()
            if (providers.size === quantityNetworks) {
                providers.forEach((provider, chainId) => {
                    provider!.listAccounts().then(account => {
                        accountsMap.set(chainId, account[0])
                        if (!account) {
                            throw "Cannot retrieve account! Please, connect to web3 wallet."
                        }
                    })
                })
            }

            return accountsMap
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