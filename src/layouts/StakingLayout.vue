# src/layouts/StakingLayout.vue
<template>
  <div class="min-h-[85vh] bg-gray-50">
    <div class="max-w-6xl mx-auto px-4 py-8">
      <!-- Main Container -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <!-- Header with Your Overview Section -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 ">
          <!-- Left: Title and Description -->
          <div class="flex flex-col justify-center">
            <h1 class="text-2xl md:text-4xl font-semibold text-gray-900 flex items-center gap-3 mb-2">
              <svg class="w-8 h-8 text-yellow-500 hidden md:flex" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              Insurance Pool
            </h1>
            <p class="text-gray-500 mb-4">Stake your BTC to earn rewards while providing coverage</p>

            <!-- Main APR Display -->
            <div class="bg-gradient-to-r from-yellow-50 to-yellow-100 p-6 rounded-lg border border-yellow-200">
              <div class="flex items-center gap-3 mb-2">
                <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                </svg>
                <span class="text-lg text-gray-700">Current APR</span>
              </div>
              <div class="text-4xl font-bold text-yellow-600">{{ poolAPR }}%</div>
            </div>
          </div>

          <!-- Right: Your Overview -->
          <div class="rounded-lg p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Pool Overview</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div class="text-sm text-gray-600 mb-1">Your Total Stake</div>
                <div class="text-xl font-semibold">{{ totalStakedAmount }} BTC</div>
              </div>
              <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div class="text-sm text-gray-600 mb-1">Pool TVL</div>
                <div class="text-xl font-semibold">{{ totalStakedAmount }} BTC</div>
              </div>
              <div class="bg-gray-50 p-4 rounded-lg border border-gray-200 md:col-span-2">
                <div class="text-sm text-gray-600 mb-1">Available Rewards</div>
                <div class="text-xl font-semibold">{{ earnedRewards }} BTC</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-wrap gap-4">
          <button
              @click="openNewPositionDialog"
              class="flex-1 md:flex-none inline-flex items-center justify-center btn-primary px-6 py-3 rounded-lg"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
            New Position
          </button>
          <button
              @click="getReward"
              :disabled="!earnedRewards || firstTxStatus !== ''"
              class="flex-1 md:flex-none inline-flex items-center justify-center btn-secondary px-6 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Claim Rewards
          </button>
        </div>
      </div>

        <!-- Table Section with added margin -->
        <div class="mt-8">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200">
          <div class="p-4 border-b border-gray-200">
            <h2 class="text-lg font-semibold text-gray-900">Active Positions</h2>
          </div>

          <!-- Positions Table -->
          <div class="overflow-x-auto">
            <table class="w-full text-sm text-gray-600">
              <thead>
              <tr class="bg-gray-50">
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
                <td colspan="6" class="px-6 py-10 text-center text-gray-500">
                  No active positions
                </td>
              </tr>
              <tr
                  v-for="position in positions"
                  :key="position.id"
                  class="hover:bg-gray-50/50 transition-colors"
              >
                <td class="px-6 py-4">
                  <div class="flex justify-center items-center">
          <span class="inline-flex items-center justify-center min-w-[2.5rem] px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
            {{ position.id }}
          </span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="flex justify-center items-center text-gray-600">
                    {{ formatDate(position.startDate) }}
                  </div>
                </td>
                <td class="px-6 py-4 text-right font-medium whitespace-nowrap">
                  {{ position.stakedAmount }}
                  <span class="ml-1 text-gray-500 font-normal">BTC</span>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center justify-center gap-3">
          <span class="text-sm whitespace-nowrap text-gray-600 min-w-[4.5rem] text-center">
              {{ position.dayStaked }}
            </span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="flex justify-center">
            <span
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                :class="position.isUnlocked ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'"
            >
              {{ position.isUnlocked ? 'Unlocked' : 'Locked' }}
            </span>
                  </div>
                </td>
                <td class="px-6 py-4 text-center">
                  <button
                      @click="unstakePosition(position.id)"
                      :disabled="!position.isUnlocked || firstTxStatus !== ''"
                      class="btn-secondary px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Unstake
                  </button>
                </td>
              </tr>
              </tbody>
            </table>
            </div>
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
        @close="resetTransaction"
        @retry="retryTransaction"
    />
  </div>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import { ethers } from "ethers";
import { useWeb3Store } from "../stores/web3Store";
import { getContractAddress } from "../constants/contracts.js";
import insurancePoolABI from "../assets/abis/insurancePool.json";
import TransactionStatus from "../components/TransactionStatus.vue";
import NewPositionDialog from "../components/NewPositionDialog.vue";
import { formatDate } from "../utils.js";

// State
const positions = ref([]);
const totalStakedAmount = ref(0);
const earnedRewards = ref(0);
const poolAPR = ref(0);
const baseAPR = ref(5); // Base APR rate
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

    const [totalAssetsStakedRaw, totalSharesAmount, rewardRate, earned, ...userPositions] = await Promise.all([
      insurancePool.value.totalAssetsStaked(),
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

    if (totalAssetsStakedRaw != 0) {
      poolAPR.value = ((Number((BigInt(totalAssetsStakedRaw) + BigInt(rewardRate) * BigInt(60 * 60 * 24 * 365)) * 10000n / BigInt(totalAssetsStakedRaw)) / 10000 - 1) * 100).toFixed(2);
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
    () => [web3Store.isConnected, web3Store.account],
    async ([isConnected]) => {
      if (isConnected) {
        initializeContracts();
        await loadPositionState();
      }
    }
);
</script>