import {Session, withIronSession} from "next-iron-session"
import * as util from "ethereumjs-util"
import {NextApiRequest, NextApiResponse} from "next"
export const pinataApiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY as string;
export const pinataSecretApiKey = process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY as string;



export function withSession(handler: any) {
    return withIronSession(handler, {
        password: process.env.SECRET_COOKIE_PASSWORD as string,
        cookieName: "nft-auth-session",
        cookieOptions: {
            secure: process.env.NODE_ENV === "production",
            sameSite: false,
        }
    })
}


export const addressCheckMiddleware = async (
    req: NextApiRequest & { session: Session },
    res: NextApiResponse) => {

    return new Promise((resolve, reject) => {
        const message = req.session.get("message-session")

        let nonce: string | Buffer =
            "\x19Ethereum Signed Message:\n" +
            JSON.stringify(message).length +
            JSON.stringify(message)

        nonce = util.keccak(Buffer.from(nonce, "utf-8"))

        const {v, r, s} = util.fromRpcSig(req.body.signature)

        const pubKey = util.ecrecover(util.toBuffer(nonce), v, r, s)
        const addrBuffer = util.pubToAddress(pubKey)
        const address = util.bufferToHex(addrBuffer)


        if (address === req.body.address.toLowerCase()) {
            resolve("Correct Address")
        } else {
            reject("Cannot resolve Address")
        }
    })
}
