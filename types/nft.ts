export type Trait = "attack" | "helth" | "speed";

export type NftAttribute = {
    trait_type: Trait;
    value: string;
}

export type NftMeta ={
    name: string;
    description: string;
    image: string;
    attributes: NftAttribute[];

}