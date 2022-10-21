import {FileReq} from "@_types/nft";
import {NextApiRequest, NextApiResponse} from "next";
import {Session} from "next-iron-session";
import {addressCheckMiddleware, storeBlobOnNftStorage, storeMetadataWithBlob, withSession} from "./utils";


const keys = require("./../../keys.json");
export default withSession(async (
    req: NextApiRequest & { session: Session },
    res: NextApiResponse
) => {
    if (req.method === "POST") {
        const {
            bytes,
            fileName,
            contentType
        } = req.body as FileReq;

        if (!bytes || !fileName || !contentType) {
            return res.status(422).send({message: "Image data are missing"});
        }

        //await addressCheckMiddleware(req, res);
        const buffer = Buffer.from(Object.values(bytes));
        const token = await storeMetadataWithBlob(fileName, 'description', buffer,contentType)
        /*const token = await storeAsset(
            fileName,
            "hello",
            contentType,
            buffer)*/
        //const URI = await storeBlobOnNftStorage(contentType,buffer)
        //console.log(URI)
        console.log(`https://${token.ipnft}.ipfs.nftstorage.link`)
        console.log(`https://ipfs.io/ipfs/${token.ipnft}/metadata.json`)
        console.log(token)
        //https://bafkreifknnfrjaa23nlmwzd6xjo6ivgjse7v4q7ssvhekcmlwipsejunjy.ipfs.nftstorage.link/

        console.log(token)
        return res.status(200).send(token);
    } else {
        return res.status(422).send({message: "Invalid endpoint"});
    }
})