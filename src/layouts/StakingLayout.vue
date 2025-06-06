<template>
  <div class="min-h-[85vh] bg-gray-50">
    <div class="max-w-6xl mx-auto px-4 py-8">
      <!-- Main Container -->
      <div class="bg-white rounded-xl p-6 mb-8 border border-gray-100 transition-all duration-300">
        <!-- Header with Dashboard Section -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
          <!-- Left: Title and APR Display -->
          <div class="flex flex-col space-y-6">
            <div>
              <h1 class="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3 mb-2">
                <svg class="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Insurance Pool
              </h1>
              <p class="text-gray-500 text-lg">Stake your BTC to earn rewards while providing insurance</p>
            </div>

            <!-- APR Display -->
            <div class="bg-gradient-to-r from-yellow-50 to-yellow-100 p-6 rounded-xl border border-yellow-200 transform transition-all duration-300 hover:shadow-md">
              <div class="flex items-center gap-3 mb-3">
                <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                </svg>
                <span class="text-lg font-medium text-gray-700">Current APR</span>
              </div>
              <div class="text-5xl font-bold text-yellow-600 flex items-baseline">
                {{ poolAPR }}<span class="text-2xl ml-1">%</span>
              </div>
              <div class="mt-2 text-sm text-yellow-700">Earn rewards for providing insurance</div>
            </div>
          </div>

          <!-- Right: Your Overview Cards -->
          <div class="flex flex-col">
            <h2 class="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              Pool Overview
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
              <div class="bg-gray-50 p-5 rounded-xl border border-gray-200 hover:shadow-sm transition-all duration-300 flex flex-col">
                <div class="text-sm text-gray-600 mb-1 flex items-center gap-2">
                  Your Total Stake
                </div>
                <div class="text-2xl font-semibold text-gray-900 mt-1">{{ userTotalStakedAmount }} <span class="text-lg font-medium text-gray-700">BTC</span></div>
              </div>

              <div class="bg-gray-50 p-5 rounded-xl border border-gray-200 hover:shadow-sm transition-all duration-300 flex flex-col">
                <div class="text-sm text-gray-600 mb-1 flex items-center gap-2">
                  Pool TVL
                </div>
                <div class="text-2xl font-semibold text-gray-900 mt-1">{{ totalStakedAmount }} <span class="text-lg font-medium text-gray-700">BTC</span></div>
              </div>

              <div class="bg-gradient-to-r from-gray-50 to-yellow-50 p-5 rounded-xl border border-yellow-100 md:col-span-2 hover:shadow-sm transition-all duration-300">
                <div class="text-sm text-gray-700 mb-1 flex items-center gap-2">
                  Available Rewards
                </div>
                <div class="flex items-center justify-between">
                  <div class="text-2xl font-semibold text-gray-900 mt-1">{{ earnedRewards }} <span class="text-lg font-medium text-gray-700">BTC</span></div>
                  <button
                      @click="getReward"
                      :disabled="!earnedRewards || firstTxStatus !== ''"
                      class="btn-secondary px-4 py-2 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    Claim
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Button -->
        <div class="flex justify-center mt-2">
          <button
              @click="openNewPositionDialog"
              class="flex items-center justify-center btn-primary px-8 py-3 rounded-lg shadow-sm hover:shadow transition-all duration-300 font-medium"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
            New Staking Position
          </button>
        </div>
      </div>

      <!-- Positions Table Section -->
      <div class="bg-white rounded-xl p-0 border border-gray-100 transition-all duration-300">
        <div class="p-5 border-b border-gray-200 flex justify-between items-center">
          <h2 class="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <svg class="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Active Positions
          </h2>
          <div class="text-sm text-gray-500">{{ positions.length }} active position{{ positions.length !== 1 ? 's' : '' }}</div>
        </div>

        <!-- Enhanced Positions Table -->
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-gray-600">
            <thead>
            <tr class="bg-gray-50 text-left">
              <th class="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-900">ID</th>
              <th class="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-900">Start Date</th>
              <th class="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-900">Amount</th>
              <th class="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-900">Lock Period</th>
              <th class="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-900">Status</th>
              <th class="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-900">Actions</th>
            </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
            <tr v-if="positions.length === 0">
              <td colspan="6" class="px-6 py-12 text-center text-gray-500">
                <div class="flex flex-col items-center justify-center">
                  <svg class="w-12 h-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <p>No active positions</p>
                  <button
                      @click="openNewPositionDialog"
                      class="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-300 text-sm font-medium"
                  >
                    Create your first position
                  </button>
                </div>
              </td>
            </tr>
            <tr
                v-for="position in positions"
                :key="position.id"
                class="hover:bg-gray-50 transition-all duration-300"
            >
              <td class="px-6 py-5">
                <div class="flex justify-center items-center">
                    <span class="inline-flex items-center justify-center min-w-[2.5rem] px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                      {{ position.id }}
                    </span>
                </div>
              </td>
              <td class="px-6 py-5">
                <div class="flex justify-center items-center text-gray-600">
                  {{ formatDate(position.startDate) }}
                </div>
              </td>
              <td class="px-6 py-5 text-right font-medium whitespace-nowrap">
                {{ position.stakedAmount }}
                <span class="ml-1 text-gray-500 font-normal">BTC</span>
              </td>
              <td class="px-6 py-5">
                <div class="flex items-center justify-center gap-3">
                    <span class="text-sm whitespace-nowrap text-gray-600 min-w-[4.5rem] text-center">
                      {{ position.dayStaked }}
                    </span>
                </div>
              </td>
              <td class="px-6 py-5">
                <div class="flex justify-center">
                    <span
                        class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors duration-300"
                        :class="position.isUnlocked ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'"
                    >
                      <span class="w-2 h-2 rounded-full mr-1" :class="position.isUnlocked ? 'bg-green-500' : 'bg-yellow-500'"></span>
                      {{ position.isUnlocked ? 'Unlocked' : 'Locked' }}
                    </span>
                </div>
              </td>
              <td class="px-6 py-5 text-center">
                <button
                    @click="unstakePosition(position.id)"
                    :disabled="!position.isUnlocked || firstTxStatus !== ''"
                    class="btn-secondary px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-sm"
                >
                    <span class="flex items-center">
                      Unstake
                    </span>
                </button>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- New Position Dialog -->
    <NewPositionDialog
        :is-open="isNewPositionDialogOpen"
        :pool-contract="insurancePool"
        @close="closeNewPositionDialog"
        @position-created="handlePositionCreated"
    />

    <!-- Transaction Status Modal -->
    <TransactionStatus
        :show="!!(firstTxStatus || secondTxStatus)"
        :steps="transactionSteps"
        :tx-hash="currentTxHash"
        :error="transactionError"
        :block-explorer="web3Store.chainId ? SUPPORTED_NETWORKS[web3Store.chainId].blockExplorerUrls[0] : ''"
        @close="resetTransaction"
        @retry="retryTransaction"
    />
  </div>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import { ethers } from "ethers";
