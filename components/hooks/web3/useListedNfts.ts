import {CryptoHookFactory} from "@_types/hooks";
import {Nft} from "@_types/nft";
import {ethers} from "ethers";
import {useCallback} from "react";
import {toast} from "react-toastify";
import useSWR from "swr";


type UseListedNftsResponse = {
    buyNft: (token: number, value: number) => Promise<void>
    buyNftWithMW: (token: number, value: number) => Promise<void>
}
type ListedNftsHookFactory = CryptoHookFactory<Nft[], UseListedNftsResponse>

export type UseListedNftsHook = ReturnType<ListedNftsHookFactory>

export const hookFactory: ListedNftsHookFactory = (
    {
        contract,
        provider,
    }
) => (signedTransaction: string | Promise<string>) => {
    const {data, mutate, ...swr} = useSWR(
        contract ? "web3/useListedNfts" : null,
        async () => {

            const nfts = [] as Nft[];
            const coreNfts = await contract!.getAllNftsOnSale();

            for (let i = 0; i < coreNfts.length; i++) {
                const item = coreNfts[i];
                const tokenURI = await contract!.tokenURI(item.tokenId);
                const metaRes = await fetch(tokenURI);
                const meta = await metaRes.json();

                nfts.push({
                    price: parseFloat(ethers.utils.formatEther(item.price)),
                    tokenId: item.tokenId.toNumber(),
                    creator: item.creator,
                    isListed: item.isListed,
                    meta
                })
            }

            return nfts;
        },{
            shouldRetryOnError:true,
        }
    )

    const _contract = contract;
    const buyNft = useCallback(async (tokenId: number, value: number) => {
        const account = await provider!.getSigner().getAddress();
        const balance = ethers.utils.formatEther(
            await provider.getBalance(account), // Balance is in wei
        );

        const getOwner = await _contract.ownerOf(tokenId)
        if (getOwner === account) {
            alert(`You already owner`)
            return
        }
        if (balance <= value.toString()) {
            alert(`Insufficient balance: ${balance}, Please top up on : ${value} eth`)
            // @ts-ignore
            provider.provider.sdk.connect.showWallet().catch((e: any) => {
                console.log(e);
            });
        }
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

    const buyNftWithMW = useCallback(async (tokenId: number, value: number) => {
        try {
            const result = await _contract!.buyNft(
                tokenId, {
                    value: ethers.utils.parseEther(value.toString())
                }
            )
            console.log(result)

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

    return {
        ...swr,
        buyNft,
        buyNftWithMW,
        data: data || [],
        mutate
    };
}