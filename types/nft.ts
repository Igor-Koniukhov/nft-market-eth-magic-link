export type Trait = "fury" | "scary";

export type NftAttribute = {
    trait_type: Trait;
    value: string;
}

export type NftMeta = {
    name: string;
    description: string;
    image: string | Blob | File;
    attributes: NftAttribute[];
}

export type NftCore = {
    tokenId: number;
    price: number;
    creator: string;
    isListed: boolean
}

export type Nft = {
    meta: NftMeta
} & NftCore

export type FileReq = {
    bytes: Uint8Array;
    fileName: string;
    contentType: string;
}

export type PinataRes = {
    IpfsHash: string;
    PinSize: number;
    Timestamp: string;
    isDuplicate: boolean;
}

