import { defineStore } from 'pinia';
import { createWalletClient, custom, createPublicClient, http } from 'viem';
import { SUPPORTED_NETWORKS } from '../constants/contracts.js';

export const useWeb3Store = defineStore('web3', {
    state: () => ({
        account: null,
        chainId: null,
        provider: null,
        publicClient: null,
        signer: null, // In Viem, the walletClient acts as the signer
        isConnected: false,
    }),

    actions: {
        async connectWallet() {
            try {
                const accounts = await window.ethereum.request({
                    method: 'eth_requestAccounts'
                });

                const tempWalletClient = createWalletClient({ transport: custom(window.ethereum) });
                const chainId = await tempWalletClient.getChainId();
                const chain = SUPPORTED_NETWORKS[chainId];

                const walletClient = createWalletClient({
                    chain,
                    transport: custom(window.ethereum)
                });

                const publicClient = createPublicClient({
                    chain,
                    transport: http(chain.rpcUrls[0])
                });

                this.account = accounts[0];
                this.provider = publicClient; // Public Client for reading data
                this.publicClient = publicClient;
                this.signer = walletClient; // Wallet Client for sending transactions
                this.chainId = await walletClient.getChainId();

                this.setupEventListeners();
                this.isConnected = true;
            } catch (error) {
                console.error('Error connecting wallet:', error);
                throw error;
            }
        },

        setupEventListeners() {
            if (!window.ethereum) return;

            window.ethereum.on('accountsChanged', (accounts) => {
                if (accounts.length === 0) {
                    this.disconnect();
                } else {
                    this.account = accounts[0];
                }
            });

            window.ethereum.on('chainChanged', () => {
                this.reconnect();
            });
        },

        async reconnect() {
            this.disconnect();
            await this.connectWallet();
        },
            

        disconnect() {
            this.account = null;
            this.chainId = null;
            this.provider = null;
            this.publicClient = null;
            this.signer = null;
            this.isConnected = false;
        }
    }
});