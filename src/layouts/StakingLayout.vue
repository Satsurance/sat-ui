<!-- src/pages/Stake.vue -->
<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4">
      <!-- Header -->
      <h1 class="text-4xl font-normal text-center mb-16 text-gray-800">Insurance Pool</h1>

      <!-- Pool Info -->
      <div class="bg-white rounded-lg shadow-sm mb-8">
        <div class="grid grid-cols-3 divide-x">
          <div class="p-6 text-center">
            <div class="text-gray-600 mb-2">APR</div>
            <div class="text-2xl font-medium">5.2%</div>
          </div>
          <div class="p-6 text-center">
            <div class="text-gray-600 mb-2">Total Staked</div>
            <div class="text-2xl font-medium">{{ totalStakedAmount }} BTC</div>
          </div>
          <div class="p-6 text-center">
            <div class="text-gray-600 mb-2">Lock Period</div>
            <div class="text-2xl font-medium">7 days</div>
          </div>
        </div>
      </div>

      <!-- Staking Interface -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h2 class="text-2xl font-normal text-center mb-8">
          {{ hasPosition ? 'Your Pool Position' : 'Add Pool Position' }}
        </h2>

        <!-- Active Position View -->
        <div v-if="hasPosition" class="max-w-lg mx-auto space-y-6">
          <div class="space-y-4">
            <div class="flex justify-between items-center py-3 px-4 bg-gray-50 rounded">
              <span class="text-gray-600">Days Staked</span>
              <span class="font-medium">15 days</span>
            </div>
            <div class="flex justify-between items-center py-3 px-4 bg-gray-50 rounded">
              <span class="text-gray-600">Staked Amount</span>
              <span class="font-medium">0.5 BTC</span>
            </div>
          </div>

          <button
              class="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors"
          >
            Unstake Position
          </button>
        </div>

        <!-- Staking Form -->
        <div v-else class="max-w-lg mx-auto space-y-6">
          <div class="space-y-2">
            <label class="block text-gray-600">BTC Amount to Stake</label>
            <div class="flex gap-3">
              <input
                  type="number"
                  placeholder="0.00"
                  class="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              >
              <button
                  class="px-8 bg-[#4747ff] text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Stake
              </button>
            </div>
          </div>

          <div class="bg-blue-50 rounded-lg p-4 text-blue-700">
            Minimum stake 0.01 BTC. 7-day lock period applies.
          </div>
        </div>
      </div>

      <!-- Pool Description -->
      <div class="mt-8 text-center text-gray-600">
        Stake your BTC to earn rewards while providing coverage for the community.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { ethers } from 'ethers';
import { useWeb3Store } from '../stores/web3Store';
import { getContractAddress } from '../constants/contracts.js';
import insurancePoolABI from '../assets/abis/insurancePool.json';

const hasPosition = ref(false);
const totalStakedAmount = ref(0);
const web3Store = useWeb3Store();


const loadPositionState = async () => {
  const insurancePool = new ethers.Contract(
      getContractAddress("INSURANCE_POOL", web3Store.chainId),
      insurancePoolABI,
      web3Store.provider
  );
  totalStakedAmount.value = await insurancePool.totalAssetsStaked();
  const position = await insurancePool.getPoolPosition(web3Store.account);
  hasPosition.value = position.startDate > 0;
}



watch(() => [web3Store.isConnected, web3Store.account], async (values) => {
  if (values[0]) {
    await loadPositionState()
  }
})
</script>

<style scoped>
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>