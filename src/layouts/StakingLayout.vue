<!-- src/pages/Stake.vue -->
<template>
  <div class="min-h-[85vh] bg-gray-50">
    <!-- Main Content -->
    <div class="max-w-6xl mx-auto px-4 py-8">
      <!-- Header with background -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div class="flex justify-between items-center mb-8">
          <div class="mx-[20px] space-y-1">
            <h1 class="text-4xl font-semibold text-gray-900 flex items-center gap-3">
              <svg class="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              Insurance Pool
            </h1>
            <p class="text-gray-500">Stake your BTC to earn rewards while providing coverage for the community</p>
          </div>
        </div>

        <!-- Pool Stats Card -->
        <div class="bg-white rounded-lg mb-8">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- APR -->
            <div class="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg">
              <div class="flex items-center gap-2 text-gray-600 mb-2">
                <svg class="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                </svg>
                <span>APR</span>
              </div>
              <div class="text-2xl font-medium">5.2%</div>
            </div>

            <!-- Total Staked -->
            <div class="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg">
              <div class="flex items-center gap-2 text-gray-600 mb-2">
                <svg class="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span>Total Staked</span>
              </div>
              <div class="text-2xl font-medium">{{ totalStakedAmount }} BTC</div>
            </div>

            <!-- Lock Period -->
            <div class="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg">
              <div class="flex items-center gap-2 text-gray-600 mb-2">
                <svg class="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
                <span>Lock Period</span>
              </div>
              <div class="text-2xl font-medium">7 days</div>
            </div>
          </div>
        </div>

        <!-- Staking Interface -->
        <div class="bg-white rounded-lg p-6 py-12">
          <h2 class="text-2xl font-normal text-center mb-8">
            {{ hasPosition ? "Your Pool Position" : "Add Pool Position" }}
          </h2>

          <!-- Active Position View -->
          <div v-if="hasPosition" class="max-w-lg mx-auto space-y-6">
            <div class="space-y-4">
              <div
                  class="flex justify-between items-center py-3 px-4 bg-gray-50 rounded"
              >
                <span class="text-gray-600">Days Staked</span>
                <span class="font-medium">{{ dayStaked }} days</span>
              </div>
              <div
                  class="flex justify-between items-center py-3 px-4 bg-gray-50 rounded"
              >
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
                : 'btn-secondary',
            ]"
            >
              Unstake Position
            </button>
          </div>

          <!-- Staking Form -->
          <div v-else class="max-w-lg mx-auto space-y-6">
            <div class="space-y-2">
              <div class="flex flex-col">
                <div class="text-start w-full mb-5">
                  <label
                      for="amount"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >BTC Amount to Stake</label
                  >
                  <input
                      type="number"
                      id="amount"
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-yellow-500 focus:border-yellow-500 focus:outline-none block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-yellow-500 dark:focus:border-yellow-500"
                      placeholder="0.99"
                      :disabled="transactionStatus !== '' || !web3Store.isConnected"
                      v-model="toStakeAmount"
                      required
                  />
                </div>
                <div
                    v-if="transactionError"
                    class="mb-4 bg-red-50 rounded-lg p-4 text-red-700"
                >
                  {{ transactionError }}
                </div>
                <button
                    @click="stakeFunds"
                    v-if="web3Store.isConnected"
                    :disabled="transactionStatus !== ''"
                    class="btn-primary px-4 rounded-lg w-full focus:outline-none"
                >
                  Stake
                </button>
                <button
                    v-else
                    disabled
                    class="bg-gray-100 border-gray-100 hover:border-gray-100 cursor-not-allowed text-gray-500 px-4 rounded-lg w-full outline-none"
                >
                  Wallet is not connected
                </button>
              </div>
            </div>

            <div
                v-if="web3Store.isConnected"
                class="bg-yellow-50 rounded-lg p-4 text-yellow-700"
            >
              Minimum stake 0.01 BTC. 7-day lock period applies.
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
        @retry="stakeFunds"
        token-ticker="BTC"
    />
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { ethers } from "ethers";
import { useWeb3Store } from "../stores/web3Store";
import { getContractAddress } from "../constants/contracts.js";
import insurancePoolABI from "../assets/abis/insurancePool.json";
import erc20ABI from "../assets/abis/erc20.json";
import TransactionStatus from "../components/TransactionStatus.vue";

