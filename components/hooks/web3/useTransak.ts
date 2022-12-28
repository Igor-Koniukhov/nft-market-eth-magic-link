import {CryptoHookFactory} from "@_types/hooks";
import useSWR from "swr";
import transakSDK from '@transak/transak-sdk'

type UseTransakResponse = {
    showTransakWallet: () => void,
}
type TransakHookFactory = CryptoHookFactory<UseTransakResponse>

export type UseTransakHook = ReturnType<TransakHookFactory>



export const hookFactory: TransakHookFactory = (
    {
        provider
    }
) => () => {


    const {
        data,
        mutate,
        isValidating,
        ...swr
    } = useSWR(
        provider ? "web3/useTransak" : null,
        async () => {
            const account = await provider!.getSigner().getAddress();

            if (!account) {
                throw "Cannot retrieve account! Please, connect to web3 wallet."
            }
            return account
        }, {}
    )


    const showTransakWallet = (
        cryptoCurrency: string,
        fiatValue: string,
        address: string,
        fiatCurrency: string,
        customersEmail: string,
        TRANSAK_API_KEY:string,
        ENV: string,
    ) => {

        let transak = new transakSDK({
            apiKey: `${TRANSAK_API_KEY}`,  // Your API Key
            environment: `${ENV}`, // STAGING/PRODUCTION
            widgetHeight: '625px',
            widgetWidth: '500px',
            // Examples of some of the customization parameters you can pass
            defaultCryptoCurrency: `${cryptoCurrency}`, // Example 'ETH'
            fiatAmount: `${fiatValue}`,
            walletAddress: `${address}`, // Your customer's wallet address
            themeColor: '#FFA500', // App theme color
            fiatCurrency: `${fiatCurrency}`, // If you want to limit fiat selection eg 'GBP'
            email: `${customersEmail}`, // Your customer's email address
            redirectURL: '/' // Redirect URL of your app
        });
        console.log(transak)

        transak.init();

// To get all the events
        transak.on(transak.ALL_EVENTS, (data) => {
            console.log(data)
        });

// This will trigger when the user marks payment is made.
        transak.on(transak.EVENTS.TRANSAK_ORDER_SUCCESSFUL, (orderData) => {
            console.log(orderData);
            transak.close();
        });
    }


    return {
        ...swr,
        data,
        isValidating,
        showTransakWallet,
    };
}

