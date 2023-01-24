import {CryptoHookFactory} from "@_types/hooks"
import {Nft} from "@_types/nft"
import {ethers} from "ethers"
import {useCallback} from "react"
import {toast} from "react-toastify"
import useSWR from "swr"
import {NftMarketContract} from "@_types/nftMarketContract";


type UseOwnedNftsResponse = {
    listNft: (chainId: string, tokenId: number, price: number) => Promise<void>
}
type OwnedNftsHookFactory = CryptoHookFactory<Map<string, Nft[]>, UseOwnedNftsResponse>

export type UseOwnedNftsHook = ReturnType<OwnedNftsHookFactory>

export const hookFactory: OwnedNftsHookFactory = ({contracts, id}) => () => {
    const {data, ...swr} = useSWR(
        contracts ? "web3/useOwnedNfts" : {} as Map<string, NftMarketContract>,
        async () => {
            const nfts = [] as Nft[]
            const nftsMap = new Map<string, Nft[]>()

                const contract = await contracts.get(id)
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
                    nftsMap.set(id, nfts)
                }




            return nftsMap
        }
    )

    const _contracts = contracts
    const listNft = useCallback(async (chainId: string, tokenId: number, price: number) => {
        try {
            const result = await _contracts.get(chainId)!.placeNftOnSale(
                tokenId,
                ethers.utils.parseEther(price.toString()),
                {
                    value: ethers.utils.parseEther(0.025.toString())
                }
            )
            await toast.promise(
                result!.wait(), {
                    pending: "Processing transaction",
                    success: "Item has been listed",
                    error: "Processing error"
                }
            )

        } catch (e) {
            console.error(e.message, "from usedOwnedNfts")
        }
    }, [_contracts])

    return {
        ...swr,
        listNft,
        data: data || {} as Map<string, Nft[]>,
    }
}