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
                <button
                  class="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md border border-gray-200 hover:border-gray-300"
                  title="Back to Pools"
                  @click="$router.push('/pools')"
                >
                  <svg
                    class="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                {{ getPoolName(web3Store.chainId, parseInt(props.poolId)) }}
              </h1>
              <p class="text-gray-500 text-lg">
                Stake your BTC to earn rewards while providing insurance
              </p>
            </div>

            <!-- APR Display -->
            <div class="bg-gradient-to-r from-yellow-50 to-yellow-100 p-6 rounded-xl border border-yellow-200 transform transition-all duration-300 hover:shadow-md">
              <div class="flex items-center gap-3 mb-3">
                <svg
                  class="w-6 h-6 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
                <span class="text-lg font-medium text-gray-700">Current APR</span>
              </div>
              <div class="text-5xl font-bold text-yellow-600 flex items-baseline">
                {{ poolAPR }}<span class="text-2xl ml-1">%</span>
              </div>
              <div class="mt-2 text-sm text-yellow-700">
                Earn rewards for providing insurance
              </div>
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
                <div class="text-2xl font-semibold text-gray-900 mt-1">
                  {{ userTotalStakedAmount }} <span class="text-lg font-medium text-gray-700">BTC</span>
                </div>
              </div>

              <div class="bg-gray-50 p-5 rounded-xl border border-gray-200 hover:shadow-sm transition-all duration-300 flex flex-col">
                <div class="text-sm text-gray-600 mb-1 flex items-center gap-2">
                  Pool TVL
                </div>
                <div class="text-2xl font-semibold text-gray-900 mt-1">
                  {{ totalStakedAmount }} <span class="text-lg font-medium text-gray-700">BTC</span>
                </div>
              </div>

              <div class="bg-gradient-to-r from-gray-50 to-yellow-50 p-5 rounded-xl border border-yellow-100 md:col-span-2 hover:shadow-sm transition-all duration-300">
                <div class="text-sm text-gray-700 mb-1 flex items-center gap-2">
                  Available Rewards
                </div>
                <div class="flex items-center justify-between">
                  <div class="text-2xl font-semibold text-gray-900 mt-1">
                    {{ Number(earnedRewards).toFixed(8) }} <span class="text-lg font-medium text-gray-700">BTC</span>
                  </div>
                  <div class="relative group">
                    <button
                      :disabled="isClaimDisabled"
                      class="btn-secondary px-4 py-2 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                      @click="getReward"
                    >
                      Claim
                    </button>
                    <div
                      v-if="showClaimTooltip"
                      class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs p-2 text-xs text-white bg-gray-800 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                      Minimum claim amount is 1000 sats. (547 sats is taken as a network fee)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Button -->
        <div class="flex justify-center gap-4 mt-2">
          <!-- New Staking Position Button -->
          <button
            v-if="!isUnderwriter || (isUnderwriter && positions.length === 0)"
            class="flex items-center justify-center btn-primary px-8 py-3 rounded-lg shadow-sm hover:shadow transition-all duration-300 font-medium"
            @click="openNewPositionDialog"
          >
            <svg
              class="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            New Staking Position
          </button>
          
          <!-- Configure Pool Button -->
          <button
            v-if="isUnderwriter"
            class="flex items-center justify-center btn-secondary px-8 py-3 rounded-lg shadow-sm hover:shadow transition-all duration-300 font-medium"
            @click="navigateToUnderwriterConfig"
          >
            <svg
              class="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Configure Pool
          </button>
        </div>
      </div>

      <!-- Positions Table Section -->
      <div class="bg-white rounded-xl p-0 border border-gray-100 transition-all duration-300">
        <div class="p-5 border-b border-gray-200 flex justify-between items-center">
          <h2 class="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <svg
              class="w-5 h-5 text-yellow-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            Active Positions
          </h2>
          <div class="text-sm text-gray-500">
            {{ positions.length }} active position{{ positions.length !== 1 ? 's' : '' }}
          </div>
        </div>

        <!-- Enhanced Positions Table -->
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-gray-600">
            <thead>
              <tr class="bg-gray-50 text-left">
                <th class="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-900">
                  ID
                </th>
                <th class="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-900">
                  Amount
                </th>
                <th class="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-900">
                  Unlock Date
                </th>
                <th class="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-900">
                  Status
                </th>
                <th class="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-if="positions.length === 0">
                <td
                  colspan="6"
                  class="px-6 py-12 text-center text-gray-500"
                >
                  <div class="flex flex-col items-center justify-center">
                    <svg
                      class="w-12 h-12 text-gray-300 mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                      />
                    </svg>
                    <p>No active positions</p>
                    <div class="flex flex-col sm:flex-row gap-2 mt-4 items-center">
                      <button
                        v-if="!isUnderwriter || (isUnderwriter && positions.length === 0)"
                        class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-300 text-sm font-medium"
                        @click="openNewPositionDialog"
                      >
                        Create your first position
                      </button>
                      <button
                        v-if="isUnderwriter"
                        class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-300 text-sm font-medium"
                        @click="navigateToUnderwriterConfig"
                      >
                        Configure Pool
                      </button>
                    </div>
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
                <td class="px-6 py-5 text-right font-medium whitespace-nowrap">
                  {{ position.stakedAmount }}
                  <span class="ml-1 text-gray-500 font-normal">BTC</span>
                </td>
                <td class="px-6 py-5">
                  <div class="flex items-center justify-center gap-3">
                    <span class="text-sm whitespace-nowrap text-gray-600 min-w-[4.5rem] text-center">
                      {{ position.unlockDate }}
                    </span>
                  </div>
                </td>
                <td class="px-6 py-5">
                  <div class="flex justify-center">
                    <span
                      class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors duration-300"
                      :class="position.isUnlocked ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'"
                    >
                      <span
                        class="w-2 h-2 rounded-full mr-1"
                        :class="position.isUnlocked ? 'bg-green-500' : 'bg-yellow-500'"
                      />
                      {{ position.isUnlocked ? 'Unlocked' : 'Locked' }}
                    </span>
                  </div>
                </td>
                <td class="px-6 py-5 text-center">
                  <div class="flex gap-2 justify-center">
                    <button
                      :disabled="firstTxStatus !== ''"
                      class="btn-primary px-3 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-sm text-sm"
                      @click="openExtendPositionDialog(position)"
                    >
                      <span class="flex items-center">
                        <svg
                          class="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          />
                        </svg>
                        Extend
                      </span>
                    </button>
                    <button
                      v-if="position.isUnlocked"
                      :disabled="firstTxStatus !== ''"
                      class="btn-secondary px-3 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-sm text-sm"
                      @click="unstakePosition(position.id)"
                    >
                      <span class="flex items-center">
                        Unstake
                      </span>
                    </button>
                  </div>
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
      :max-stakeable-amount="maxStakeableAmount"
      @close="closeNewPositionDialog"
      @position-created="handlePositionCreated"
    />

    <!-- Extend Position Dialog -->
    <ExtendPositionDialog
      :is-open="isExtendPositionDialogOpen"
      :pool-contract="insurancePool"
      :position="positionToExtend"
      :max-stakeable-amount="maxStakeableAmount"
      @close="closeExtendPositionDialog"
      @position-extended="handlePositionExtended"
    />

    <!-- Transaction Status Modal -->
    <TransactionStatus
      :show="!!(firstTxStatus || secondTxStatus || thirdTxStatus || transactionError)"
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
import { formatEther, parseEther, encodeFunctionData } from "viem";
import { useRouter } from "vue-router";
import { useWeb3Store } from "../stores/web3Store";
import {getContractAddress, SUPPORTED_NETWORKS, EPISODE_DURATION} from "../constants/contracts.js";
import { getPoolName } from "../constants/pools.js";
import insurancePoolABI from "../assets/abis/insurancePool.json";
import poolFactoryABI from "../assets/abis/poolFactory.json";
import erc721ABI from "../assets/abis/erc721enumerable.json";
import wrappedTokenABI from "../assets/abis/wrappedToken.json";
import TransactionStatus from "../components/TransactionStatus.vue";
import NewPositionDialog from "../components/NewPositionDialog.vue";
import ExtendPositionDialog from "../components/ExtendPositionDialog.vue";
import { formatDate } from "../utils.js";
import { addTxIntention, signIntention, finalizeBTCTransaction, addCompleteTxIntention, convertETHtoBTC } from '@midl-xyz/midl-js-executor';
import { waitForTransaction } from '@midl-xyz/midl-js-core';

