/* eslint-disable @next/next/no-img-element */
import {Disclosure} from "@headlessui/react";
import {MenuIcon, XIcon} from "@heroicons/react/outline";
import {ActiveLink} from "..";
import {useAccount, useNetwork} from "@hooks/web3";
import Walletbar from "./Walletbar";
import {NETWORKS} from "@_types/hooks";
import {useState} from "react";


const navigation = [
    {name: "Marketplace", href: "/", current: true},
    {name: "Create (Pinata)", href: "/nft/create", current: false},
];

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");}

export default function Navbar({magicWallet}:any) {
    const {account} = useAccount();
    const {network} = useNetwork();
    const {targetNetwork} = network
    const [networkNameState, setNetworkName] = useState("Goerli Test Network")

    const handleChangeNetwork = (e) => {
        console.log(e.target.value, )
        setNetworkName(e.target.selectedOptions[0].text);

    }

    // @ts-ignore
    return (
        <Disclosure as="nav" className="bg-gray-800">
            {({open}) => (
                <>
                    <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
                        <div className="relative flex items-center justify-between h-16">
                            <div className="flex-shrink-0 flex items-center">
                                <img
                                    className="hidden lg:block h-10 w-auto"
                                    src="/images/page_logo.png"
                                    alt="Workflow"
                                />
                            </div>

                            <label htmlFor="net-select">NETWORKS: </label>
                            <br/>
                            <select id="net-select" onChange={handleChangeNetwork}>
                                {Object.entries(NETWORKS).map((value, index) =>
                                    <option
                                        key={index}
                                        value={value[0]}
                                       // selected={targetNetwork === value[1] ? true : false}

                                    >{value[1]}</option>
                                )}
                            </select>

                            {!magicWallet.isLogin &&
                                <button type="button" className="text-white ml-auto p-2" onClick={() => {
                                    magicWallet.login(networkNameState)
                                }}>
                                    login
                                </button>}

                            {
                                magicWallet.isLogin &&
                                <>
                                    <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                                        {/* Mobile menu button*/}
                                        <Disclosure.Button
                                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                                            <span className="sr-only">Open main menu</span>
                                            {open ? (
                                                <XIcon className="block h-6 w-6" aria-hidden="true"/>
                                            ) : (
                                                <MenuIcon className="block h-6 w-6" aria-hidden="true"/>
                                            )}
                                        </Disclosure.Button>
                                    </div>
                                    <div
                                        className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">

                                        <div className="hidden sm:block sm:ml-6">
                                            <div className="flex space-x-4">
                                                {navigation.map((item) => (
                                                    <ActiveLink
                                                        key={item.name}
                                                        href={item.href}
                                                        activeClass="bg-gray-900 text-white"
                                                    >
                                                        <a
                                                            className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                                            aria-current={item.current ? 'page' : undefined}
                                                        >
                                                            {item.name}
                                                        </a>
                                                    </ActiveLink>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">

                                        <button type="button" className="text-white" onClick={() => {
                                            magicWallet.disconnect();
                                        }}>
                                            logout
                                        </button>
                                        <Walletbar
                                            isInstalled={account.isInstalled}
                                            isLoading={account.isLoading}
                                            account={account.data}
                                        />
                                        <div className="text-gray-300 self-center ml-2">
                  <span
                      className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-yellow-100 text-yellow-800">
                    <svg className="-ml-0.5 mr-1.5 h-2 w-2 text-yellow-400" fill="currentColor" viewBox="0 0 8 8">
                      <circle cx={4} cy={4} r={3}/>
                    </svg>
                      <button

                          onClick={() => {
                              window.open('https://metamask.io', '_ blank');
                          }}>
                          {network.isLoading ?
                              "..." :
                              account.isInstalled ?
                                  network.data :
                                  "<- Install "
                          }
                      </button>
                  </span>
                                        </div>

                                    </div>
                                </>
                            }
                        </div>
                    </div>

                    <Disclosure.Panel className="sm:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            {navigation.map((item) => (
                                <Disclosure.Button
                                    key={item.name}
                                    as="a"
                                    href={item.href}
                                    className={classNames(
                                        item.current
                                            ? "bg-gray-900 text-white"
                                            : "text-gray-300 hover:bg-gray-700 hover:text-white",
                                        "block px-3 py-2 rounded-md text-base font-medium"
                                    )}
                                    aria-current={item.current ? "page" : undefined}
                                >
                                    {item.name}
                                </Disclosure.Button>
                            ))}
                        </div>
                    </Disclosure.Panel>
                </>
            )}
        </Disclosure>
    );
}
