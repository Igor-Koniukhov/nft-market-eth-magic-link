import { v4 as uuidv4 } from "uuid";
import { FileReq } from "@_types/nft";
import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-iron-session";
import { addressCheckMiddleware,tokenWeb3Storage, withSession } from "./utils";
import FormData from "form-data";
import { Web3Storage} from 'web3.storage';


export default withSession(async (
    req: NextApiRequest & {session: Session},
    res: NextApiResponse
) => {
    if (req.method === "POST") {
        const {
            bytes,
            fileName,
            contentType
        } = req.body as FileReq;
        console.log(req.body, " this is req body")

        if (!bytes || !fileName || !contentType) {
            return res.status(422).send({message: "Image data are missing"});
        }

        await addressCheckMiddleware(req, res);

        const buffer = Buffer.from(Object.values(bytes));
        const formData = new FormData();

        formData.append(
            "file",
            buffer, {
                contentType,
                filename: fileName + "-" + uuidv4()
            }
        );
        console.log(formData, " formData from verify-image")

        const storage = new Web3Storage({tokenWeb3Storage} )

        console.log(`Uploading ${formData} `)
        // @ts-ignore
        const cid = await storage.put(formData)
        console.log('Content added with CID:', cid)
        let uri = ` https://dweb.link/ipfs/${cid}`
        console.log('Ref:', uri)


        return res.status(200).send(uri);
    } else {
        return res.status(422).send({message: "Invalid endpoint"});
    }
})