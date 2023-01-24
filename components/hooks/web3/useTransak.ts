import {CryptoHookFactory} from "@_types/hooks";
import useSWR from "swr";
import transakSDK from '@transak/transak-sdk'
import {useCallback} from "react";
import {ethers} from "ethers";
import {toast} from "react-toastify";

type UseTransakResponse = {
    showTransakWallet: () => void,
}
type TransakHookFactory = CryptoHookFactory<UseTransakResponse>

export type UseTransakHook = ReturnType<TransakHookFactory>



export const hookFactory: TransakHookFactory = (
    {
        provider,
        contract

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

    const _contract = contract;
    const buyNft = useCallback(async (tokenId: number, value: number) => {

        try {
            const result = await _contract!.buyNft(
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
            );

        } catch (e) {

            console.error(e.message);
        }
    }, [_contract])

    const showTransakWallet = (
        cryptoCurrency: string,
        fiatValue: string,
        address: string,
        fiatCurrency: string,
        customersEmail: string,
        TRANSAK_API_KEY:string,
        ENV: string,
        tokenId: number,
        value: number
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
            redirectURL: '/', // Redirect URL of your app


        });


        transak.init();

// To get all the events
        transak.on(transak.ALL_EVENTS, (data) => {
            console.log(data, data.eventName)

        });



        transak.on(transak.EVENTS.TRANSAK_ORDER_CREATED, (orderData) => {
            console.log(orderData);
            transak.close();
        });

        transak.on(transak.EVENTS.TRANSAK_ORDER_CREATED, (orderData) => {
            console.log(orderData);
            buyNft(tokenId, value)
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