const props = defineProps({
  poolId: {
    type: String,
    default: "1"
  }
});

const MIN_CLAIM_SATS = 1000;

const positions = ref([]);
const totalStakedAmount = ref(0);
const userTotalStakedAmount = ref(0);
const earnedRewards = ref(0);
const poolAPR = ref(0);
const maxStakeableAmount = ref(0);
const insurancePool = ref(null);
const poolAddress = ref(null);
const isNewPositionDialogOpen = ref(false);
const isExtendPositionDialogOpen = ref(false);
const positionToExtend = ref({});
const isUnderwriter = ref(false);

const firstTxStatus = ref("");
const secondTxStatus = ref("");
const thirdTxStatus = ref("");
const transactionType = ref("");
const currentTxHash = ref("");
const transactionError = ref("");

const web3Store = useWeb3Store();
const router = useRouter();

const earnedSats = computed(() => Number(earnedRewards.value) * 1e8);

const isClaimDisabled = computed(() => {
  return earnedSats.value < MIN_CLAIM_SATS || firstTxStatus.value !== '';
});

const showClaimTooltip = computed(() => {
  return earnedSats.value > 0 && earnedSats.value < MIN_CLAIM_SATS && firstTxStatus.value === '';
});

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
        title: 'Claim Rewards',
        description: 'Collect your BTC rewards from the pool',
        status: firstTxStatus.value,
        showNumber: true
      },
      {
        id: 'unwrap',
        title: 'Unwrap BTC',
        description: 'Convert ERC20 tokens back to BTC',
        status: secondTxStatus.value,
        showNumber: true
      },
      {
        id: 'complete',
        title: 'Complete Transaction',
        description: 'Finalize the reward claim transaction',
        status: thirdTxStatus.value,
        showNumber: true
      }
    ];
  }
  return [];
});

