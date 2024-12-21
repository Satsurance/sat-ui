<template>
  <div>
    <button
      v-if="!web3Store.isConnected"
      @click="handleConnect"
      class="flex flex-row align-center bg-yellow-500 border border-yellow-500 hover:bg-white hover:text-yellow-500 hover:border-yellow-500 text-white px-4 py-2 rounded-lg transition-colors transition duration-300"
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
    <button
      v-else
      @click="handleDisconnect"
      class="flex flex-row align-center bg-yellow-500 border border-yellow-500 hover:bg-white hover:text-yellow-500 hover:border-yellow-500 text-white px-4 py-2 rounded-lg transition-colors transition duration-300"
    >
      <span class="mr-2">Disconnect</span>
    </button>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useWeb3 } from "../composables/useWeb3";
import { useWeb3Store } from "../stores/web3Store";

const web3 = useWeb3();
const web3Store = useWeb3Store();

const networkName = computed(() => {
  if (!web3Store.isConnected) return "Not connected";
  switch (web3Store.chainId) {
    case 200901:
      return "Bitlayer";
    case 200810:
      return "Bitlayer Testnet";
    case 31337:
      return "Local Hardhat";
    default:
      return "Unsupported Network";
  }
});

const handleConnect = async () => {
  try {
    await web3.connectWallet();
  } catch (error) {
    console.error("Failed to connect wallet:", error);
  }
};

const handleDisconnect = () => {
  web3Store.disconnect();
};

const formatAddress = (address) => {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};
</script>
