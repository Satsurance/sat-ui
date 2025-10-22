<template>
  <div class="flex items-center">
    <div v-if="!web3Store.isConnected" class="relative">
      <button
        @click="showDropdown = !showDropdown"
        class="btn-primary flex flex-row items-center px-4 py-2 rounded-lg"
      >
        <span class="mr-2">Connect Wallet</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3"
          />
        </svg>
      </button>
      
      <!-- Wallet Dropdown -->
      <div v-if="showDropdown" class="absolute mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
        <button
          v-for="wallet in wallets"
          :key="wallet.name"
          @click="connectWallet(wallet.connector)"
          class="w-full px-4 py-2 text-left hover:bg-gray-100"
        >
          {{ wallet.name }}
        </button>
      </div>
    </div>
    <div v-else>
      <!-- Desktop View -->
      <div class="hidden lg:flex items-center space-x-4">
        <div class="flex items-center space-x-2 border border-gray-200 rounded-lg px-3 py-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-5 text-yellow-500"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3"
            />
          </svg>
          <div class="flex flex-col">
            <span class="text-sm text-gray-600">{{ formatAddress(web3Store.midlAccount.address) }}</span>
            <span class="text-xs text-gray-500">{{ networkName }}</span>
          </div>
        </div>
        <button
          class="text-sm text-red-400 hover:text-red-500 px-3 py-1 rounded border border-red-400 hover:border-red-500"
          @click="handleDisconnect"
        >
          Disconnect
        </button>
      </div>

      <!-- Mobile View -->
      <div class="flex flex-col lg:hidden">
        <p class="font-bold mb-2">
          Wallet
        </p>
        <p>{{ formatAddress(web3Store.account) }}</p>
        <p>{{ networkName }}</p>
        <button
          class="border-red-400 bg-white text-red-400 mt-2 focus:outline-none hover:border-red-400"
          @click="handleDisconnect"
        >
          Disconnect
        </button>
      </div>
    </div>
  </div>
  <NetworkGuard />
</template>

<script setup>
import { computed, ref } from "vue";
import { useWeb3 } from "../composables/useWeb3";
import { useWeb3Store } from "../stores/web3Store";
import NetworkGuard from "./NetworkGuard.vue";
import { leatherConnector, unisatConnector, phantomConnector, bitgetConnector, xverseConnector } from '@midl-xyz/midl-js-connectors';
import { createConfig, regtest, connect, AddressPurpose } from '@midl-xyz/midl-js-core';
import { getEVMAddress, midlRegtest } from '@midl-xyz/midl-js-executor';
import { createPublicClient, http } from 'viem';
import { SUPPORTED_NETWORKS, NETWORKS } from '../constants/contracts.js';

const web3 = useWeb3();
const web3Store = useWeb3Store();
const showDropdown = ref(false);

const wallets = [
  { name: 'Leather', connector: leatherConnector },
  { name: 'Unisat', connector: unisatConnector },
  { name: 'Phantom', connector: phantomConnector },
  { name: 'Bitget', connector: bitgetConnector },
  { name: 'Xverse', connector: xverseConnector }
];

const networkName = computed(() => {
  if (!web3Store.isConnected) return "Not connected";
  switch (web3Store.chainId) {
    case 777:
      return "MIDL Regtest";
    default:
      return "Unsupported Network";
  }
});
// Takes a specific wallet connector (Leather, Unisat, etc.)
const connectWallet = async (connector) => {
  try {
    showDropdown.value = false;
    web3Store.midlConfig = createConfig({
      networks: [regtest],
      connectors: [connector()],
    });
    const midlAccounts = await connect(web3Store.midlConfig, {
      purposes: [AddressPurpose.Ordinals],
      network: regtest
    });
    web3Store.midlAccount = midlAccounts[0];
    web3Store.account = getEVMAddress(web3Store.midlAccount, regtest);
    web3Store.ethClient = createPublicClient({
      chain: midlRegtest,
      transport: http(SUPPORTED_NETWORKS[NETWORKS.MIDL_REGTEST].rpcUrls[0])
    });
    web3Store.chainId = NETWORKS.MIDL_REGTEST;
    web3Store.isConnected = true;
  } catch (error) {
    console.error("Failed to connect wallet:", error);
  }
};

const handleDisconnect = () => {
  web3Store.disconnect();
};

const formatAddress = (address) => {
  if (!address) return "";
  return `${address.toString().slice(0, 6)}...${address.toString().slice(-6)}`;
};
</script>