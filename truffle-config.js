const AccountIndex = 0;

require("dotenv").config({path: "./.env.development"});

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
        }
    },
    compilers: {
        solc: {
            version: "0.8.1"

        }
    }

};
