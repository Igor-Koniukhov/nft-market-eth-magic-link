

const instance = await NftMarket.deployed();

instance.mintToken("https://gateway.pinata.cloud/ipfs/QmaEZLYevGQ1d4v59ke7HaEe6TKd1BEwdiqceMuZraWnB2","500000000000000000",{value: "25000000000000000",from: accounts[0]})
instance.mintToken("https://gateway.pinata.cloud/ipfs/QmXb4HVXNnLKLox8hSLUBQLqrxqpXKrzZ5b5fB3TFfANyo","300000000000000000",{value: "25000000000000000",from: accounts[0]})