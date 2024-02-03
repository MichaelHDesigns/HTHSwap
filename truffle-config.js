// SPDX-License-Identifier: MIT
require('babel-register');
require('babel-polyfill');

const HDWalletProvider = require('@truffle/hdwallet-provider');

const privateKey = 'c809944771d9888057be4cab9562db0d0d88127110397b416eb0ffee84797dd3';

module.exports = {
  networks: {
    development: {
      provider: function () {
        return new HDWalletProvider({
          privateKeys: [privateKey],
          providerOrUrl: 'http://154.12.237.243:7118',
        });
      },
      network_id: '*',
    },
  },
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
  compilers: {
    solc: {
      versions: [
        "0.5.0",
        "0.5.1",
        // ... add all the versions in the range up to 0.8.20
        "0.8.19",
        "0.8.20"
      ],
      optimizer: {
        enabled: true,
        runs: 200,
      },
      evmVersion: 'istanbul',
    },
  },
};
