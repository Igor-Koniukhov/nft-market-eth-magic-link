const NftMarket = artifacts.require("NftMarket");
const {ethers} = require("ethers");

contract("NftMarket", accounts => {
    let _contract = null;
    let _nftPrice = ethers.utils.parseEther("0.3").toString();
    let _listingPrice = ethers.utils.parseEther("0.025").toString();

    before(async () => {
        _contract = await NftMarket.deployed();
    })

    describe("Mint token", () => {
        const tokenURI = "https://test.com"
        before(async () => {
            await _contract.mintToken(tokenURI, _nftPrice, {
                from: accounts[0],
                value: _listingPrice
            })
        })

        it("owner of the first token should be address[0]", async () => {
            const owner = await _contract.ownerOf(1);
            //assert(owner=="0x642D7369cf8Cb5deDE7e7e5bfd79b0d6547ec2dB", "Mismatch owner of token with address[0]");
            assert.equal(owner, accounts[0], "Owner of token is not matching address[0]");
        })
        it("first token should point to the correct tokenURI", async () => {
            const actualTokenURI = await _contract.tokenURI(1);

            assert.equal(actualTokenURI, tokenURI, "Not correctly set tokenURI");
        })

        it("can't create a NFT with used tokenURI", async () => {
            try {
                await _contract.mintToken(tokenURI, _nftPrice, {
                    from: accounts[0]
                })
            } catch (error) {
                assert(error, "Do not possible mint NFT with used tokenURI");
            }

        })
        it("should have one listed item", async () => {
            const listedItem = await _contract.listedItemsCount()

            assert.equal(listedItem.toNumber(), 1, "ListedItem should be 1");
        })
        it("should have create NFT item", async () => {
            const NftItem = await _contract.getNftItem(1);

            assert.equal(NftItem.tokenId, 1, "TokenId should be 1");
            assert.equal(NftItem.price, _nftPrice, "Price should be 0.3 ether");
            assert.equal(NftItem.creator, accounts[0], "Createor should be account[0]");
            assert.equal(NftItem.isListed, true, "Token is not listed");
        })

    })

    describe("Buy NFT", () => {
        before(async () => {
            await _contract.buyNft(1, {
                from: accounts[1],
                value: _nftPrice
            })
        })

        it("should unlist the item", async () => {
            const listedItem = await _contract.getNftItem(1);
            assert.equal(listedItem.isListed, false, "Item is still listed");
        })
        it("should decrease listed items count", async () => {
            const listedItemsCount = await _contract.listedItemsCount();
            assert.equal(listedItemsCount.toNumber(), 0, "Count has not been decrement");
        })
        it("should change the owner", async () => {
            const currentOwner = await _contract.ownerOf(1);
            assert.equal(currentOwner, accounts[1], "Item is still listed");
        })

    })
    describe("Token transfers", ()=>{
                const tokenURI = "https://test-2.com";
        before(async ()=>{
            await _contract.mintToken(tokenURI, _nftPrice, {
                from: accounts[0],
                value: _listingPrice
            })

        })
        it("should have two NFTs created", async () => {
            const totalSupply = await _contract.totalSupply();
            assert.equal(totalSupply.toNumber(), 2, "Total supply of token don't match to expectation.");
        })
        it("should able to retrieve nft by index", async () => {
            const nftId1 = await _contract.tokenByIndex(0);
            const nftId2 = await _contract.tokenByIndex(1);
            assert.equal(nftId1.toNumber(), 1, "Nft id is wrong");
            assert.equal(nftId2.toNumber(), 2, "Nft id is wrong");
        })
        it("should have one listed NFT", async () => {
            const allNfts = await _contract.getAllNftsOnSale();

            assert.equal(allNfts[0].tokenId, 2, "Nft has a wrong id");
        })
        it("account[1] should have one owned NFT", async () => {
            const ownedNfts = await _contract.getOwnedNfts({from: accounts[1]});

            assert.equal(ownedNfts[0].tokenId, 1, "Nft has a wrong id");
        })
        it("account[0] should have one owned NFT", async () => {
            const ownedNfts = await _contract.getOwnedNfts({from: accounts[0]});
            assert.equal(ownedNfts[0].tokenId, 2, "Nft has a wrong id");
        })

    })
    describe("Token transfer to new owner", () => {
        before(async () => {
            await _contract.transferFrom(
                accounts[0],
                accounts[1],
                2
            )
        })

        it("accounts[0] should own 0 tokens", async () => {
            const ownedNfts = await _contract.getOwnedNfts({from: accounts[0]});
            assert.equal(ownedNfts.length, 0, "Invalid length of tokens");
        })

        it("accounts[1] should own 2 tokens", async () => {
            const ownedNfts = await _contract.getOwnedNfts({from: accounts[1]});
            assert.equal(ownedNfts.length, 2, "Invalid length of tokens");
        })
    })



})
