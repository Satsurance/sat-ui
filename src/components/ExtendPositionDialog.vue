<template>
  <Transition name="fade">
    <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto" @click="$emit('close')">
      <div class="fixed inset-0 bg-gray-500/70 backdrop-blur-sm transition-opacity"></div>
      <div class="flex min-h-full items-center justify-center p-4">
        <div
            class="relative w-full max-w-xl transform overflow-hidden rounded-xl bg-white p-8 shadow-lg transition-all border border-gray-100"
            @click.stop
        >
          <!-- Dialog Header -->
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <svg class="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              Extend Position #{{ position?.id }}
            </h3>
            <button
                @click="$emit('close')"
                class="rounded-full p-2 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200"
            >
              <svg class="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <!-- Current Position Info -->
          <div class="bg-gray-50 rounded-xl p-5 mb-6 border border-gray-200">
            <h4 class="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              Current Position Details
            </h4>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <span class="text-sm text-gray-600">Staked Amount</span>
                <div class="text-lg font-medium text-gray-900">{{ position?.stakedAmount }} BTC</div>
              </div>
              <div>
                <span class="text-sm text-gray-600">Current Unlock Date</span>
                <div class="text-lg font-medium text-gray-900">{{ position?.unlockDate }}</div>
              </div>
            </div>
          </div>

          <!-- Extend Form -->
          <form @submit.prevent="handleExtendPosition" class="space-y-6">
            <!-- Action Type Selection -->
            <div>
              <label class="block mb-3 text-sm font-semibold text-gray-900">
                Select Action
              </label>
              <div :class="['grid gap-2 sm:gap-3', isPositionExpired ? 'grid-cols-3' : 'grid-cols-2']">
                <div>
                  <input
                      type="radio"
                      id="extend"
                      name="actionType"
                      value="extend"
                      v-model="actionType"
                      class="peer hidden"
                  />
                  <label
                      for="extend"
                      :class="['flex items-center justify-center bg-white border-2 border-gray-200 rounded-lg cursor-pointer hover:border-yellow-200 hover:shadow-sm peer-checked:border-yellow-500 peer-checked:bg-yellow-50 transition-all duration-200', isPositionExpired ? 'p-3' : 'p-4']"
                  >
                    <div class="text-center">
                      <svg :class="['mx-auto mb-2 text-yellow-600', isPositionExpired ? 'w-5 h-5' : 'w-6 h-6']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                      </svg>
                      <span :class="['font-medium', isPositionExpired ? 'text-sm' : '']">Extend Only</span>
                      <div class="text-xs text-gray-500 mt-1">Change lock duration</div>
                    </div>
                  </label>
                </div>
                <div>
                  <input
                      type="radio"
                      id="deposit"
                      name="actionType"
                      value="deposit"
                      v-model="actionType"
                      class="peer hidden"
                  />
                  <label
                      for="deposit"
                      :class="['flex items-center justify-center bg-white border-2 border-gray-200 rounded-lg cursor-pointer hover:border-green-200 hover:shadow-sm peer-checked:border-green-500 peer-checked:bg-green-50 transition-all duration-200', isPositionExpired ? 'p-3' : 'p-4']"
                  >
                    <div class="text-center">
                      <svg :class="['mx-auto mb-2 text-green-600', isPositionExpired ? 'w-5 h-5' : 'w-6 h-6']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                      </svg>
                      <span :class="['font-medium', isPositionExpired ? 'text-sm' : '']">Deposit More</span>
                      <div class="text-xs text-gray-500 mt-1">Add BTC to position</div>
                    </div>
                  </label>
                </div>
                <div v-if="isPositionExpired">
                  <input
                      type="radio"
                      id="withdraw"
                      name="actionType"
                      value="withdraw"
                      v-model="actionType"
                      class="peer hidden"
                  />
                  <label
                      for="withdraw"
                      class="flex items-center justify-center p-3 bg-white border-2 border-gray-200 rounded-lg cursor-pointer hover:border-red-200 hover:shadow-sm peer-checked:border-red-500 peer-checked:bg-red-50 transition-all duration-200"
                  >
                    <div class="text-center">
                      <svg class="w-5 h-5 mx-auto mb-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/>
                      </svg>
                      <span class="font-medium text-sm">Withdraw</span>
                      <div class="text-xs text-gray-500 mt-1">Partially withdraw BTC</div>
                    </div>
                  </label>
                </div>
              </div>
              
              <!-- Withdrawal Restriction Notice -->
              <div v-if="!isPositionExpired" class="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div class="flex items-start gap-2">
                  <svg class="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <div>
                    <p class="text-sm font-medium text-blue-900">Withdrawal Not Available</p>
                    <p class="text-xs text-blue-700 mt-1">
                      BTC can only be withdrawn from expired positions. This position unlocks on {{ position?.unlockDate }}.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Amount Input -->
            <div v-if="actionType && actionType !== 'extend'">
              <label :for="`${actionType}-amount`" class="block mb-2 text-sm font-semibold text-gray-900">
                {{ actionType === 'deposit' ? 'Amount to Deposit' : 'Amount to Withdraw' }}
              </label>
              <div class="relative">
                <input
                    type="number"
                    :id="`${actionType}-amount`"
                    v-model="amount"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-yellow-500 focus:border-yellow-500 focus:outline-none block w-full p-3 pr-16 transition-colors duration-200"
                    :placeholder="actionType === 'deposit' ? '0.1' : '0.05'"
                    step="0.00000001"
                    min="0"
                    :max="actionType === 'withdraw' ? parseFloat(position?.stakedAmount || 0) : undefined"
                    required
                />
                <div class="absolute inset-y-0 right-0 flex items-center pr-4">
                  <span class="text-gray-500 font-medium">BTC</span>
                </div>
              </div>
              <p class="mt-1 text-sm text-gray-500">
                {{ actionType === 'deposit' 
                    ? 'Minimum deposit: 0.01 BTC' 
                    : `Maximum withdrawal: ${position?.stakedAmount || 0} BTC` 
                }}
              </p>
            </div>

            <!-- Episode Selection -->
            <div>
              <label class="block mb-3 text-sm font-semibold text-gray-900">
                Select New Lock Duration
              </label>
              <div class="space-y-2 max-h-48 overflow-y-auto">
                <div
                    v-for="episode in availableEpisodes"
                    :key="episode.number"
                    class="flex items-center"
                >
                  <input
                      type="radio"
                      :id="`episode-${episode.number}`"
                      name="episodeToStake"
                      :value="episode.number"
                      v-model="selectedEpisode"
                      class="peer hidden"
                  />
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

            <!-- Enhanced Extend Summary -->
            <div class="bg-gradient-to-r from-gray-50 to-yellow-50 rounded-xl p-5 border border-yellow-100">
              <h4 class="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Extension Summary
              </h4>
              <div class="space-y-3">
                <div v-if="actionType !== 'extend'" class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">
                    {{ actionType === 'deposit' ? 'Amount to Deposit' : 'Amount to Withdraw' }}
                  </span>
                  <span class="font-medium text-gray-900">{{ amount || '0' }} BTC</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">New Lock Duration</span>
                  <span class="font-medium text-gray-900">{{ selectedEpisodeDuration || 'Not Selected' }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">New Unlock Date</span>
                  <span class="font-medium text-gray-900">{{ selectedEpisodeUnlockDate || 'Not Selected' }}</span>
                </div>
              </div>
            </div>

            <!-- Submit Button -->
            <div class="pt-4">
              <button
                  type="submit"
                  :disabled="isSubmitting || !isValidForm"
                  class="w-full py-4 px-4 rounded-lg font-medium shadow-sm transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  :class="[
                  isSubmitting || !isValidForm
                    ? 'bg-gray-100 text-gray-400'
                    : 'bg-yellow-500 text-white hover:bg-yellow-600 hover:shadow'
                ]"
              >
                <svg v-if="isSubmitting" class="w-5 h-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ isSubmitting ? 'Extending Position...' : 'Extend Position' }}
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
import { ref, computed, onMounted, watch } from 'vue';
import { ethers } from 'ethers';
import { useWeb3Store } from '../stores/web3Store';
import { getContractAddress, SUPPORTED_NETWORKS, EPISODE_DURATION } from '../constants/contracts.js';
import erc20ABI from '../assets/abis/erc20.json';
import { formatDate } from '../utils.js';
import TransactionStatus from '../components/TransactionStatus.vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  poolContract: {
    type: Object,
    required: true
  },
  position: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['close', 'positionExtended']);