// State
const hasPosition = ref(false);
const totalStakedAmount = ref(0);
const toStakeAmount = ref(null);
const stakedAmount = ref(0);
const dayStaked = ref(0);
const web3Store = useWeb3Store();

// Transaction state
const transactionStatus = ref("");
const transactionType = ref("");
const currentTxHash = ref("");
const transactionError = ref("");

// Reset transaction state
const resetTransaction = () => {
  transactionStatus.value = "";
  transactionType.value = "";
  currentTxHash.value = "";
  transactionError.value = "";
};

// Load pool position data
const loadPositionState = async () => {
  try {
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
    console.error("Error loading position:", error);
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
      transactionType.value = "stake";
      transactionStatus.value = "approval_pending";

      try {
        // Use the overrides parameter to ensure consistent behavior
        const approveTx = await btcContract.approve(
          insurancePool.address,
          amountInWei,
          {
            from: web3Store.account,
          }
        );
        currentTxHash.value = approveTx.hash;

        await approveTx.wait();
        transactionStatus.value = "approval_success";
      } catch (error) {
        transactionStatus.value = "approval_failed";
        transactionError.value =
          error.code === 4001
            ? "Transaction rejected by user"
            : "Failed to approve tokens";
        throw error;
      }
    }

    // Handle staking
    transactionStatus.value = "stake_pending";
    const stakeTx = await insurancePool.joinPool(amountInWei, {
      from: web3Store.account,
    });
    currentTxHash.value = stakeTx.hash;

    await stakeTx.wait();
    transactionStatus.value = "stake_success";

    await loadPositionState();
    toStakeAmount.value = 0;

    // Auto-close on success after delay
    setTimeout(resetTransaction, 3000);
  } catch (error) {
    console.error("Stake process error:", error);
    throw error;
  }
};

const stakeFunds = async () => {
  try {
    if (!toStakeAmount.value || toStakeAmount.value < 0.01) {
      transactionError.value = "Please enter a valid amount to stake";
      return;
    }

    const amountInWei = ethers.utils.parseEther(toStakeAmount.value.toString());

    // Check BTC balance first
    const btcContract = new ethers.Contract(
      getContractAddress("BTC_TOKEN", web3Store.chainId),
      erc20ABI,
        web3Store.provider
    );
    const balance = await btcContract.balanceOf(web3Store.account);

    if (balance.lt(amountInWei)) {
      transactionError.value = `Insufficient BTC balance. You have ${ethers.utils.formatEther(
        balance
      )} BTC but trying to stake ${toStakeAmount.value} BTC`;
      return;
    }

    await handleStakeProcess(amountInWei);
  } catch (error) {
    console.error("Staking error:", error);

    if (transactionStatus.value !== "approval_failed") {
      transactionStatus.value = "stake_failed";
      transactionError.value =
        error.code === 4001
          ? "Transaction rejected by user"
          : error.code === -32603
          ? "Insufficient balance or internal error"
          : "Transaction failed. Please try again";
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

    transactionType.value = "unstake";
    transactionStatus.value = "pending";

    const unstakeTx = await insurancePool.quitPool();
    currentTxHash.value = unstakeTx.hash;

    await unstakeTx.wait();
    transactionStatus.value = "success";

    await loadPositionState();

    // Auto-close on success after delay
    setTimeout(resetTransaction, 3000);
  } catch (error) {
    console.error("Unstaking error:", error);
    transactionStatus.value = "failed";
    transactionError.value =
      error.code === 4001 ? "Transaction rejected" : "Unstaking failed";
  }
};

// Initial load and watchers
if (web3Store.isConnected) loadPositionState();

watch(
  () => [web3Store.isConnected, web3Store.account],
  async (values) => {
    if (values[0]) {
      await loadPositionState();
    }
  }
);
</script>

<style scoped>
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
