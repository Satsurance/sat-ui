import { defineStore } from 'pinia';
import { ethers } from 'ethers';

export const useWeb3Store = defineStore('web3', {
    state: () => ({
        account: null,
        chainId: null,
        provider: null,
        signer: null,
        isConnected: false,
    }),

    actions: {
        async connectWallet() {
            try {
                // Request account access
                const accounts = await window.ethereum.request({
                    method: 'eth_requestAccounts'
                });

                // Create ethers provider and signer
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();

                this.account = accounts[0];
                this.provider = provider;
                this.signer = signer;
                this.isConnected = true;

                // Get initial chain ID
                const network = await provider.getNetwork();
                this.chainId = network.chainId;

                // Setup event listeners
                this.setupEventListeners();
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

            window.ethereum.on('chainChanged', (chainId) => {
                this.chainId = parseInt(chainId, 16);
            });
        },

        disconnect() {
            this.account = null;
            this.chainId = null;
            this.provider = null;
            this.signer = null;
            this.isConnected = false;
        }
    }
});