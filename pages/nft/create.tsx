/* eslint-disable @next/next/no-img-element */

import type {NextPage} from 'next';
import { useRouter } from 'next/router';
import {ChangeEvent, useState} from 'react';
import {BaseLayout} from '@ui'
import Link from 'next/link'
import {NftMeta, PinataRes} from '@_types/nft';
import axios from 'axios';
import {useWeb3} from '@providers/web3';
import {ethers} from "ethers";
import {toast} from "react-toastify";
import {useNetwork} from "@hooks/web3";
import {ExclamationIcon} from "@heroicons/react/solid";
import {useSelector} from "react-redux";
import {selectNetworkId} from "../../store/slices/networkSlice";

const ALLOWED_FIELDS = ["name", "description", "image", "attributes"];

const NftCreate: NextPage = () => {
    const router = useRouter();
    const { provider, contract} = useWeb3();
    const {network} = useNetwork();
    const [nftURI, setNftURI] = useState("");
    const [price, setPrice] = useState("");
    const [hasURI, setHasURI] = useState(false);
    const networkId = useSelector(selectNetworkId)
    const [nftMeta, setNftMeta] = useState<NftMeta>({
        name: "",
        description: "",
        image: "",
        attributes: [
            {trait_type: "fury", value: "0"},
            {trait_type: "scary", value: "0"}
        ]
    });

    const getSignedData = async () => {
        const messageToSign = await axios.get(`/api/verify`,{ params: {id: networkId as string}});
        const account = await provider.getSigner().getAddress();
        const signedData = await provider.send(
            "personal_sign",
            [JSON.stringify(messageToSign.data), account, messageToSign.data.id])

        return {signedData, account};
    }

    const handleImage = async (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) {
            console.error("Select a file");
            return;
        }

        const file = e.target.files[0];
        const buffer = await file.arrayBuffer();
        const bytes = new Uint8Array(buffer);

        try {
            const {signedData, account} = await getSignedData();
            const promise = axios.post("/api/verify-image", {
                address: account,
                signature: signedData,
                bytes,
                contentType: file.type,
                fileName: file.name.replace(/\.[^/.]+$/, "")
            });

            const res = await toast.promise(
                promise, {
                    pending: "Uploading image",
                    success: "Image uploaded",
                    error: "Image upload error"
                }
            )

            const data = res.data as PinataRes;

            setNftMeta({
                ...nftMeta,
                image: `${process.env.NEXT_PUBLIC_PINATA_DOMAIN}/ipfs/${data.IpfsHash}`
            });
        } catch (e: any) {
            console.error(e.message);
        }
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setNftMeta({...nftMeta, [name]: value});
    }

    const handleAttributeChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        const attributeIdx = nftMeta.attributes.findIndex(attr => attr.trait_type === name);

        nftMeta.attributes[attributeIdx].value = value;
        setNftMeta({
            ...nftMeta,
            attributes: nftMeta.attributes
        })
    }

    const uploadMetadata = async () => {
        try {
            const {signedData, account} = await getSignedData();

            const promise = axios.post("/api/verify", {
                address: account,
                signature: signedData,
                nft: nftMeta,
            })

            const res = await toast.promise(
                promise, {
                    pending: "Uploading metadata",
                    success: "Metadata uploaded",
                    error: "Metadata upload error"
                }
            )
            const data = res.data as PinataRes;
            setNftURI(`${process.env.NEXT_PUBLIC_PINATA_DOMAIN}/ipfs/${data.IpfsHash}`);
        } catch (e: any) {
            console.error(e.message, " Something wrong with uploading metadata");
        }
    }

    const createNft = async () => {

        try {

            const tx = await contract?.mintToken(
                nftURI,
                ethers.utils.parseEther(price), {
                    value: ethers.utils.parseEther(0.025.toString())
                }
            );
            await toast.promise(
                tx!.wait(), {
                    pending: "Minting Nft",
                    success: "Nft has been created",
                    error: "Metadata upload error"
                }
            )
            router.push('/')


        } catch (e: any) {
            console.error(e.message, " Something wrong with minting Nft");
        }
    }
    if (!network.isConnectedToNetwork) {
        return (
            <BaseLayout>
                <div className="rounded-md bg-yellow-50 p-4 mt-10">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <ExclamationIcon className="h-5 w-5 text-yellow-400" aria-hidden="true"/>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-yellow-800">Attention needed</h3>
                            <div className="mt-2 text-sm text-yellow-700">
                                <p>
                                    {network.isLoading ?
                                        "Loading..." :
                                        `Connect to ${network.targetNetwork}`
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </BaseLayout>
        )
    }

    return (
        <BaseLayout>
            <div>
                {(nftURI || hasURI) ?
                    <div className="md:grid md:grid-cols-3 md:gap-6">
                        <div className="md:col-span-1">
                            <div className="px-4 sm:px-0">
                                <h3 className="text-lg font-medium leading-6 text-gray-900">List NFT on Pinata</h3>
                                <img src="/images/pinata.png" alt="Pinata image" height="70"/>
                            </div>
                        </div>
                        <div className="mt-5 md:mt-0 md:col-span-2">
                            <form>
                                <div className="shadow sm:rounded-md sm:overflow-hidden">
                                    {hasURI &&
                                        <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                                            <div>
                                                <label htmlFor="uri"
                                                       className="block text-sm font-medium text-gray-700">
                                                    URI Link
                                                </label>
                                                <div className="mt-1 flex rounded-md shadow-sm">
                                                    <input
                                                        onChange={(e) => setNftURI(e.target.value)}
                                                        type="text"
                                                        name="uri"
                                                        id="uri"
                                                        className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                                                        placeholder="http://link.com/data.json"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    }
                                    {nftURI &&
                                        <div className='mb-4 p-4'>
                                            <div className="font-bold">Your metadata:</div>
                                            <div>
                                                <Link href={nftURI} legacyBehavior>
                                                    <a className="underline text-indigo-600">
                                                        {nftURI}
                                                    </a>
                                                </Link>
                                            </div>
                                        </div>
                                    }
                                    <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                                        <div>
                                            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                                                Set you price (ETH)
                                            </label>
                                            <div className="mt-1 flex rounded-md shadow-sm">
                                                <input
                                                    onChange={(e) => setPrice(e.target.value)}
                                                    value={price}
                                                    type="number"
                                                    name="price"
                                                    id="price"
                                                    className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                                                    placeholder="0.8"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                                        <button
                                            onClick={createNft}
                                            type="button"
                                            className="inline-flex
                                             justify-center
                                             py-2 px-4 border
                                             border-transparent
                                             shadow-sm text-sm
                                             font-medium rounded-md
                                             text-white bg-yellow-600
                                             hover:bg-yellow-700
                                             focus:outline-none
                                             focus:ring-2
                                             focus:ring-offset-2
                                             focus:ring-indigo-500"
                                        >
                                            Mint Nft
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    :
                    <div>

                        <div className="block mx-auto mt-5 md:mt-0 md:col-span-2 max-w-2xl">
                            <div>
                                <div className="px-4 sm:px-0">
                                    <h3 className="text-lg font-medium leading-6 text-gray-900 text-center">Create NFT
                                        Metadata <a href="https://www.pinata.cloud/" target="_blank" rel="noreferrer">Pinata</a></h3>
                                    <p className="mt-1 text-sm text-gray-600 text-center">
                                        This information will be displayed publicly so be careful what you share.
                                    </p>
                                </div>
                            </div>

                            <form>
                                <div className="shadow sm:rounded-md sm:overflow-hidden">
                                    <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                                Name
                                            </label>
                                            <div className="mt-1 flex rounded-md shadow-sm">
                                                <input
                                                    value={nftMeta.name}
                                                    onChange={handleChange}
                                                    type="text"
                                                    name="name"
                                                    id="name"
                                                    className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                                                    placeholder="My Nice NFT"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label htmlFor="description"
                                                   className="block text-sm font-medium text-gray-700">
                                                Description
                                            </label>
                                            <div className="mt-1">
                      <textarea
                          value={nftMeta.description}
                          onChange={handleChange}
                          id="description"
                          name="description"
                          rows={3}
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                          placeholder="Please enter brief nft description..."
                      />
                                            </div>
                                        </div>

                                        {nftMeta.image ?
                                            <img src={nftMeta.image as string} alt="" className="h-40 block mx-auto"/> :
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Image</label>
                                                <div
                                                    className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                                    <div className="space-y-1 text-center">
                                                        <svg
                                                            className="mx-auto h-12 w-12 text-gray-400"
                                                            stroke="currentColor"
                                                            fill="none"
                                                            viewBox="0 0 48 48"
                                                            aria-hidden="true"
                                                        >
                                                            <path
                                                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                                                strokeWidth={2}
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                        </svg>
                                                        <div className="flex text-sm text-gray-600">
                                                            <label
                                                                htmlFor="file-upload"
                                                                className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                                                            >
                                                                <span>Upload a file</span>
                                                                <input
                                                                    onChange={handleImage}
                                                                    id="file-upload"
                                                                    name="file-upload"
                                                                    type="file"
                                                                    className="sr-only"
                                                                />
                                                            </label>
                                                            <p className="pl-1">or drag and drop</p>
                                                        </div>
                                                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to
                                                            10MB</p>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                        <div className="grid grid-cols-6 gap-6">
                                            {nftMeta.attributes.map(attribute =>
                                                <div key={attribute.trait_type}
                                                     className="col-span-6 sm:col-span-6 lg:col-span-2">
                                                    <label htmlFor={attribute.trait_type}
                                                           className="block text-sm font-medium text-gray-700">
                                                        {attribute.trait_type}
                                                    </label>
                                                    <input
                                                        onChange={handleAttributeChange}
                                                        value={attribute.value}
                                                        type="text"
                                                        name={attribute.trait_type}
                                                        id={attribute.trait_type}
                                                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-sm !mt-2 text-gray-500">
                                            Choose value from 0 to 100
                                        </p>
                                    </div>
                                    <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                                        <button
                                            onClick={uploadMetadata}
                                            type="button"
                                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            Create URI
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                }
            </div>
        </BaseLayout>
    )
}

export default NftCreate