const initializeContracts = async () => {
  const publicClient = web3Store.ethClient;

  const factoryAddress = getContractAddress("POOL_FACTORY", web3Store.chainId);
  if (!factoryAddress) {
    console.error("Pool factory not available for this network");
    return;
  }

  const poolIndex = parseInt(props.poolId);
  poolAddress.value = await publicClient.readContract({
    address: factoryAddress,
    abi: poolFactoryABI,
    functionName: 'pools',
    args: [poolIndex]
  });

  insurancePool.value = {
    address: poolAddress.value,
    abi: insurancePoolABI
  };
};

const loadPositionState = async () => {
  if (!insurancePool.value) {
    console.warn("Contracts not initialized yet");
    return;
  }

  const publicClient = web3Store.ethClient;

  const positionNFTAddress = getContractAddress("POSITION_NFT", web3Store.chainId);

  const positionsCount = await publicClient.readContract({
    address: positionNFTAddress,
    abi: erc721ABI,
    functionName: 'balanceOf',
    args: [web3Store.account]
  });

  const positionsIds = await Promise.all(Array(Number(positionsCount)).fill().map((_, i) => 
    publicClient.readContract({
      address: positionNFTAddress,
      abi: erc721ABI,
      functionName: 'tokenOfOwnerByIndex',
      args: [web3Store.account, i]
    })
  ));

  const [poolStats, currentEpisode, earned, poolUnderwriter, ...userPositions] = await Promise.all([
    publicClient.readContract({ ...insurancePool.value, functionName: 'poolStatsLatest' }),
    publicClient.readContract({ ...insurancePool.value, functionName: 'getCurrentEpisode' }),
    publicClient.readContract({ ...insurancePool.value, functionName: 'earnedPositions', args: [positionsIds] }),
    publicClient.readContract({ ...insurancePool.value, functionName: 'poolUnderwriter' }),
    ...positionsIds.map(positionId =>
      publicClient.readContract({ ...insurancePool.value, functionName: 'getPoolPosition', args: [positionId] })
    )
  ]);

  isUnderwriter.value = poolUnderwriter.toLowerCase() === web3Store.account.toLowerCase();

  const [totalAssetsStakedRaw, totalSharesAmount, , rewardRate, maxSharesUserToStake] = poolStats;

  const userTotalShares = userPositions.reduce((total, position) => {
    return total + position.shares;
  }, 0n);

  totalStakedAmount.value = Number(formatEther(totalAssetsStakedRaw)).toFixed(4);
  earnedRewards.value = formatEther(earned);
  userTotalStakedAmount.value = Number(formatEther((userTotalShares * totalAssetsStakedRaw) / totalSharesAmount)).toFixed(5);

  if (!isUnderwriter.value && totalSharesAmount > 0n) {
    maxStakeableAmount.value = Number(formatEther((maxSharesUserToStake * totalAssetsStakedRaw) / totalSharesAmount)).toFixed(4);
  } else {
    maxStakeableAmount.value = 0;
  }

  if (totalAssetsStakedRaw !== 0n) {
    poolAPR.value = ((Number((totalAssetsStakedRaw + rewardRate * BigInt(60 * 60 * 24 * 360)) * 10000n / totalAssetsStakedRaw) / 10000 - 1) * 100).toFixed(2);
  }

  let processedPositions = [];
  for (let i = 0; i < positionsIds.length; i++) {
    if(userPositions[i].active) {
      processedPositions.push({
        id: positionsIds[i],
        episode: Number(userPositions[i].episode),
        unlockDate: calculateStakingTime((Number(userPositions[i].episode) + 1) * EPISODE_DURATION),
        stakedAmount: Number(formatEther((userPositions[i].shares * totalAssetsStakedRaw) / totalSharesAmount)).toFixed(5),
        isUnlocked: (userPositions[i].episode + 1n) * BigInt(EPISODE_DURATION) < BigInt(Math.floor(Date.now() / 1000))
      });
    }
  }

  positions.value = processedPositions;
};

