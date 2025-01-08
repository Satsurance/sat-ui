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
              <div class="text-2xl font-medium">{{ poolAPR }}%</div>
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
              <div class="text-2xl font-medium">90-360 days</div>
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
                <span class="font-medium">{{ dayStaked }}</span>
              </div>
              <div
                  class="flex justify-between items-center py-3 px-4 bg-gray-50 rounded"
              >
                <span class="text-gray-600">Staked Amount</span>
                <span class="font-medium">{{ stakedAmount }} BTC</span>
              </div>
              <div
                  class="flex justify-between items-center py-3 px-4 bg-gray-50 rounded"
              >
                <span class="text-gray-600">Earned rewards</span>
                <span class="font-medium">{{ earnedRewards }} BTC</span>
              </div>
            </div>
            <button
                @click="getReward"
                :disabled="transactionStatus !== ''"
                :class="[
      'w-full py-3 rounded-lg transition-colors',
      transactionStatus !== ''
        ? 'bg-red-300 cursor-not-allowed'
        : 'btn-primary',
    ]"
            >
              Get Rewards
            </button>
            <button
                @click="unstakePosition"
                :disabled="transactionStatus !== '' || !isUnlockReady"
                :class="[
      'w-full py-3 rounded-lg transition-colors',
      transactionStatus !== '' || !isUnlockReady
        ? 'bg-red-300 cursor-not-allowed'
        : 'btn-secondary',
    ]"
            >
              Unstake Position
            </button>
          </div>

          <!-- Staking Form -->
          <div v-else class="max-w-lg mx-auto space-y-6">
            <div class="space-y-4">
              <!-- Amount Input -->
              <div class="flex flex-col">
                <div class="text-start w-full mb-5">
                  <label
                      for="amount"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >BTC Amount to Stake</label>
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

                <!-- Lock Period Selection -->
                <div class="mb-6">
                  <label class="block mb-2 text-sm font-medium text-gray-900">
                    Select Lock Period
                  </label>
                  <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <!-- 0 Days Option -->
                    <div class="relative group">
                      <input
                          type="radio"
                          id="lock0"
                          name="lockPeriod"
                          value="0"
                          v-model="selectedLockPeriod"
                          class="peer hidden"
                      />
                      <label
                          for="lock0"
                          class="flex flex-col items-center justify-center p-4 bg-white border-2 border-gray-200 rounded-lg cursor-pointer hover:border-yellow-500 peer-checked:border-yellow-500 peer-checked:bg-yellow-50"
                      >
                        <span class="text-lg font-medium">0 Days</span>
                        <span class="text-sm text-gray-500">No Lock</span>
                      </label>
                      <!-- Testnet Warning Tooltip -->
                      <div class="absolute invisible group-hover:visible bg-gray-900 text-white text-xs rounded py-1 px-2 -top-8 left-1/2 transform -translate-x-1/2 w-32 text-center">
                        Testnet option only
                        <div class="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900"></div>
                      </div>
                    </div>

                    <!-- 90 Days Option -->
                    <div>
                      <input
                          type="radio"
                          id="lock90"
                          name="lockPeriod"
                          value="90"
                          v-model="selectedLockPeriod"
                          class="peer hidden"
                      />
                      <label
                          for="lock90"
                          class="flex flex-col items-center justify-center p-4 bg-white border-2 border-gray-200 rounded-lg cursor-pointer hover:border-yellow-500 peer-checked:border-yellow-500 peer-checked:bg-yellow-50"
                      >
                        <span class="text-lg font-medium">90 Days</span>
                        <span class="text-sm text-gray-500">Standard</span>
                      </label>
                    </div>

                    <!-- 180 Days Option -->
                    <div>
                      <input
                          type="radio"
                          id="lock180"
                          name="lockPeriod"
                          value="180"
                          v-model="selectedLockPeriod"
                          class="peer hidden"
                      />
                      <label
                          for="lock180"
                          class="flex flex-col items-center justify-center p-4 bg-white border-2 border-gray-200 rounded-lg cursor-pointer hover:border-yellow-500 peer-checked:border-yellow-500 peer-checked:bg-yellow-50"
                      >
                        <span class="text-lg font-medium">180 Days</span>
                        <span class="text-sm text-gray-500">Extended</span>
                      </label>
                    </div>

                    <!-- 360 Days Option -->
                    <div>
                      <input
                          type="radio"
                          id="lock360"
                          name="lockPeriod"
                          value="360"
                          v-model="selectedLockPeriod"
                          class="peer hidden"
                      />
                      <label
                          for="lock360"
                          class="flex flex-col items-center justify-center p-4 bg-white border-2 border-gray-200 rounded-lg cursor-pointer hover:border-yellow-500 peer-checked:border-yellow-500 peer-checked:bg-yellow-50"
                      >
                        <span class="text-lg font-medium">360 Days</span>
                        <span class="text-sm text-gray-500">Maximum</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div
                    v-if="transactionError"
                    class="mb-4 bg-red-50 rounded-lg p-4 text-red-700"
                >
                  {{ transactionError }}
                </div>

                <!-- Stake Button -->
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
              Minimum stake 0.0001 BTC. Selected lock period will apply.
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
import {ref, watch} from "vue";
import {ethers} from "ethers";
import {useWeb3Store} from "../stores/web3Store";
import {getContractAddress} from "../constants/contracts.js";
import insurancePoolABI from "../assets/abis/insurancePool.json";
import erc20ABI from "../assets/abis/erc20.json";
import TransactionStatus from "../components/TransactionStatus.vue";

