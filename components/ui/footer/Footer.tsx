export default function Footer() {
    return (
        <div className="bg-dark text-secondary px-4 py-5 text-center">
            <div className="py-5">


                <div className=" flex items-center justify-content-center">

                    <img
                        className="hidden lg:block h-10 "
                        src="/images/page_logo.png"
                        alt="Workflow"
                    />
                    <h1 className="display-5 fw-bold text-white">NFT Market Place</h1>

                </div>
                <div className="col-lg-6 mx-auto">

                    <p className="fs-5 mb-4">If you want to create your own NFTs, the NFT Marketplace is a great
                        place to start. You can quickly mint NFTs and create your own collections directly on Ethereum
                        (ETH). Create, Sale and Buy Nft! Get unlimited ownership forever! </p>

                </div>
            </div>
        </div>)
}