const calculateStakingTime = (unlockTime) => {
  const now = Math.floor(Date.now() / 1000);
  const unlockTimestamp = Number(unlockTime);
  const isUnlocked = now >= unlockTimestamp;

  if (isUnlocked) {
    return "Unlocked";
  }

  const unlockDate = new Date(unlockTimestamp * 1000);
  const currentDate = new Date();
  
  const isToday = unlockDate.toDateString() === currentDate.toDateString();
  
  if (isToday) {
    const timeLeft = unlockTimestamp - now;
    const hoursLeft = Math.floor(timeLeft / 3600);
    const minutesLeft = Math.floor((timeLeft % 3600) / 60);
    
    if (hoursLeft > 0) {
      return `${hoursLeft}h ${minutesLeft}m left`;
    } else {
      return `${minutesLeft}m left`;
    }
  }
  
  const formattedDate = formatDate(unlockDate);
  return formattedDate;
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

const openExtendPositionDialog = (position) => {
  positionToExtend.value = position;
  isExtendPositionDialogOpen.value = true;
};

const closeExtendPositionDialog = () => {
  isExtendPositionDialogOpen.value = false;
  positionToExtend.value = null;
};

const handlePositionExtended = async () => {
  await loadPositionState();
};

const navigateToUnderwriterConfig = () => {
  router.push(`/underwriter/${props.poolId}`);
};

const unstakePosition = async (positionId) => {
  try {
    resetTransaction();

    transactionType.value = "unstake";
    firstTxStatus.value = "pending";

    const walletClient = web3Store.signer;
    const hash = await walletClient.writeContract({
      ...insurancePool.value,
      functionName: 'quitPool',
      args: [positionId],
      account: web3Store.account
    });
    currentTxHash.value = hash;

    await web3Store.ethClient.waitForTransactionReceipt({ hash });
    firstTxStatus.value = "success";

    await loadPositionState();

    setTimeout(resetTransaction, 3000);
  } catch (error) {
    console.error("Unstaking error:", error);
    firstTxStatus.value = "failed";
    transactionError.value = error.shortMessage || "Unstaking failed";
  }
};

const getReward = async () => {
  try {
    resetTransaction();

    transactionType.value = "getreward";
    const positionIds = positions.value.map(position => position.id);

    const collectRewardsIntention = await addTxIntention(web3Store.midlConfig, {
      evmTransaction: {
        to: insurancePool.value.address,
        data: encodeFunctionData({
          abi: insurancePool.value.abi,
          functionName: 'collectRewards',
          args: [positionIds]
        }),
        value: 0n
      }
    });

    // Get BTC token address for unwrapping
    const btcAddress = getContractAddress('BTC_TOKEN', web3Store.chainId);
    
    // Create unwrap intention to convert collected ERC20 rewards back to BTC
    const unwrapIntention = await addTxIntention(web3Store.midlConfig, {
      evmTransaction: {
        to: btcAddress,
        data: encodeFunctionData({
          abi: wrappedTokenABI,
          functionName: 'withdraw',
          args: [parseEther(earnedRewards.value.toString())]
        }),
        value: 0n
      }
    });

    const completeTxIntention = await addCompleteTxIntention(web3Store.midlConfig);

    const intentions = [collectRewardsIntention, unwrapIntention, completeTxIntention];
    const btcTx = await finalizeBTCTransaction(web3Store.midlConfig, intentions, web3Store.ethClient);
    currentTxHash.value = btcTx.tx.id;

    // Step 1: Sign collect rewards intention
    firstTxStatus.value = "pending";
    const serializedTransactions = [];
    
    const signedCollectRewardsIntention = await signIntention(web3Store.midlConfig, web3Store.ethClient, collectRewardsIntention, intentions, {
      txId: btcTx.tx.id,
    });
    serializedTransactions.push(signedCollectRewardsIntention);
    firstTxStatus.value = "success";
    
    // Step 2: Sign unwrap intention
    secondTxStatus.value = "pending";
    const signedUnwrapIntention = await signIntention(web3Store.midlConfig, web3Store.ethClient, unwrapIntention, intentions, {
      txId: btcTx.tx.id,
    });
    serializedTransactions.push(signedUnwrapIntention);
    secondTxStatus.value = "success";
    
    // Step 3: Sign complete transaction intention
    thirdTxStatus.value = "pending";
    const signedCompleteTxIntention = await signIntention(web3Store.midlConfig, web3Store.ethClient, completeTxIntention, intentions, {
      txId: btcTx.tx.id,
    });
    serializedTransactions.push(signedCompleteTxIntention);
    
    await web3Store.ethClient.sendBTCTransactions({
      serializedTransactions,
      btcTransaction: btcTx.tx.hex,
    });
    await waitForTransaction(web3Store.midlConfig, btcTx.tx.id, 1);

    thirdTxStatus.value = "success";
    await loadPositionState();

    setTimeout(resetTransaction, 3000);
  } catch (error) {
    console.error("Get reward error:", error);
    // Set the appropriate step as failed based on where the error occurred
    if (firstTxStatus.value === "pending") {
      firstTxStatus.value = "failed";
    } else if (secondTxStatus.value === "pending") {
      secondTxStatus.value = "failed";
    } else if (thirdTxStatus.value === "pending") {
      thirdTxStatus.value = "failed";
    } else {
      // If no step was pending, assume it failed during the first step
      firstTxStatus.value = "failed";
    }
    transactionError.value = error.shortMessage || "Get reward failed";
  }
};

const resetTransaction = () => {
  firstTxStatus.value = "";
  secondTxStatus.value = "";
  thirdTxStatus.value = "";
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

if (web3Store.isConnected) {
  initializeContracts().then(async () => {
   loadPositionState();
  });
}

watch(
    () => [web3Store.isConnected, web3Store.account, web3Store.chainId],
    async ([isConnected]) => {
      if (isConnected) {
        initializeContracts().then(async () => {
        loadPositionState();
      });
      }
    }
);

</script>