// State
const hasPosition = ref(false);
const totalStakedAmount = ref(0);
const toStakeAmount = ref(null);
const stakedAmount = ref(0);
const dayStaked = ref(0);
const earnedRewards = ref(0);
const poolAPR = ref(0);
const selectedLockPeriod = ref(90);
const isUnlockReady = ref(false);
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

    const retValues = await Promise.all([
      insurancePool.totalAssetsStaked(),
      insurancePool.totalPoolShares(),
      insurancePool.rewardRate(),
      insurancePool.getPoolPosition(web3Store.account),
      insurancePool.earned(web3Store.account)
    ]);
    const totalAssetsStakedRaw = BigInt(retValues[0]);
    const totalSharesAmount = BigInt(retValues[1]);
    const rewardRate = BigInt(retValues[2]);
    const position = retValues[3];
    const earned = retValues[4];

    totalStakedAmount.value = Number(
        ethers.utils.formatEther(totalAssetsStakedRaw)
    ).toFixed(2);

    if (totalAssetsStakedRaw != 0) {
      poolAPR.value = ((Number((totalAssetsStakedRaw + rewardRate * BigInt(60 * 60 * 24 * 365)) * 10000n / totalAssetsStakedRaw) / 10000 - 1) * 100).toFixed(2);
    }


    if (position.startDate > 0) {
      hasPosition.value = true;
      stakedAmount.value = Number(
          ethers.utils.formatEther(((BigInt(position.shares) * totalAssetsStakedRaw) / totalSharesAmount).toString())
      ).toFixed(2);

      const timeInfo = calculateStakingTime(position.startDate, position.minTimeStake);
      dayStaked.value = timeInfo.timeDisplay;
      isUnlockReady.value = timeInfo.isUnlocked;
      earnedRewards.value = ethers.utils.formatEther(earned);
    } else {
      hasPosition.value = false;
      stakedAmount.value = 0;
      dayStaked.value = "0 days 0 hours / 0 days";
      earnedRewards.value = 0;
      isUnlockReady.value = false;
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
    const stakeTx = await insurancePool.joinPool(amountInWei, selectedLockPeriod.value * 60 * 60 * 24, {
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

const calculateStakingTime = (startTime, minTimeStake) => {
  const now = Math.floor(Date.now() / 1000);
  const elapsedSeconds = Math.abs(now - Number(startTime));
  const totalLockDays = Math.floor(Number(minTimeStake) / (24 * 60 * 60));

  // Calculate elapsed days and hours
  const elapsedDays = Math.floor(elapsedSeconds / (24 * 60 * 60));
  const elapsedHours = Math.floor((elapsedSeconds % (24 * 60 * 60)) / (60 * 60));

  // Format the time string
  const timeString = `${elapsedDays} ${elapsedDays === 1 ? 'day' : 'days'} ${elapsedHours} ${elapsedHours === 1 ? 'hour' : 'hours'} / ${totalLockDays} days`;

  // Check if unlocked
  const unlockTime = Number(startTime) + Number(minTimeStake);
  const isReady = now >= unlockTime;

  return {
    timeDisplay: timeString,
    isUnlocked: isReady
  };
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

const getReward = async () => {
  try {
    const signer = web3Store.provider.getSigner();
    const insurancePool = new ethers.Contract(
        getContractAddress("INSURANCE_POOL", web3Store.chainId),
        insurancePoolABI,
        signer
    );

    transactionType.value = "getreward";
    transactionStatus.value = "pending";

    const unstakeTx = await insurancePool.getReward();
    currentTxHash.value = unstakeTx.hash;

    await unstakeTx.wait();
    transactionStatus.value = "success";

    await loadPositionState();

    // Auto-close on success after delay
    setTimeout(resetTransaction, 3000);
  } catch (error) {
    console.error("Get reward error:", error);
    transactionStatus.value = "failed";
    transactionError.value =
        error.code === 4001 ? "Transaction rejected" : "Get reward failed";
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
