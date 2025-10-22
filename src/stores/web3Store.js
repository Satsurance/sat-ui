import { defineStore } from 'pinia';
import { createWalletClient, custom, createPublicClient, http } from 'viem';
import { SUPPORTED_NETWORKS, NETWORKS } from '../constants/contracts.js';
import { createConfig, regtest, connect, getBalance, AddressPurpose } from '@midl-xyz/midl-js-core';
import { getEVMAddress, midlRegtest } from '@midl-xyz/midl-js-executor';
import { leatherConnector, unisatConnector, phantomConnector, bitgetConnector, xverseConnector } from '@midl-xyz/midl-js-connectors';


export const useWeb3Store = defineStore('web3', {
    state: () => ({
        account: null,
        midlAccount: null,
        ethClient: null,
        midlConfig: null,
        chainId: null,
        isConnected: false,
    }),


    actions: {
        async connectWallet() {
            try {
                this.midlConfig = createConfig({
                    networks: [regtest],
                    connectors: [
                        unisatConnector(),
                        leatherConnector(),
                        phantomConnector(),
                        bitgetConnector(),
                        xverseConnector()
                    ],
                });

                const midlAccounts = await connect(this.midlConfig, {
                    purposes: [AddressPurpose.Ordinals],
                    network: regtest
                });
                this.midlAccount = midlAccounts[0];
                this.account = getEVMAddress(this.midlAccount, regtest);
                this.ethClient = createPublicClient({
                    chain: midlRegtest,
                    transport: http(SUPPORTED_NETWORKS[NETWORKS.MIDL_REGTEST].rpcUrls[0])
                });
                this.chainId = NETWORKS.MIDL_REGTEST;
                this.isConnected = true;
            } catch (error) {
                console.error('Error connecting wallet:', error);
                throw error;
            }
        },

        disconnect() {
            this.account = null;
            this.midlAccount = null;
            this.chainId = null;
            this.ethClient = null;
            this.midlConfig = null;
            this.isConnected = false;
        }
    }
});