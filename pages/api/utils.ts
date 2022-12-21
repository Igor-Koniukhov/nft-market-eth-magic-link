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



export const addressCheckMiddleware = async (
    req: NextApiRequest & { session: Session },
    res: NextApiResponse) => {

    return new Promise((resolve, reject) => {
        const message = req.session.get("message-session");

        let nonce: string | Buffer =
            "\x19Ethereum Signed Message:\n" +
            JSON.stringify(message).length +
            JSON.stringify(message);

        nonce = util.keccak(Buffer.from(nonce, "utf-8"))

        const {v, r, s} = util.fromRpcSig(req.body.signature);

        const pubKey = util.ecrecover(util.toBuffer(nonce), v, r, s);


        const addrBuffer = util.pubToAddress(pubKey);
        const address = util.bufferToHex(addrBuffer);

        console.log(address, " address")
        console.log(req.body.address.toLowerCase(), " address from body req")


        if (address === req.body.address.toLowerCase()) {
            resolve("Correct Address");
        } else {
            reject("Cannot resolve Address")
        }
    })
}