import { useWeb3Store } from "../stores/web3Store";
import {getContractAddress, SUPPORTED_NETWORKS} from "../constants/contracts.js";
import insurancePoolABI from "../assets/abis/insurancePool.json";
import TransactionStatus from "../components/TransactionStatus.vue";
import NewPositionDialog from "../components/NewPositionDialog.vue";
import { formatDate } from "../utils.js";

// State
const positions = ref([]);
const totalStakedAmount = ref(0);
const userTotalStakedAmount = ref(0);
const earnedRewards = ref(0);
const poolAPR = ref(0);
const insurancePool = ref(null);
const isNewPositionDialogOpen = ref(false);

// Transaction state
const firstTxStatus = ref("");
const secondTxStatus = ref("");
const transactionType = ref("");
const currentTxHash = ref("");
const transactionError = ref("");

const web3Store = useWeb3Store();

// Computed Properties
const transactionSteps = computed(() => {
  if (transactionType.value === 'unstake') {
    return [
      {
        id: 'unstake',
        title: `Unstake BTC`,
        description: `Withdraw your BTC from the pool`,
        status: firstTxStatus.value,
        showNumber: false
      }
    ];
  } else if (transactionType.value === 'getreward') {
    return [
      {
        id: 'getreward',
        title: 'Get Reward',
        description: 'Process the reward payout',
        status: firstTxStatus.value,
        showNumber: false
      }
    ];
  }
  return [];
});

// Methods
const initializeContracts = () => {
  const signer = web3Store.provider.getSigner();
  insurancePool.value = new ethers.Contract(
      getContractAddress("INSURANCE_POOL", web3Store.chainId),
      insurancePoolABI,
      signer
  );
};

