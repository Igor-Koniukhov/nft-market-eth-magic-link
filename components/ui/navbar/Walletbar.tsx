/* eslint-disable @next/next/no-img-element */

import {Menu} from "@headlessui/react";
import Link from "next/link";
import {FunctionComponent, useEffect, useRef} from "react";
import {useWeb3} from "@providers/web3";
import jazzicon from "@metamask/jazzicon"

type WalletbarProps = {
    isLoading: boolean;
    isInstalled: boolean;
    account: string | undefined;
    connect: () => void;
}

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

const Walletbar: FunctionComponent<WalletbarProps> = (
    {
        isInstalled,
        isLoading,
        connect,
        account
    }) => {
    const {provider} = useWeb3();
    console.log(provider)

    const avatarRef = useRef()
    useEffect(() => {
        const element = avatarRef.current;
        if (element && account) {
            const addr = account.slice(2, 10);
            const seed = parseInt(addr, 16);
            const icon = jazzicon(32, seed); //generates a size 32 icon
            // @ts-ignore
            if (element.firstChild) {
                // @ts-ignore
                element.removeChild(element.firstChild);
            }
            // @ts-ignore
            element.appendChild(icon);
        }
    }, [account, avatarRef]);


    if (isLoading) {
        return (
            <div>

                <button
                    onClick={() => {
                    }}
                    type="button"
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Loading ...
                </button>
            </div>
        )
    }

    if (account) {

        return (
            <Menu as="div" className="ml-3 relative">
                <div>

                    <Menu.Button
                        className="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                        <span className="sr-only">Open user menu</span>
                        <div ref={avatarRef} className="h-8 w-8 rounded-full"></div>

                    </Menu.Button>
                </div>

                <Menu.Items
                    className="z-10 origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <Menu.Item>
                        {() => (
                            <button
                                disabled={true}
                                className="disabled:text-gray-500 text-xs block px-4 pt-2 text-gray-700">
                                {`0x${account[2]}${account[3]}${account[4]}....${account.slice(-4)}`}
                            </button>
                        )}
                    </Menu.Item>
                    <Menu.Item>
                        {({active}) => (
                            <Link href="/profile">
                                <a
                                    className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                                >
                                    Profile
                                </a>
                            </Link>

                        )}
                    </Menu.Item>
                </Menu.Items>
            </Menu>
        )
    }

    if (isInstalled) {
        return (
            <div>
                <button
                    onClick={() => {
                        connect()
                    }}
                    type="button"
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Connect Wallet
                </button>
            </div>
        )
    } else {
        return (
            <div>
                <button
                    onClick={() => {
                        window.open('https://metamask.io', '_ blank');
                    }}
                    type="button"
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    No Wallet
                </button>
            </div>
        )
    }
}

export default Walletbar;