<!-- src/components/TransactionStatus.vue -->
<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
      <!-- Progress Steps for Both Approve and Stake -->
      <div v-if="type === 'stake'" class="mb-6">
        <div class="flex items-center mb-6">
          <div :class="[
            'w-8 h-8 rounded-full flex items-center justify-center text-sm',
            status === 'approval_pending' ? 'bg-blue-100 text-blue-600' :
            status === 'approval_success' ? 'bg-green-100 text-green-600' :
            status === 'approval_failed' ? 'bg-red-100 text-red-600' :
            'bg-gray-100 text-gray-600'
          ]">
            1
          </div>
          <div class="ml-3 flex-1">
            <div class="font-medium">Approve BTC</div>
            <div class="text-sm text-gray-500">Allow smart contract to use your BTC</div>
          </div>
          <div v-if="status === 'approval_pending'" class="ml-2 animate-spin w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full"></div>
          <div v-else-if="status === 'approval_success'" class="ml-2 text-green-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
        </div>

        <div class="flex items-center">
          <div :class="[
            'w-8 h-8 rounded-full flex items-center justify-center text-sm',
            status === 'stake_pending' ? 'bg-blue-100 text-blue-600' :
            status === 'stake_success' ? 'bg-green-100 text-green-600' :
            status === 'stake_failed' ? 'bg-red-100 text-red-600' :
            'bg-gray-100 text-gray-600'
          ]">
            2
          </div>
          <div class="ml-3 flex-1">
            <div class="font-medium">Stake BTC</div>
            <div class="text-sm text-gray-500">Deposit your BTC into the pool</div>
          </div>
          <div v-if="status === 'stake_pending'" class="ml-2 animate-spin w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full"></div>
          <div v-else-if="status === 'stake_success'" class="ml-2 text-green-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
        </div>
      </div>

      <!-- Single Transaction Status (for unstake) -->
      <div v-else>
        <div class="flex items-center mb-6">
          <div :class="[
            'w-8 h-8 rounded-full flex items-center justify-center text-sm',
            status === 'pending' ? 'bg-blue-100 text-blue-600' :
            status === 'success' ? 'bg-green-100 text-green-600' :
            status === 'failed' ? 'bg-red-100 text-red-600' :
            'bg-gray-100 text-gray-600'
          ]">
            1
          </div>
          <div class="ml-3 flex-1">
            <div class="font-medium">Unstake BTC</div>
            <div class="text-sm text-gray-500">Withdraw your BTC from the pool</div>
          </div>
          <div v-if="status === 'pending'" class="ml-2 animate-spin w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full"></div>
          <div v-else-if="status === 'success'" class="ml-2 text-green-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="mt-4 p-3 bg-red-50 rounded-lg text-red-600 text-sm">
        {{ error }}
      </div>

      <!-- Transaction Hash -->
      <div v-if="txHash" class="mt-4 p-3 bg-gray-50 rounded-lg text-sm break-all">
        <div class="text-gray-500 mb-1">Transaction Hash:</div>
        <a :href="'https://etherscan.io/tx/' + txHash" target="_blank" class="text-blue-600 hover:text-blue-700">
          {{ txHash }}
        </a>
      </div>

      <!-- Action Buttons -->
      <div class="mt-6 space-y-3">
        <button
            v-if="status.includes('failed')"
            @click="$emit('retry')"
            class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Retry Transaction
        </button>

        <button
            v-if="status.includes('success') || status.includes('failed')"
            @click="$emit('close')"
            :class="[
            'w-full py-2 rounded-lg transition-colors',
            status.includes('failed')
              ? 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              : 'bg-gray-800 hover:bg-gray-900 text-white'
          ]"
        >
          {{ status.includes('success') ? 'Close' : 'Cancel' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineEmits } from 'vue';

const props = defineProps({
  show: Boolean,
  status: String,
  type: String,
  txHash: String,
  error: String
});

defineEmits(['close', 'retry']);
</script>