// Constants from the contract
const MAX_ACTIVE_EPISODES = 24;

// State
const web3Store = useWeb3Store();
const actionType = ref(''); // 'deposit' or 'withdraw'
const amount = ref(null);
const selectedEpisode = ref(null);
const currentEpisode = ref(0);
const availableEpisodes = ref([]);

// Transaction state
const firstTxStatus = ref("");
const secondTxStatus = ref("");
const transactionType = ref("");
const currentTxHash = ref("");
const transactionError = ref("");
const isSubmitting = ref(false);

// Computed
const isValidForm = computed(() => {
  if (!actionType.value || !selectedEpisode.value) {
    return false;
  }
  
  // For extend only, we don't need an amount
  if (actionType.value === 'extend') {
    return true;
  }
  
  // For deposit and withdraw, we need a valid amount
  return amount.value && 
         amount.value > 0 && 
         (actionType.value !== 'withdraw' || amount.value <= parseFloat(props.position?.stakedAmount || 0));
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

const isPositionExpired = computed(() => {
  if (!props.position?.unlockDate) return false;
  
  // Parse the unlock date string and compare with current date
  const unlockDate = new Date(props.position.unlockDate);
  const currentDate = new Date();
  
  return currentDate > unlockDate;
});

const transactionSteps = computed(() => {
  if (actionType.value === 'deposit') {
    return [
      {
        id: 'approve',
        title: 'Approve BTC',
        description: 'Allow smart contract to use your BTC tokens',
        status: firstTxStatus.value,
        showNumber: true
      },
      {
        id: 'extend',
        title: 'Extend Position',
        description: 'Extend position with additional deposit',
        status: secondTxStatus.value,
        showNumber: true
      }
    ];
  } else if (actionType.value === 'withdraw') {
    return [
      {
        id: 'extend',
        title: 'Extend Position',
        description: 'Extend position with withdrawal',
        status: firstTxStatus.value,
        showNumber: false
      }
    ];
  } else {
    return [
      {
        id: 'extend',
        title: 'Extend Position',
        description: 'Extend position lock duration',
        status: firstTxStatus.value,
        showNumber: false
      }
    ];
  }
});

// Episode calculation functions
const getCurrentEpisode = () => {
  return Math.floor(Date.now() / 1000 / EPISODE_DURATION);
};

const getEpisodeFinishTime = (episodeId) => {
  return (episodeId + 1) * EPISODE_DURATION;
};

const calculateAvailableEpisodes = () => {
  const current = getCurrentEpisode();
  const positionEpisode = props.position?.episode || 0;
  const episodes = [];
  
  for (let i = current; i < current + MAX_ACTIVE_EPISODES; i++) {
    // Check if episode satisfies the modulo 3 == 2 rule AND is later than current position's episode
    if (i % 3 === 2 && i > positionEpisode) {
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

// Reset form when dialog opens/closes
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    resetForm();
    currentEpisode.value = getCurrentEpisode();
    availableEpisodes.value = calculateAvailableEpisodes();
    
    // Select the first available episode by default
    if (availableEpisodes.value.length > 0) {
      selectedEpisode.value = availableEpisodes.value[0].number;
    }
  }
});

// Reset action type if withdraw was selected but position is no longer expired
watch([isPositionExpired, actionType], ([expired, action]) => {
  if (action === 'withdraw' && !expired) {
    actionType.value = '';
  }
});

// Methods
const resetForm = () => {
  actionType.value = 'extend';
  amount.value = null;
  selectedEpisode.value = null;
  resetTransaction();
};

const resetTransaction = () => {
  firstTxStatus.value = "";
  secondTxStatus.value = "";
  transactionType.value = "";
  currentTxHash.value = "";
  transactionError.value = "";
  isSubmitting.value = false;
};

const retryTransaction = () => {
  if (transactionType.value === "extend_position") {
    handleExtendPosition();
  }
};

const handleExtendPosition = async () => {
  if (!isValidForm.value) {
    return;
  }

  try {
    isSubmitting.value = true;
    transactionType.value = "extend_position";

    const amountInWei = actionType.value === 'extend' ? ethers.BigNumber.from(0) : ethers.utils.parseEther(amount.value.toString());
    const withdrawAmount = actionType.value === 'withdraw' ? amountInWei : ethers.BigNumber.from(0);
    const depositAmount = actionType.value === 'deposit' ? amountInWei : ethers.BigNumber.from(0);

    // Handle approval if depositing
    if (actionType.value === 'deposit') {
      const signer = web3Store.provider.getSigner();
      const btcContract = new ethers.Contract(
          getContractAddress('BTC_TOKEN', web3Store.chainId),
          erc20ABI,
          signer
      );

      // Check balance
      const balance = await btcContract.balanceOf(web3Store.account);
      if (balance.lt(amountInWei)) {
        transactionError.value = `Insufficient BTC balance. You have ${ethers.utils.formatEther(
            balance
        )} BTC but trying to deposit ${amount.value} BTC`;
        return;
      }

      // Check allowance
      const currentAllowance = await btcContract.allowance(
          web3Store.account,
          props.poolContract.address
      );

      // Handle approval if needed
      if (currentAllowance.lt(amountInWei)) {
        firstTxStatus.value = "pending";

        try {
          const approveTx = await btcContract.approve(
              props.poolContract.address,
              amountInWei,
              { from: web3Store.account }
          );
          currentTxHash.value = approveTx.hash;

          await approveTx.wait();
          firstTxStatus.value = "success";
        } catch (error) {
          firstTxStatus.value = "failed";
          transactionError.value =
              error.code === 4001
                  ? "Transaction rejected by user"
                  : "Failed to approve tokens";
          throw error;
        }
      }

      // Execute extend with deposit
      secondTxStatus.value = "pending";
    } else {
      // Execute extend with withdrawal (no approval needed)
      firstTxStatus.value = "pending";
    }

    const extendTx = await props.poolContract.extendPoolPosition(
        props.position.id,
        selectedEpisode.value,
        withdrawAmount,
        depositAmount,
        { from: web3Store.account }
    );
    currentTxHash.value = extendTx.hash;

    await extendTx.wait();
    
    if (actionType.value === 'deposit') {
      secondTxStatus.value = "success";
    } else {
      firstTxStatus.value = "success";
    }

    emit('positionExtended');
    emit('close');

    // Auto-close on success after delay
    setTimeout(resetTransaction, 3000);
  } catch (error) {
    console.error('Failed to extend position:', error);

    if (actionType.value === 'deposit' && firstTxStatus.value !== "failed") {
      secondTxStatus.value = "failed";
    } else {
      firstTxStatus.value = "failed";
    }
    
    transactionError.value =
        error.code === 4001
            ? "Transaction rejected by user"
            : error.code === -32603
                ? "Insufficient balance or internal error"
                : error.message || "Transaction failed. Please try again";
  }
};
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style> 