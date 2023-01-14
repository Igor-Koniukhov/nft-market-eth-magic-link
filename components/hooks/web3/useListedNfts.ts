import {CryptoHookFactory} from "@_types/hooks"
import {Nft} from "@_types/nft"
import {ethers} from "ethers"
import {useCallback} from "react"
import {toast} from "react-toastify"
import useSWR from "swr"
import {NftMarketContract} from "@_types/nftMarketContract";
import {quantityNetworks} from "@providers/web3/utils";


type UseListedNftsResponse = {
    buyNft: (chainId: string, token: number, value: number) => Promise<void>
    buyNftWithMW: (chainId: string, token: number, value: number) => Promise<void>
}
type ListedNftsHookFactory = CryptoHookFactory<Map<string,Nft[]>, UseListedNftsResponse>

export type UseListedNftsHook = ReturnType<ListedNftsHookFactory>

export const hookFactory: ListedNftsHookFactory = (
    {
        contracts,
        providers,
    }
) => (signedTransaction: string | Promise<string>) => {
    const {data, mutate, ...swr} = useSWR(
        contracts ? "web3/useListedNfts" : null,
        async () => {

            const nfts = [] as Nft[]
            const nftsMap = new Map<string, Nft[]>()

            const getMetaData = async (contract: NftMarketContract, chainId: string) => {
                const coreNfts = await contract!.getOwnedNfts()
                for (let i = 0; i < coreNfts.length; i++) {
                    const item = coreNfts[i]
                    const tokenURI = await contract!.tokenURI(item.tokenId)
                    const metaRes = await fetch(tokenURI)
                    const meta = await metaRes.json()

                    nfts.push({
                        price: parseFloat(ethers.utils.formatEther(item.price)),
                        tokenId: item.tokenId.toNumber(),
                        creator: item.creator,
                        isListed: item.isListed,
                        meta
                    })
                    nftsMap.set(chainId, nfts)
                }
            }

            if (contracts.size === quantityNetworks) {
                contracts.forEach((contract, chainId) => {
                    getMetaData(contract, chainId).catch(e => {
                        console.error(e, "Can not get Nft metaData.")
                    })

                })
            }


            return nftsMap
        }, {
            shouldRetryOnError: true,
        }
    )

    const _contracts = contracts
    const buyNft = useCallback(async (chainId: string, tokenId: number, value: number) => {
        const account = await providers.get(chainId)!.getSigner().getAddress()
        const balance = ethers.utils.formatEther(
            await providers[chainId].getBalance(account), // Balance is in wei
        )

        const getOwner = await _contracts.get(chainId).ownerOf(tokenId)
        if (getOwner === account) {
            alert(`You already owner`)
            return
        }
        if (balance <= value.toString()) {
            alert(`Insufficient balance: ${balance}, Please top up on : ${value} eth`)
            const   provider = providers.get(chainId)
            // @ts-ignore
            provider.provider.sdk.connect.showWallet().catch((e: any) => {
                console.log(e, " wallet connection error")
            })
        }
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

    const buyNftWithMW = useCallback(async (chainId:string, tokenId: number, value: number) => {
        try {
            const result = await _contracts.get(chainId)!.buyNft(
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
            )
        } catch (e) {
            console.error(e.message)
        }
    }, [_contracts])

    return {
        ...swr,
        buyNft,
        buyNftWithMW,
        data: data || {} as Map<string, Nft[]>,
        mutate
    }
}