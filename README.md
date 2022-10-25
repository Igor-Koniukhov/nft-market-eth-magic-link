## Getting Started
### For getting started, good enough to follow the next commands and recommendations. Below are described technologies used in the project:

```bash
npm install
```
## Set up all necessary env keys (refs on the necessary sources you could find in the description of the used technologies)
See examples in .env.development.examples and .env.production.examples.
Run the development server:

```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


## Project was realized with next technologies:

### Building frontend part of the app:
- [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).
- [Magic.link](https://magic.link/) - is a developer SDK that integrates with your application to enable passwordless Web3 onboarding (no seed phrases) and authentication using magic links.
  In that project used [Magic Connect](https://magic.link/connect) - Magic Connect is a fully-featured, global web3 wallet.
- [SWR React Hooks for Data Fetching](https://swr.vercel.app/). With SWR components will get a stream of data updates constantly and automatically.
  And the UI will be always fast and reactive. The name “SWR” is derived from stale-while-revalidate, a HTTP cache invalidation strategy popularized by HTTP RFC 5861.
- SWR is a strategy to first return the data from cache (stale), then send the fetch request (revalidate), and finally come with the up-to-date data. SSR / SSG Ready.

### Building and managing smart contract;
- [OpenZeppelin](https://docs.openzeppelin.com/contracts/4.x/) used as main base and framework for building smart contract;
```
npm i @openzeppelin/contracts
```
- [Abi-types-generator](https://github.com/joshstevens19/ethereum-abi-types-generator) - Very useful CLI tool which allows 
you to convert an ABI json file into fully loaded interfaces types.
The idea was to not have to make the developer wrap any kind of web3 or ethers instance or use a new tool to get this
working but with a simple 1 line change you can use all the same libraries interfaces as what the developer is use
to but with types auto-generated for you to bring back compile-time errors on any contract calls with super ease.
Specify the path of the abi and put it in your package.json (see in the example).
- [Truffle](https://trufflesuite.com/docs/truffle/) used as framework for compilation, deployment and binary management of the smart contract.
For the installation truffle in project:
```
 npm install -g truffle 
```
For initiation: 
```
truffle init
```
Main command for deploying and redeploying:
```
truffle migrate --network <your network>
truffle migrate --network <your network> --reset
```
For contract binary management:
```
truffle console
```

- [Ganache](https://trufflesuite.com/docs/ganache/) is a personal(private) blockchain for rapid Ethereum and Corda distributed application development.
  Download and setup. Create new workspace and in settings specify the path to the truffle-config.js.

### Blockchain platforms and storages for saving metadata and deploying smart-contract 
- [Pinata](https://app.pinata.cloud/) for saving (pinning) on blockchain images (jpg, png) and metadata
- (json which include information about picture):
```
{
        name: "",
        description: "",
        image: "URI from pinata.cloud",
        attributes: [
            {trait_type: "fury", value: "0"},
            {trait_type: "scary", value: "0"}
        ]
    }
```
- [Infura](https://infura.io/) blockchain for deploying smart-contract (used Goerli testnet) and saving URI after minting (NFT) on app.
- [Vercel](https://vercel.com/) for deploying front-end part of the project. Register on versel.com, choose your project in git repo, 
and upload all necessary keys for the project on versel. See example .env.production.example.
  ![alt text](https://github.com/Igor-Koniukhov/nft-market-eth-magic-link/blob/develop/public/images/scheme-nft-creation.png?raw=true)


## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