const loadPositionState = async () => {
  try {
    if (!insurancePool.value) {
      initializeContracts();
    }

    const positionsNumber = (await insurancePool.value.positionCounter(web3Store.account)).toNumber();

    const [totalAssetsStakedRaw, userTotalShares, totalSharesAmount, rewardRate, earned, ...userPositions] = await Promise.all([
      insurancePool.value.totalAssetsStaked(),
      insurancePool.value.userTotalShares(web3Store.account),
      insurancePool.value.totalPoolShares(),
      insurancePool.value.rewardRate(),
      insurancePool.value.earned(web3Store.account),
      ...Array(positionsNumber).fill().map((_, i) =>
          insurancePool.value.getPoolPosition(web3Store.account, i)
      )
    ]);

    // Update global stats
    totalStakedAmount.value = Number(
        ethers.utils.formatEther(totalAssetsStakedRaw)
    ).toFixed(2);
    earnedRewards.value = ethers.utils.formatEther(earned);
    userTotalStakedAmount.value = Number(ethers.utils.formatEther((BigInt(userTotalShares) * BigInt(totalAssetsStakedRaw))/BigInt(totalSharesAmount))).toFixed(2);

    if (totalAssetsStakedRaw != 0) {
      poolAPR.value = ((Number((BigInt(totalAssetsStakedRaw) + BigInt(rewardRate) * BigInt(60 * 60 * 24 * 360)) * 10000n / BigInt(totalAssetsStakedRaw)) / 10000 - 1) * 100).toFixed(2);
    }

    let processedPositions = [];
    for (let i = 0; i < positionsNumber; i++) {
      const timeInfo = calculateStakingTime(userPositions[i].startDate, userPositions[i].minTimeStake);
      if(userPositions[i].active) {
        processedPositions.push({
          id: i,
          startDate: userPositions[i].startDate * 1000,
          stakedAmount: Number(
              ethers.utils.formatEther(((BigInt(userPositions[i].shares) * BigInt(totalAssetsStakedRaw)) / BigInt(totalSharesAmount)).toString())
          ).toFixed(2),
          lockPeriodDays: Math.floor(userPositions[i].minTimeStake / (24 * 3600)),
          dayStaked: timeInfo.timeDisplay,
          isUnlocked: timeInfo.isUnlocked
        });
      }
    }

    positions.value = processedPositions;
  } catch (error) {
    console.error("Error loading positions:", error);
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

const openNewPositionDialog = () => {
  isNewPositionDialogOpen.value = true;
};

const closeNewPositionDialog = () => {
  isNewPositionDialogOpen.value = false;
};

const handlePositionCreated = async () => {
  await loadPositionState();
};

// Unstake position
const unstakePosition = async (positionId) => {
  try {
    resetTransaction();

    transactionType.value = "unstake";
    firstTxStatus.value = "pending";

    const unstakeTx = await insurancePool.value.quitPool(positionId);
    currentTxHash.value = unstakeTx.hash;

    await unstakeTx.wait();
    firstTxStatus.value = "success";

    await loadPositionState();

    // Auto-close on success after delay
    setTimeout(resetTransaction, 3000);
  } catch (error) {
    console.error("Unstaking error:", error);
    firstTxStatus.value = "failed";
    transactionError.value =
        error.code === 4001 ? "Transaction rejected" : "Unstaking failed";
  }
};

const getReward = async () => {
  try {
    resetTransaction();

    transactionType.value = "getreward";
    firstTxStatus.value = "pending";

    const rewardTx = await insurancePool.value.getReward();
    currentTxHash.value = rewardTx.hash;

    await rewardTx.wait();
    firstTxStatus.value = "success";

    await loadPositionState();

    // Auto-close on success after delay
    setTimeout(resetTransaction, 3000);
  } catch (error) {
    console.error("Get reward error:", error);
    firstTxStatus.value = "failed";
    transactionError.value =
        error.code === 4001 ? "Transaction rejected" : "Get reward failed";
  }
};

// Reset transaction state
const resetTransaction = () => {
  firstTxStatus.value = "";
  secondTxStatus.value = "";
  transactionType.value = "";
  currentTxHash.value = "";
  transactionError.value = "";
};

const retryTransaction = async () => {
  resetTransaction();
  if (transactionType.value === 'unstake') {
    await unstakePosition();
  } else if (transactionType.value === 'getreward') {
    await getReward();
  }
};

// Initialize contracts and load data when web3 is connected
if (web3Store.isConnected) {
  initializeContracts();
  loadPositionState();
}

// Watch for web3 connection changes
watch(
    () => [web3Store.isConnected, web3Store.account, web3Store.chainId],
    async ([isConnected]) => {
      if (isConnected) {
        initializeContracts();
        await loadPositionState();
      }
    }
);
</script>
