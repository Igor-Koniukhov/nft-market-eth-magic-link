import {v4 as uuidv4} from "uuid";
import {Session} from "next-iron-session";
import {NextApiRequest, NextApiResponse} from "next";
import {
    addressCheckMiddleware,
    contractAddress,
    storeMetadataWithFile,
    withSession
} from "./utils";
import {NftMeta} from "@_types/nft";

export default withSession(async (req: NextApiRequest & { session: Session }, res: NextApiResponse) => {
    if (req.method === "POST") {
        try {
            const {body} = req;
            const nft = body.nft as NftMeta
            const{imgPath}=body;

            if (!nft.name || !nft.description || !nft.attributes) {
                return res.status(422).send("All fields of the form should be filed!")
            }
            await addressCheckMiddleware(req, res);

         const data = await  storeMetadataWithFile(nft.name, nft.description, imgPath)

            console.log(data, " data from nft storage")
            return res.status(200).send(data);
        } catch {
            return res.status(422).send({message: "Cannot create JSON"})
        }

    } else if (req.method === "GET") {
        try {
            const message = {contractAddress, id: uuidv4()};
            req.session.set("message-session", message);
            await req.session.save();

            return res.json(message);
        } catch {
            return res.status(422).send({message: "Cannot generate a message!"});
        }
    } else {
        return res.status(200).json({message: "Invalid api route"});
    }
})