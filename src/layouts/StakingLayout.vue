<template>
  <div class="w-full bg-white">
    <div class="max-w-5xl mx-auto py-6">
      <!-- Main Insurance Pool Container -->
      <div class="bg-white border border-gray-100 rounded-lg shadow-sm">
        <!-- Header -->
        <div class="px-6 py-4 border-b border-gray-100">
          <h1 class="text-xl font-semibold text-center text-gray-800">Insurance Pool</h1>
        </div>

        <!-- Content Container -->
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- Left Section -->
            <div class="bg-gray-50/50 rounded-lg border border-gray-100 overflow-hidden">
              <div class="px-6 py-4 bg-white border-b border-gray-100">
                <h2 class="text-lg font-medium text-center text-gray-800">Shared Insurance Coverage</h2>
              </div>

              <div class="p-6">
                <!-- Insurance Pool Description -->
                <div class="mb-8">
                  <p class="text-gray-600 text-center">
                    Stake your BTC to earn rewards while providing coverage for the community.
                  </p>
                </div>

                <!-- Pool Statistics -->
                <div class="space-y-4">
                  <div class="flex justify-between items-center py-3 px-4 bg-white rounded border border-gray-100">
                    <span class="text-gray-600">APR</span>
                    <span class="font-medium text-gray-900">5.2%</span>
                  </div>
                  <div class="flex justify-between items-center py-3 px-4 bg-white rounded border border-gray-100">
                    <span class="text-gray-600">Total Staked</span>
                    <span class="font-medium text-gray-900">123.45 BTC</span>
                  </div>
                  <div class="flex justify-between items-center py-3 px-4 bg-white rounded border border-gray-100">
                    <span class="text-gray-600">Minimum Lock Period</span>
                    <span class="font-medium text-gray-900">7 days</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right Section -->
            <div class="bg-gray-50/50 rounded-lg border border-gray-100 overflow-hidden">
              <div class="px-6 py-4 bg-white border-b border-gray-100">
                <h2 class="text-lg font-medium text-center text-gray-800">
                  {{ hasPosition ? 'Your Pool Position' : 'Add Pool Position' }}
                </h2>
              </div>

              <div class="p-6">
                <!-- Show when user has position -->
                <div v-if="hasPosition" class="space-y-4">
                  <div class="bg-white rounded border border-gray-100 p-4">
                    <div class="space-y-4">
                      <div class="flex justify-between items-center py-2">
                        <span class="text-gray-600">Days Staked</span>
                        <span class="font-medium text-gray-900">15 days</span>
                      </div>
                      <div class="flex justify-between items-center py-2">
                        <span class="text-gray-600">Staked Amount</span>
                        <span class="font-medium text-gray-900">0.5 BTC</span>
                      </div>
                    </div>
                  </div>
                  <button class="w-full px-4 py-3 bg-red-500 text-white rounded hover:bg-red-600 transition-colors">
                    Unstake Position
                  </button>
                </div>

                <!-- Show when user has no position -->
                <div v-else class="space-y-4">
                  <div class="bg-white rounded border border-gray-100 p-4">
                    <label class="block text-sm font-medium text-gray-600 mb-2">
                      BTC Amount to Stake
                    </label>
                    <div class="flex space-x-3">
                      <input
                          type="number"
                          placeholder="0.00"
                          class="flex-1 px-4 py-3 border border-gray-200 rounded focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
                      >
                      <button class="px-6 py-3 bg-blue-500 text-white font-medium rounded hover:bg-blue-600 transition-colors">
                        Stake
                      </button>
                    </div>
                  </div>
                  <div class="bg-blue-50 rounded p-4 text-sm text-blue-700">
                    Minimum stake 0.01 BTC. 7-day lock period applies.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const hasPosition = ref(false)
</script>

<style scoped>
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>