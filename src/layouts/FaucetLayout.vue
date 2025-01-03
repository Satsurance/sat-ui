<!-- src/pages/Faucet.vue -->
<template>
  <div class="min-h-[85vh] bg-gray-50">
    <!-- Main Content -->
    <div class="max-w-6xl mx-auto px-4 py-8">
      <!-- Header with background -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div class="flex justify-between items-center mb-8">
          <div class="space-y-1">
            <h1 class="text-4xl font-semibold text-gray-900 flex items-center gap-3">
              <svg class="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              Test BTC Faucet
            </h1>
            <p class="text-gray-500">Request test BTC tokens testing</p>
          </div>
        </div>

        <!-- Info Stats Card -->
        <div class="bg-white rounded-lg mb-8">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Max Amount -->
            <div class="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg">
              <div class="flex items-center gap-2 text-gray-600 mb-2">
                <svg class="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                </svg>
                <span>Maximum Request</span>
              </div>
              <div class="text-2xl font-medium">0.1 BTC</div>
            </div>

            <!-- Current Balance -->
            <div class="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg">
              <div class="flex items-center gap-2 text-gray-600 mb-2">
                <svg class="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span>Your Balance</span>
              </div>
              <div class="text-2xl font-medium">{{ currentBalance }} BTC</div>
            </div>

            <!-- Network -->
            <div class="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg">
              <div class="flex items-center gap-2 text-gray-600 mb-2">
                <svg class="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
                </svg>
                <span>Network</span>
              </div>
              <div class="text-2xl font-medium">Bitlayer Testnet</div>
            </div>
          </div>
        </div>

        <!-- Faucet Interface -->
        <div class="bg-white rounded-lg p-6 py-12">
          <div class="max-w-lg mx-auto space-y-6">
            <div class="space-y-4">
              <div class="flex flex-col">
                <label for="amount" class="block mb-2 text-sm font-medium text-gray-900">
                  BTC Amount to Request
                </label>
                <div class="flex items-center space-x-4">
                  <input
                      type="number"
                      id="amount"
                      v-model="requestAmount"
                      :disabled="isLoading || !web3Store.isConnected"
                      class="flex-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-yellow-500 focus:border-yellow-500 focus:outline-none block w-full p-2.5"
                      placeholder="0.01"
                      min="0.01"
                      max="0.1"
                      step="0.01"
                      required
                  />
                  <button
                      @click="requestTokens"
                      :disabled="isLoading || !web3Store.isConnected || !isValidAmount"
                      class="btn-primary px-8 py-2.5 rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {{ isLoading ? 'Requesting...' : 'Request' }}
                  </button>
                </div>
                <div v-if="!web3Store.isConnected" class="mt-2 text-sm text-gray-500">
                  Please connect your wallet first
                </div>
                <div v-else-if="!isValidAmount && requestAmount" class="mt-2 text-sm text-red-500">
                  Amount must be between 0.01 and 0.1 BTC
                </div>
              </div>
            </div>

            <div v-if="web3Store.isConnected" class="bg-yellow-50 rounded-lg p-4 text-yellow-700">
              <div class="flex items-start space-x-3">
                <svg class="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <div>
                  <p class="font-medium">Important Notes:</p>
                  <ul class="mt-1 ml-4 list-disc text-sm">
                    <li>Maximum request amount is 0.1 BTC</li>
                    <li>Tokens are for testing purposes only</li>
                    <li>Please allow a few moments for the transaction to process</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Transaction Status Modal -->
    <TransactionStatus
        :show="!!transactionStatus"
        :status="transactionStatus"
        :type="transactionType"
        :tx-hash="currentTxHash"
        :error="transactionError"
        @close="resetTransaction"
        @retry="requestTokens"
        token-ticker="BTC"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { ethers } from 'ethers';
import { useWeb3Store } from '../stores/web3Store';
import { getContractAddress } from '../constants/contracts.js';
import erc20ABI from '../assets/abis/erc20.json';
import TransactionStatus from '../components/TransactionStatus.vue';

// Store setup
const web3Store = useWeb3Store();

// State
const currentBalance = ref(0);
const requestAmount = ref(null);
const isLoading = ref(false);

// Transaction state
const transactionStatus = ref('');
const transactionType = ref('');
const currentTxHash = ref('');
const transactionError = ref('');

// Computed
const isValidAmount = computed(() => {
  const amount = Number(requestAmount.value);
  return amount >= 0.01 && amount <= 0.1;
});

// Methods
const loadBalance = async () => {
  try {
    if (!web3Store.isConnected) {
      currentBalance.value = 0;
      return;
    }

    const btcContract = new ethers.Contract(
        getContractAddress('BTC_TOKEN', web3Store.chainId),
        erc20ABI,
        web3Store.provider
    );

    const balance = await btcContract.balanceOf(web3Store.account);
    currentBalance.value = Number(ethers.utils.formatEther(balance)).toFixed(2);
  } catch (error) {
    console.error('Error loading balance:', error);
  }
};

const requestTokens = async () => {
  if (!isValidAmount.value || isLoading.value) return;

  try {
    isLoading.value = true;
    transactionType.value = 'faucet_request';
    transactionStatus.value = 'pending';

    // Prepare the request to the faucet API
    const response = await fetch('/api/faucet/request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address: web3Store.account,
        amount: requestAmount.value
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to request tokens');
    }

    currentTxHash.value = data.txHash;
    transactionStatus.value = 'success';

    // Reset form and reload balance
    requestAmount.value = null;
    await loadBalance();

    // Auto-close success message
    setTimeout(resetTransaction, 3000);
  } catch (error) {
    console.error('Error requesting tokens:', error);
    transactionStatus.value = 'failed';
    transactionError.value = error.message || 'Failed to request tokens';
  } finally {
    isLoading.value = false;
  }
};

const resetTransaction = () => {
  transactionStatus.value = '';
  transactionType.value = '';
  currentTxHash.value = '';
  transactionError.value = '';
};

// Watchers
watch(
    () => [web3Store.isConnected, web3Store.account],
    async ([isConnected]) => {
      if (isConnected) {
        await loadBalance();
      } else {
        currentBalance.value = 0;
      }
    },
    { immediate: true }
);
</script>

<style scoped>
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>