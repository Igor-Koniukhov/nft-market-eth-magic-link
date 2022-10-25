## Project was realized with next technologies:

- [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).
- [Magic.link](https://magic.link/) - is a developer SDK that integrates with your application to enable passwordless Web3 onboarding (no seed phrases) and authentication using magic links.
 in that project used [Magic Connect](https://magic.link/connect) - Magic Connect is a fully-featured, global web3 wallet.
- [Pinata](https://app.pinata.cloud/) for saving (pinning) on blockchain images (jpg, png) and metadata (json which include information about picture)
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
- [Infura](https://infura.io/) blockchain for deploying smart-contract (used Goerli testnet)
- [Vercel](https://vercel.com/) for deploying front-end part of the project. Register on versel.com, choose your project in git repo, 
and upload all necessary keys for the project on versel. See example .env.production.example.
  ![alt text](https://github.com/Igor-Koniukhov/nft-market-eth-magic-link/blob/develop/public/images/scheme-nft-creation.jpg?raw=true)
## Getting Started
```bash
npm install
```
## Set up all necessary env key
See examples in .env.development.examples and .env.production.examples.
Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/Footer.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
