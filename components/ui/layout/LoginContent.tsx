import React from "react"

export default function LoginContent() {
    return (
        <div className="max-w-7xl mx-auto px-4 space-y-8 sm:px-6 lg:px-8 text-center">
            <div className="sm:text-center lg:text-center">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                    <span className="block xl:inline">Welcome to NftMarketPlace</span> <br/>

                    <span className="block text-indigo-600 xl:inline"> buy/create/sell Nft</span>
                </h1>
                <p className="mt-3
                text-center
                text-gray-500
                sm:mx-auto
                sm:mt-5 sm:max-w-xl
                sm:text-lg
                md:mt-5
                ">For getting started, please log in.</p>

            </div>
        </div>
    )
}