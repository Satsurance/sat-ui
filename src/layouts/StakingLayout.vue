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
              <span class="font-medium">{{ dayStaked }} days</span>
            </div>
            <div class="flex justify-between items-center py-3 px-4 bg-gray-50 rounded">
              <span class="text-gray-600">Staked Amount</span>
              <span class="font-medium">{{ stakedAmount }} BTC</span>
            </div>
          </div>

          <button
              @click="unstakePosition"
              :disabled="transactionStatus !== ''"
              :class="[
              'w-full py-3 rounded-lg transition-colors',
              transactionStatus !== ''
                ? 'bg-red-300 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-700 text-white'
            ]"
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
                  v-model="toStakeAmount"
                  type="number"
                  placeholder="0.00"
                  class="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  :disabled="transactionStatus !== ''"
              >
              <button
                  @click="stakeFunds"
                  :disabled="transactionStatus !== ''"
                  :class="[
                  'px-8 py-3 rounded-lg transition-colors',
                  transactionStatus !== ''
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-[#4747ff] hover:bg-blue-700 text-white'
                ]"
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

    <!-- Transaction Status Modal -->
    <TransactionStatus
        :show="!!transactionStatus"
        :status="transactionStatus"
        :type="transactionType"
        :tx-hash="currentTxHash"
        :error="transactionError"
        @close="resetTransaction"
        @retry="stakeFunds"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { ethers } from 'ethers';
import { useWeb3Store } from '../stores/web3Store';
import { getContractAddress } from '../constants/contracts.js';
import insurancePoolABI from '../assets/abis/insurancePool.json';
import erc20ABI from '../assets/abis/erc20.json';
import TransactionStatus from '../components/TransactionStatus.vue';

// State
const hasPosition = ref(false);
const totalStakedAmount = ref(0);
const toStakeAmount = ref(0);
const stakedAmount = ref(0);
const dayStaked = ref(0);
const web3Store = useWeb3Store();

// Transaction state
const transactionStatus = ref('');
const transactionType = ref('');
const currentTxHash = ref('');
const transactionError = ref('');

// Reset transaction state
const resetTransaction = () => {
  transactionStatus.value = '';
  transactionType.value = '';
  currentTxHash.value = '';
  transactionError.value = '';
};

// Load pool position data
const loadPositionState = async () => {
  try {
    web3Store.isLoadedPosition = true;
    const insurancePool = new ethers.Contract(
        getContractAddress("INSURANCE_POOL", web3Store.chainId),
        insurancePoolABI,
        web3Store.provider
    );

    totalStakedAmount.value = Number(
        ethers.utils.formatEther(await insurancePool.totalAssetsStaked())
    ).toFixed(2);

    const position = await insurancePool.getPoolPosition(web3Store.account);
    const K_coeff = await insurancePool.SHARED_K();

    if (position.startDate > 0) {
      hasPosition.value = true;
      stakedAmount.value = Number(
          ethers.utils.formatEther((position.amount / K_coeff).toString())
      ).toFixed(2);
      dayStaked.value = (
          Math.abs(((new Date().getTime()) / 1000 - position.startDate) / 60 / 60 / 24)
      ).toFixed(2);
    } else {
      hasPosition.value = false;
      stakedAmount.value = 0;
      dayStaked.value = 0;
    }
  } catch (error) {
    console.error('Error loading position:', error);
  }
};

// Stake funds
const handleStakeProcess = async (amountInWei) => {
  try {
    const signer = web3Store.provider.getSigner();
    const insurancePool = new ethers.Contract(
        getContractAddress("INSURANCE_POOL", web3Store.chainId),
        insurancePoolABI,
        signer
    );
    const btcContract = new ethers.Contract(
        getContractAddress("BTC_TOKEN", web3Store.chainId),
        erc20ABI,
        signer
    );

    // Check allowance
    const currentAllowance = await btcContract.allowance(
        web3Store.account,
        insurancePool.address
    );

    // Handle approval if needed
    if (currentAllowance.lt(amountInWei)) {
      transactionType.value = 'stake';
      transactionStatus.value = 'approval_pending';

      try {
        // Use the overrides parameter to ensure consistent behavior
        const approveTx = await btcContract.approve(
            insurancePool.address,
            amountInWei,
            {
              from: web3Store.account
            }
        );
        currentTxHash.value = approveTx.hash;

        await approveTx.wait();
        transactionStatus.value = 'approval_success';
      } catch (error) {
        transactionStatus.value = 'approval_failed';
        transactionError.value = error.code === 4001
            ? 'Transaction rejected by user'
            : 'Failed to approve tokens';
        throw error;
      }
    }

    // Handle staking
    transactionStatus.value = 'stake_pending';
    const stakeTx = await insurancePool.joinPool(amountInWei, {
      from: web3Store.account
    });
    currentTxHash.value = stakeTx.hash;

    await stakeTx.wait();
    transactionStatus.value = 'stake_success';

    await loadPositionState();
    toStakeAmount.value = 0;

    // Auto-close on success after delay
    setTimeout(resetTransaction, 3000);
  } catch (error) {
    console.error('Stake process error:', error);
    throw error;
  }
};

const stakeFunds = async () => {
  try {
    if (!toStakeAmount.value || toStakeAmount.value <= 0) {
      transactionError.value = 'Please enter a valid amount to stake';
      return;
    }

    const amountInWei = ethers.utils.parseEther(toStakeAmount.value.toString());

    // Check BTC balance first
    const signer = web3Store.provider.getSigner();
    const btcContract = new ethers.Contract(
        getContractAddress("BTC_TOKEN", web3Store.chainId),
        erc20ABI,
        signer
    );
    const balance = await btcContract.balanceOf(web3Store.account);

    if (balance.lt(amountInWei)) {
      transactionError.value = `Insufficient BTC balance. You have ${ethers.utils.formatEther(balance)} BTC but trying to stake ${toStakeAmount.value} BTC`;
      return;
    }

    await handleStakeProcess(amountInWei);
  } catch (error) {
    console.error('Staking error:', error);

    if (transactionStatus.value !== 'approval_failed') {
      transactionStatus.value = 'stake_failed';
      transactionError.value = error.code === 4001
          ? 'Transaction rejected by user'
          : error.code === -32603
              ? 'Insufficient balance or internal error'
              : 'Transaction failed. Please try again';
    }
  }
};

// Unstake position
const unstakePosition = async () => {
  try {
    const signer = web3Store.provider.getSigner();
    const insurancePool = new ethers.Contract(
        getContractAddress("INSURANCE_POOL", web3Store.chainId),
        insurancePoolABI,
        signer
    );

    transactionType.value = 'unstake';
    transactionStatus.value = 'pending';

    const unstakeTx = await insurancePool.quitPool();
    currentTxHash.value = unstakeTx.hash;

    await unstakeTx.wait();
    transactionStatus.value = 'success';

    await loadPositionState();

    // Auto-close on success after delay
    setTimeout(resetTransaction, 3000);

  } catch (error) {
    console.error('Unstaking error:', error);
    transactionStatus.value = 'failed';
    transactionError.value = error.code === 4001
        ? 'Transaction rejected'
        : 'Unstaking failed';
  }
};

// Initial load and watchers
if (web3Store.isConnected) loadPositionState();

watch(() => [web3Store.isConnected, web3Store.account], async (values) => {
  if (values[0]) {
    await loadPositionState();
  }
});
</script>

<style scoped>
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>