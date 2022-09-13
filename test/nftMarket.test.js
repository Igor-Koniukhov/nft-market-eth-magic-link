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

})
