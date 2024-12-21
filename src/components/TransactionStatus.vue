<!-- src/components/TransactionStatus.vue -->
<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
      <!-- Progress Steps -->
      <div v-if="type === 'stake'" class="mb-6">
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center">
            <div :class="[
              'w-8 h-8 rounded-full flex items-center justify-center text-sm',
              status === 'approval_pending' ? 'bg-blue-100 text-blue-600' :
              status === 'approval_success' ? 'bg-green-100 text-green-600' :
              status === 'approval_failed' ? 'bg-red-100 text-red-600' :
              'bg-gray-100 text-gray-600'
            ]">
              1
            </div>
            <div class="ml-3">
              <div class="font-medium">Approve BTC</div>
              <div class="text-sm text-gray-500">Allow smart contract to use your BTC</div>
            </div>
          </div>
          <div v-if="status === 'approval_pending'" class="animate-spin w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full"></div>
          <div v-else-if="status === 'approval_success'" class="text-green-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
        </div>

        <div class="flex items-center mt-4">
          <div :class="[
            'w-8 h-8 rounded-full flex items-center justify-center text-sm',
            status === 'stake_pending' ? 'bg-blue-100 text-blue-600' :
            status === 'stake_success' ? 'bg-green-100 text-green-600' :
            status === 'stake_failed' ? 'bg-red-100 text-red-600' :
            'bg-gray-100 text-gray-600'
          ]">
            2
          </div>
          <div class="ml-3">
            <div class="font-medium">Stake BTC</div>
            <div class="text-sm text-gray-500">Deposit your BTC into the pool</div>
          </div>
          <div v-if="status === 'stake_pending'" class="ml-auto animate-spin w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full"></div>
          <div v-else-if="status === 'stake_success'" class="ml-auto text-green-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
        </div>
      </div>

      <!-- Single Transaction Status -->
      <div v-else class="text-center">
        <div v-if="status === 'pending'" class="mb-4">
          <div class="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
          <div class="mt-4 font-medium">Transaction in Progress</div>
          <div class="text-sm text-gray-500">Please wait while we process your transaction</div>
        </div>
        <div v-else-if="status === 'success'" class="mb-4 text-green-600">
          <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <div class="mt-4 font-medium">Transaction Successful</div>
        </div>
        <div v-else-if="status === 'failed'" class="mb-4 text-red-600">
          <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
          <div class="mt-4 font-medium">Transaction Failed</div>
          <div class="text-sm text-gray-500">{{ error }}</div>
        </div>
      </div>

      <!-- Transaction Hash -->
      <div v-if="txHash" class="mt-4 p-3 bg-gray-50 rounded text-sm break-all">
        <div class="text-gray-500 mb-1">Transaction Hash:</div>
        <a :href="'https://etherscan.io/tx/' + txHash" target="_blank" class="text-blue-600 hover:text-blue-700">
          {{ txHash }}
        </a>
      </div>

      <!-- Action Button -->
      <button
          v-if="status.includes('failed') || status === 'success'"
          @click="$emit('close')"
          class="mt-6 w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-900 transition-colors"
      >
        {{ status === 'success' ? 'Close' : 'Try Again' }}
      </button>
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

defineEmits(['close']);
</script>