<!-- src/components/ClaimDetailsDialog.vue -->
<template>
  <Transition name="fade">
    <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto" @click="onBackdropClick">
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-gray-500/70 backdrop-blur-sm transition-opacity"></div>

      <!-- Dialog -->
      <div class="flex min-h-full items-center justify-center p-4">
        <div
            class="relative w-full max-w-xl transform overflow-hidden rounded-3xl bg-white p-8 shadow-xl transition-all"
            @click.stop
        >
          <!-- Header -->
          <div class="flex items-center justify-between mb-10">
            <div class="flex items-center gap-3">
              <h3 class="text-2xl font-semibold text-gray-900">
                Claim Details
              </h3>
              <span class="text-xl text-gray-400 font-medium">#{{ claim?.id }}</span>
            </div>
            <div class="flex items-center gap-4">
              <div
                  class="px-4 py-1.5 text-sm rounded-full font-medium"
                  :class="claim?.executed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'"
              >
                {{ claim?.executed ? 'Executed' : 'Pending' }}
              </div>
              <button
                  @click="onClose"
                  class="rounded-full p-2 hover:bg-gray-100 transition-colors"
              >
                <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Content -->
          <div class="space-y-8">
            <!-- Basic Info -->
            <div class="grid grid-cols-2 gap-8">
              <!-- Amount -->
              <div>
                <label class="block text-base text-gray-500 mb-2">Claim Amount</label>
                <span class="text-2xl font-semibold text-gray-900">
                  {{ formatAmount(claim?.amount) }} BTC
                </span>
              </div>
              <!-- Creation Date -->
              <div>
                <label class="block text-base text-gray-500 mb-2">Creation Date</label>
                <span class="text-base text-gray-900 font-medium">
                  {{ formatDate(claim?.startTime) }}
                </span>
              </div>
            </div>

            <!-- Blockchain Addresses -->
            <div class="space-y-6">
              <!-- Proposer -->
              <div>
                <label class="block text-base text-gray-500 mb-2">Proposed By</label>
                <div class="flex items-center justify-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <span class="font-mono text-sm text-gray-900">{{ claim?.proposer || '0x0' }}</span>
                  <button
                      @click="copyToClipboard(claim?.proposer)"
                      class="text-gray-400 hover:text-gray-600 transition-colors"
                      title="Copy address"
                  >
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              </div>
              <!-- Receiver -->
              <div>
                <label class="block text-base text-gray-500 mb-2">Funds Recipient</label>
                <div class="flex items-center justify-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <span class="font-mono text-sm text-gray-900">{{ claim?.receiver || '0x0' }}</span>
                  <button
                      @click="copyToClipboard(claim?.receiver)"
                      class="text-gray-400 hover:text-gray-600 transition-colors"
                      title="Copy address"
                  >
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <!-- Description -->
            <div>
              <label class="block text-base text-gray-500 mb-2">Claim Description</label>
              <div class="bg-gray-50 rounded-lg">
                <div class="max-h-[200px] overflow-y-auto">
                  <p class="text-gray-900 p-4 whitespace-pre-wrap break-words">
                    {{ claim?.description || 'No description provided' }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Voting Progress -->
            <div class="space-y-4">
              <label class="block text-base text-gray-500 mb-2">Current Voting Status</label>
              <div class="space-y-4">
                <!-- For votes -->
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-gray-900 font-medium">For</span>
                    <span class="text-gray-900 font-medium">{{ formatNumber(claim?.forVotes) }}</span>
                  </div>
                  <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                        class="h-full bg-yellow-500 transition-all"
                        :style="{ width: `${calculateVotePercentage(claim?.forVotes, claim?.againstVotes)}%` }"
                    ></div>
                  </div>
                </div>
                <!-- Against votes -->
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-gray-900 font-medium">Against</span>
                    <span class="text-gray-900 font-medium">{{ formatNumber(claim?.againstVotes) }}</span>
                  </div>
                  <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                        class="h-full bg-rose-400 transition-all"
                        :style="{ width: `${calculateVotePercentage(claim?.againstVotes, claim?.forVotes)}%` }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div v-if="!claim?.executed" class="flex justify-end gap-4 pt-6">
              <button
                  @click="$emit('vote', { claimId: claim?.id, support: false })"
                  class="px-6 py-2.5 bg-rose-400 border border-rose-400 text-white text-lg rounded-xl hover:bg-white hover:text-rose-400 hover:border-rose-400 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  :disabled="!sufficientStake"
              >
                Vote Against
              </button>
              <button
                  @click="$emit('vote', { claimId: claim?.id, support: true })"
                  class="px-6 py-2.5 bg-yellow-500 border border-yellow-500 text-white text-lg rounded-xl hover:bg-white hover:text-yellow-500 hover:border-yellow-500 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  :disabled="!sufficientStake"
              >
                Vote For
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
const props = defineProps({
  claim: {
    type: Object,
    default: null
  },
  isOpen: {
    type: Boolean,
    default: false
  },
  sufficientStake: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close', 'vote']);

const calculateVotePercentage = (votes = 0, totalVotes = 0) => {
  const total = Number(votes) + Number(totalVotes);
  if (total === 0) return 0;
  return Math.round((Number(votes) / total) * 100);
};

const formatDate = (timestamp) => {
  if (!timestamp) return 'Not available';
  const date = new Date(timestamp * 1000);
  return date.toLocaleString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).replace(',', '');
};

const formatNumber = (num) => {
  if (!num) return '0';
  return new Intl.NumberFormat().format(num);
};

const formatAmount = (amount) => {
  if (!amount) return '0.00';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

const copyToClipboard = async (text) => {
  if (!text) return;
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    console.error('Failed to copy text: ', err);
  }
};

const onClose = () => {
  emit('close');
};

const onBackdropClick = () => {
  onClose();
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>