<!-- src/components/web3/NetworkStatus.vue -->
<template>
  <div class="flex items-center space-x-2">
    <div
        class="w-2 h-2 rounded-full"
        :class="networkColor"
    ></div>
    <span class="text-sm text-gray-600">{{ networkName }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useWeb3Store } from '../stores/web3Store';

const web3Store = useWeb3Store();

const networkName = computed(() => {
  if(!web3Store.isConnected) return 'Not connected';
  switch (web3Store.chainId) {
    case 200901:
      return 'Bitlayer';
    case 200810:
      return 'Bitlayer Testnet';
    default:
      return 'Unsupported Network';
  }
});

const networkColor = computed(() => {
  switch (web3Store.chainId) {
    case 1:
      return 'bg-blue-500';
    case 137:
      return 'bg-purple-500';
    case 56:
      return 'bg-yellow-500';
    case 42161:
      return 'bg-blue-400';
    case 10:
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
});
</script>