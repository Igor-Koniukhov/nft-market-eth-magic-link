import {ethers} from "ethers";
import {Session, withIronSession} from "next-iron-session";
import * as util from "ethereumjs-util";
import contract from "../../public/contracts/NftMarket.json";
import {NextApiRequest, NextApiResponse} from "next";
import {NftMarketContract} from "@_types/nftMarketContract";
import {Blob, NFTStorage, File} from "nft.storage";
import * as fs from "fs";

const NETWORKS = {
    "1337": "Ganache",
    "5": "Goerly"
}

type NETWORK = typeof NETWORKS;
const abi = contract.abi;
const targetNetwork = process.env.NEXT_PUBLIC_NETWORK_ID as keyof NETWORK;
export const contractAddress = contract["networks"][targetNetwork]["address"];
export const pinataApiKey = process.env.PINATA_API_KEY as string;
export const pinataSecretApiKey = process.env.PINATA_SECRET_API_KEY as string;

export function withSession(handler: any) {
    return withIronSession(handler, {
        password: process.env.SECRET_COOKIE_PASSWORD as string,
        cookieName: "nft-auth-session",
        cookieOptions: {
            secure: process.env.NODE_ENV === "production"
        }
    })
}

const url = process.env.NODE_ENV === "production" ?
    process.env.INFURA_ROPSTEN_URL :
    "http://127.0.0.1:7545"

export const addressCheckMiddleware = async (
    req: NextApiRequest & { session: Session },
    res: NextApiResponse) => {

    return new Promise((resolve, reject) => {
        const message = req.session.get("message-session");

        //could get access to server side, in our case ganache - http://127.0.0.1:7545
        const provider = new ethers.providers.JsonRpcProvider(url);
        //getting contract on server (TODO: contract for adding white/black list)
        const contract = new ethers.Contract(
            contractAddress,
            abi,
            provider
        ) as unknown as NftMarketContract;

        let nonce: string | Buffer =
            "\x19Ethereum Signed Message:\n" +
            JSON.stringify(message).length +
            JSON.stringify(message);

        nonce = util.keccak(Buffer.from(nonce, "utf-8"))

        const {v, r, s} = util.fromRpcSig(req.body.signature);
        const pubKey = util.ecrecover(util.toBuffer(nonce), v, r, s);

        const addrBuffer = util.pubToAddress(pubKey);
        const address = util.bufferToHex(addrBuffer);

        if (address === req.body.address) {
            resolve("Correct Address");
        } else {
            reject("Cannot resolve Address")
        }
    })
}
const keys = require("./../../keys.json");
export const storeBlobOnNftStorage = async (contentType, buffer) => {
    let image = new Blob([buffer], { type: contentType});
    const client = new NFTStorage({token: keys.NFT_STORAGE_KEY})
    const CID = await client.storeBlob(image)
    return  `https://${CID}.ipfs.nftstorage.link`
}

 async function getStoredImage() {
    const imageOriginUrl ="https://user-images.githubusercontent.com/87873179/144324736-3f09a98e-f5aa-4199-a874-13583bf31951.jpg"
    const r = await fetch(imageOriginUrl)
    if (!r.ok) {
        throw new Error(`error fetching image: [statusCode]: ${r.status}`)
    }
    return r.blob()
}
export const storeMetadata = async (
    name,
    description,

    attributes) => {

    //let image = new Blob([buffer], { type: contentType});
    let image = await getStoredImage()
    console.log(image, " from storeMeta getStoreImage")

    const client = new NFTStorage({token: keys.NFT_STORAGE_KEY})
    const metadata = await client.store({
        name,
        description,
        image,
        attributes

    })
    console.log(metadata)
    return metadata
}

export const storeMetadataWithFile = async (
    name,
    description,
    url,
   ) => {
    const client = new NFTStorage({token: keys.NFT_STORAGE_KEY})
    const metadata = await client.store({
        name,
        description,
        image: new File(
            [await fs.promises.readFile(url)],
            `${name}Photo.png`,
            { type: 'image/png' }
        ),


    })
    console.log(metadata)
    return metadata
}

export const storeMetadataWithBlob = async (
    name,
    description,
    buffer,
    contentType,
    ) => {
    let image = new Blob([buffer], { type: contentType});
    const client = new NFTStorage({token: keys.NFT_STORAGE_KEY})
    const metadata = await client.store({
        name,
        description,
        image,

    })
    console.log(metadata)
    return metadata
}
