<template>
  <div>
    <button
        v-if="!web3Store.isConnected"
        @click="handleConnect"
        class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
    >
      Connect Wallet
    </button>
    <div v-else class="flex items-center space-x-2">
      <span class="text-gray-600">{{ formatAddress(web3Store.account) }}</span>
      <button
          @click="handleDisconnect"
          class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
      >
        Disconnect
      </button>
    </div>
  </div>
</template>

<script setup>
import { useWeb3 } from '../composables/useWeb3';
import { useWeb3Store } from '../stores/web3Store';

const web3 = useWeb3();
const web3Store = useWeb3Store();

const handleConnect = async () => {
  try {
    await web3.connectWallet();
  } catch (error) {
    console.error('Failed to connect wallet:', error);
  }
};

const handleDisconnect = () => {
  web3Store.disconnect();
};

const formatAddress = (address) => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};
</script>