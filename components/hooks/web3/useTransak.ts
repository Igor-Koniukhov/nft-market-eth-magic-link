import {CryptoHookFactory} from "@_types/hooks"
import useSWR from "swr"
import transakSDK from '@transak/transak-sdk'
import {useCallback} from "react"
import {ethers} from "ethers"
import {toast} from "react-toastify"

type UseTransakResponse = {
    showTransakWallet: (cryptoCurrency: string,
                        fiatValue: string,
                        chainId: string,
                        fiatCurrency: string,
                        customersEmail: string,
                        TRANSAK_API_KEY: string,
                        ENV: string,
                        tokenId: number,
                        value: number) => void,
}
type TransakHookFactory = CryptoHookFactory<Map<string, string>,UseTransakResponse>

export type UseTransakHook = ReturnType<TransakHookFactory>

export const hookFactory: TransakHookFactory = (
    {
        providers,
        contracts
    }
) => () => {
    const {
        data,
        isValidating,
        ...swr
    } = useSWR(
        providers ? "web3/useTransak" : null,
        async () => {

            const accountsMap = new Map<string, string>()

            for (const [chainId, provider] of Object.entries(providers)) {
                provider!.listAccounts().then(account => {
                    if (!account) {
                        throw "Cannot retrieve account! Please, connect to web3 wallet."
                    }
                    accountsMap.set(chainId, account)

                })

            }


            return accountsMap
        }, {}
    )

    const _contracts = contracts
    const buyNft = useCallback(async (chainId: string, tokenId: number, value: number) => {

        try {
            const result = await _contracts[chainId]!.buyNft(
                tokenId, {
                    value: ethers.utils.parseEther(value.toString())
                }
            )

            await toast.promise(
                result!.wait(), {
                    pending: "Processing transaction",
                    success: "Nft is yours! Go to Profile page",
                    error: "Processing error"
                }
            )
        } catch (e) {
            console.error(e.message)
        }
    }, [_contracts])

    const showTransakWallet = (
        cryptoCurrency: string,
        fiatValue: string,
        chainId: string,
        fiatCurrency: string,
        customersEmail: string,
        TRANSAK_API_KEY: string,
        ENV: string,
        tokenId: number,
        value: number
    ) => {

        let transak = new transakSDK({
            apiKey: `${TRANSAK_API_KEY}`,  // Your API Key
            environment: `${ENV}`, // STAGING/PRODUCTION
            widgetHeight: '625px',
            widgetWidth: '500px',
            // Examples of some customization parameters you can pass
            defaultCryptoCurrency: `${cryptoCurrency}`, // Example 'ETH'
            fiatAmount: `${fiatValue}`,
            walletAddress: `${data[chainId]}`, // Your customer's wallet address
            themeColor: '#FFA500', // App theme color
            fiatCurrency: `${fiatCurrency}`, // If you want to limit fiat selection eg 'GBP'
            email: `${customersEmail}`, // Your customer's email address
            redirectURL: '/', // Redirect URL of your app
        })

        transak.init()

// To get all the events
        transak.on(transak.ALL_EVENTS, (orderData) => {
            console.log(orderData, orderData.eventName)
        })

        transak.on(transak.EVENTS.TRANSAK_ORDER_CREATED, (orderData) => {
            console.log(orderData)
            transak.close()
        })

        transak.on(transak.EVENTS.TRANSAK_ORDER_CREATED, (orderData) => {
            console.log(orderData)
            buyNft(chainId, tokenId, value)
        })


// This will trigger when the user marks payment is made.
        transak.on(transak.EVENTS.TRANSAK_ORDER_SUCCESSFUL, (orderData) => {
            console.log(orderData)
            transak.close()
        })
    }

    return {
        ...swr,
        data: data || {} as Map<string, string>,
        isValidating,
        showTransakWallet,
    }
}

