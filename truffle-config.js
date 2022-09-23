const AccountIndex = 0;

require("dotenv").config({path: "./.env.development"});
const keys = require("./keys.json");

const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {
    contracts_build_directory: "./public/contracts",
    networks: {
        development: {
            host: "127.0.0.1",
            port: 7545,
            network_id: "*"
        },
        ganache_local: {
            provider: function() {
                return new HDWalletProvider(process.env.MNEMONIC, "http://127.0.0.1:7545", AccountIndex)
            },
            network_id: 1337
        },
        ropsten: {
            provider: function() {
                return new HDWalletProvider(
                    keys.PRIVATE_KEY_ROPSTEN,
                    keys.INFURA_ROPSTEN_URL
                )
            },
            network_id: 3,
            gas: 5500000,
            gasPrice: 20000000000,
            confirmations: 2,
            timeoutBlocks: 200
        }
    },
    compilers: {
        solc: {
            version: "0.8.1"

        }
    }

};
