<template>
  <Transition name="fade">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 overflow-y-auto"
      @click="$emit('close')"
    >
      <div class="fixed inset-0 bg-gray-500/70 backdrop-blur-sm transition-opacity" />
      <div class="flex min-h-full items-center justify-center p-4">
        <div
          class="relative w-full max-w-xl transform overflow-hidden rounded-xl bg-white p-8 shadow-lg transition-all border border-gray-100"
          @click.stop
        >
          <!-- Dialog Header -->
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <svg
                class="w-6 h-6 text-yellow-500"
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
              Create New Position
            </h3>
            <button
              class="rounded-full p-2 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200"
              @click="$emit('close')"
            >
              <svg
                class="h-5 w-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <!-- Position Form -->
          <form
            class="space-y-6"
            @submit.prevent="handleCreatePosition"
          >
            <!-- Amount Input -->
            <div>
              <label
                for="amount"
                class="block mb-2 text-sm font-semibold text-gray-900 flex items-center gap-2"
              >
                BTC Amount to Stake
              </label>
              <div class="relative">
                <input
                  id="amount"
                  v-model="toStakeAmount"
                  type="number"
                  :disabled="isStakingDisabled"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-yellow-500 focus:border-yellow-500 focus:outline-none block w-full p-3 pr-16 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="0.1"
                  step="0.00000001"
                  min="0"
                  required
                >
                <div class="absolute inset-y-0 right-0 flex items-center pr-4">
                  <span class="text-gray-500 font-medium">BTC</span>
                </div>
              </div>
              <div class="mt-1 space-y-1">
                <p class="text-sm text-gray-500">
                  Minimum stake amount: 0.01 BTC
                </p>
                <p
                  v-if="maxStakeableAmount && Number(maxStakeableAmount) > 0"
                  class="text-sm text-gray-500"
                >
                  Maximum stake amount: {{ maxStakeableAmount }} BTC
                </p>
                <p
                  v-if="validationMessage"
                  class="text-sm text-red-600"
                >
                  {{ validationMessage }}
                </p>
              </div>
            </div>

            <!-- Episode Selection -->
            <div>
              <label class="block mb-3 text-sm font-semibold text-gray-900 flex items-center gap-2">
                Select Lock Duration
              </label>
              <div class="space-y-2 max-h-48 overflow-y-auto">
                <div
                  v-for="episode in availableEpisodes"
                  :key="episode.number"
                  class="flex items-center"
                >
                  <input
                    :id="`episode-${episode.number}`"
                    v-model="selectedEpisode"
                    type="radio"
                    name="episodeToStake"
                    :value="episode.number"
                    class="peer hidden"
                  >
                  <label
                    :for="`episode-${episode.number}`"
                    class="flex-1 flex items-center justify-between p-4 bg-white border-2 border-gray-200 rounded-lg cursor-pointer hover:border-yellow-200 hover:shadow-sm peer-checked:border-yellow-500 peer-checked:bg-yellow-50 transition-all duration-200"
                  >
                    <div class="flex flex-col">
                      <span class="text-lg font-medium">{{ episode.durationDays }} days</span>
                      <span class="text-sm text-gray-500">Lock duration</span>
                    </div>
                    <div class="text-right">
                      <span class="text-sm font-medium text-gray-700">{{ episode.unlockDate }}</span>
                      <div class="text-xs text-gray-500">Unlock Date</div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <!-- Enhanced Staking Summary -->
            <div class="bg-gradient-to-r from-gray-50 to-yellow-50 rounded-xl p-5 border border-yellow-100">
              <h4 class="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg
                  class="w-5 h-5 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Position Summary
              </h4>
              <div class="space-y-3">
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600 flex items-center gap-2">
                    <svg
                      class="w-4 h-4 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Amount to Stake
                  </span>
                  <span class="font-medium text-gray-900">{{ toStakeAmount || '0' }} BTC</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600 flex items-center gap-2">
                    <svg
                      class="w-4 h-4 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Lock Duration
                  </span>
                  <span class="font-medium text-gray-900">{{ selectedEpisodeDuration || 'Not Selected' }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600 flex items-center gap-2">
                    <svg
                      class="w-4 h-4 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z"
                      />
                    </svg>
                    Unlock Date
                  </span>
                  <span class="font-medium text-gray-900">{{ selectedEpisodeUnlockDate || 'Not Selected' }}</span>
                </div>
              </div>
            </div>

            <!-- Submit Button -->
            <div class="pt-4">
              <button
                type="submit"
                :disabled="isSubmitting || !isValidAmount || !selectedEpisode || isStakingDisabled"
                class="w-full py-4 px-4 rounded-lg font-medium shadow-sm transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                :class="[
                  isSubmitting || !isValidAmount || !selectedEpisode || isStakingDisabled
                    ? 'bg-gray-100 text-gray-400'
                    : 'bg-yellow-500 text-white hover:bg-yellow-600 hover:shadow'
                ]"
              >
                <svg
                  v-if="isSubmitting"
                  class="w-5 h-5 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  />
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                {{ isSubmitting ? 'Creating Position...' : 'Create Position' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </Transition>

  <!-- Transaction Status Modal -->
  <TransactionStatus
    :show="!!(firstTxStatus || secondTxStatus || transactionError)"
    :steps="transactionSteps"
    :tx-hash="currentTxHash"
    :error="transactionError"
    :block-explorer="web3Store.chainId ? SUPPORTED_NETWORKS[web3Store.chainId].blockExplorerUrls[0] : ''"
    @close="resetTransaction"
    @retry="retryTransaction"
  />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { parseEther, formatEther } from 'viem';
import { useWeb3Store } from '../stores/web3Store';
import {getContractAddress, SUPPORTED_NETWORKS} from '../constants/contracts.js';
import erc20ABI from '../assets/abis/erc20.json';
import { formatDate } from '../utils.js';
import TransactionStatus from '../components/TransactionStatus.vue';
import { addTxIntention, signIntention, finalizeBTCTransaction, convertETHtoBTC } from '@midl-xyz/midl-js-executor';
import { getBalance } from '@midl-xyz/midl-js-core';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  poolContract: {
    type: Object,
    required: true
  },
  maxStakeableAmount: {
    type: [String, Number],
    default: null
  }
});

const emit = defineEmits(['close', 'positionCreated']);

const EPISODE_DURATION = Math.floor((91 * 24 * 60 * 60) / 3);
const MAX_ACTIVE_EPISODES = 24;

const web3Store = useWeb3Store();
const toStakeAmount = ref(null);
const selectedEpisode = ref(null);
const currentEpisode = ref(0);
const availableEpisodes = ref([]);

const firstTxStatus = ref("");
const secondTxStatus = ref("");
const transactionType = ref("");
const currentTxHash = ref("");
const transactionError = ref("");
const isSubmitting = ref(false);

const isValidAmount = computed(() => {
  if (!toStakeAmount.value || toStakeAmount.value < 0.01) {
    return false;
  }
  
  if (props.maxStakeableAmount && Number(props.maxStakeableAmount) > 0) {
    return toStakeAmount.value <= Number(props.maxStakeableAmount);
  }
  
  return true;
});

const selectedEpisodeUnlockDate = computed(() => {
  if (!selectedEpisode.value) return null;
  const episode = availableEpisodes.value.find(ep => ep.number === selectedEpisode.value);
  return episode ? episode.unlockDate : null;
});

const selectedEpisodeDuration = computed(() => {
  if (!selectedEpisode.value) return null;
  const episode = availableEpisodes.value.find(ep => ep.number === selectedEpisode.value);
  return episode ? `${episode.durationDays} days` : null;
});

const validationMessage = computed(() => {
  if (props.maxStakeableAmount && Number(props.maxStakeableAmount) <= 0) {
    return 'Pool has reached maximum capacity. No new stakes allowed.';
  }
  
  if (!toStakeAmount.value) return '';
  
  if (toStakeAmount.value < 0.01) {
    return 'Amount must be at least 0.01 BTC';
  }
  
  if (props.maxStakeableAmount && Number(props.maxStakeableAmount) > 0 && toStakeAmount.value > Number(props.maxStakeableAmount)) {
    return `Amount exceeds maximum stakeable limit of ${props.maxStakeableAmount} BTC`;
  }
  
  return '';
});

const isStakingDisabled = computed(() => {
  return props.maxStakeableAmount && Number(props.maxStakeableAmount) <= 0;
});

const transactionSteps = computed(() => {
  return [
    {
      id: 'approve',
      title: 'Approve BTC',
      description: 'Allow smart contract to use your BTC tokens',
      status: firstTxStatus.value,
      showNumber: true
    },
    {
      id: 'stake',
      title: 'Create Position',
      description: 'Stake your BTC tokens to selected episode',
      status: secondTxStatus.value,
      showNumber: true
    }
  ];
});

const getCurrentEpisode = () => {
  return Math.floor(Date.now() / 1000 / EPISODE_DURATION);
};

const getEpisodeFinishTime = (episodeId) => {
  return (episodeId + 1) * EPISODE_DURATION;
};

const calculateAvailableEpisodes = () => {
  const current = getCurrentEpisode();
  const episodes = [];
  
  for (let i = current; i < current + MAX_ACTIVE_EPISODES; i++) {
    if (i % 3 === 2) {
      const finishTime = getEpisodeFinishTime(i);
      const unlockDate = new Date(finishTime * 1000);
      const durationDays = Math.ceil((finishTime * 1000 - Date.now()) / (1000 * 60 * 60 * 24));
      
      episodes.push({
        number: i,
        unlockDate: formatDate(unlockDate),
        durationDays: durationDays
      });
    }
  }
  
  return episodes;
};

onMounted(() => {
  currentEpisode.value = getCurrentEpisode();
  availableEpisodes.value = calculateAvailableEpisodes();
  
  if (availableEpisodes.value.length > 0) {
    selectedEpisode.value = availableEpisodes.value[0].number;
  }
});

const resetTransaction = () => {
  firstTxStatus.value = "";
  secondTxStatus.value = "";
  transactionType.value = "";
  currentTxHash.value = "";
  transactionError.value = "";
  isSubmitting.value = false;
};

const retryTransaction = () => {
  if (transactionType.value === "create_position") {
    handleCreatePosition();
  }
};

const handleStakeProcess = async (amountInWei) => {
  try {
    
    const btcAddress = getContractAddress('BTC_TOKEN', web3Store.chainId);

    const currentAllowance = await web3Store.ethClient.readContract({
      address: btcAddress,
      abi: erc20ABI,
      functionName: 'allowance',
      args: [web3Store.account, props.poolContract.address]
    });

    if (currentAllowance < amountInWei) {
      transactionType.value = "create_position";
      firstTxStatus.value = "pending";

      try {
        const hash = await web3Store.signer.writeContract({
          address: btcAddress,
          abi: erc20ABI,
          functionName: 'approve',
          args: [props.poolContract.address, amountInWei],
          account: web3Store.account
        });
        currentTxHash.value = hash;
        await web3Store.ethClient.waitForTransactionReceipt({ hash });
        firstTxStatus.value = "success";
      } catch (error) {
        firstTxStatus.value = "failed";
        transactionError.value = error.shortMessage || "Failed to approve tokens";
        throw error;
      }
    }

    secondTxStatus.value = "pending";
    const hash = await web3Store.signer.writeContract({
      address: props.poolContract.address,
      abi: props.poolContract.abi,
      functionName: 'joinPool',
      args: [amountInWei, selectedEpisode.value],
      account: web3Store.account
    });
    currentTxHash.value = hash;

    await web3Store.ethClient.waitForTransactionReceipt({ hash });
    secondTxStatus.value = "success";

    emit('positionCreated');
    emit('close');

    setTimeout(resetTransaction, 3000);
  } catch (error) {
    console.error("Position creation error:", error);
    throw error;
  }
};

const handleCreatePosition = async () => {
  if (!isValidAmount.value || !selectedEpisode.value) {
    return;
  }

  try {

    const btcBalance = await getBalance(web3Store.midlConfig, web3Store.midlAccount.address);
    console.log(btcBalance);

    isSubmitting.value = true;
    const amountInWei = convertETHtoBTC(parseEther(toStakeAmount.value.toString()));

    const btcAddress = getContractAddress('BTC_TOKEN', web3Store.chainId);
    const res = await addTxIntention(web3Store.midlConfig, {
      evmTransaction: {
        to: btcAddress,
        value: amountInWei
      },
      publicKey: web3Store.midlAccount.publicKey
    });

    console.log(res);

    const btc_tx = await finalizeBTCTransaction(web3Store.midlConfig, [res], web3Store.ethClient);
    console.log(btc_tx);

    const signed = await signIntention(web3Store.midlConfig, web3Store.ethClient, res, [res], {
      txId: btc_tx.tx.id,
    });
    console.log(signed);

    const balance = await web3Store.ethClient.readContract({
      address: btcAddress,
      abi: erc20ABI,
      functionName: 'balanceOf',
      args: [web3Store.account]
    });

    if (balance < amountInWei) {
      transactionError.value = `Insufficient BTC balance. You have ${formatEther(balance)} BTC but trying to stake ${toStakeAmount.value} BTC`;
      return;
    }

    await handleStakeProcess(amountInWei);
  } catch (error) {
    console.error('Failed to create position:', error);

    if (firstTxStatus.value !== "failed") {
      secondTxStatus.value = "failed";
      transactionError.value = error.shortMessage || "Transaction failed. Please try again";
    }
  }
};
</script>
