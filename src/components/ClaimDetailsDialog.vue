<!-- src/components/ClaimDetailsDialog.vue -->
<template>
  <Transition name="fade">
    <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto" @click="onBackdropClick">
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-gray-500/70 backdrop-blur-sm transition-opacity"></div>

      <!-- Dialog -->
      <div class="flex min-h-full items-center justify-center p-4">
        <div class="relative w-full max-w-xl transform overflow-hidden rounded-3xl bg-white p-8 shadow-xl transition-all" @click.stop>
          <!-- Header -->
          <div class="flex items-center justify-between mb-2.5 md:mb-10">
            <div class="flex items-center gap-3">
              <h3 class="text-2xl font-semibold text-gray-900">Claim Details</h3>
              <span class="text-xl text-gray-400 font-medium">#{{ claim?.id }}</span>
            </div>
            <div class="flex items-center gap-4">
              <div class="hidden md:flex px-4 py-1.5 text-sm rounded-full font-medium" :class="getStatusClasses">
                {{ getStatusText }}
              </div>
              <button @click="onClose" class="rounded-full p-2 hover:bg-gray-100 transition-colors">
                <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div class="flex md:hidden px-4 py-1.5 text-sm rounded-full font-medium w-max mb-2.5" :class="getStatusClasses">
            {{ getStatusText }}
          </div>

          <div class="w-full">
            <div class="w-full flex flex-row justify-between mb-2.5 md:mb-10">
              <div>
                <label class="block text-base text-gray-500 mb-2">Claim Amount</label>
                <div class="space-y-1">
                  <div class="text-2xl font-semibold text-gray-900">
                    {{ formatAmount(claim?.amount) }} BTC
                  </div>
                  <div v-if="claimReduction > 0" class="text-sm text-gray-600">
                    Actual payout: {{ formatAmount(getActualPayoutAmount) }} BTC
                    <span class="text-red-600">(-{{ getReductionPercentage }}%)</span>
                  </div>
                </div>
              </div>
              <div>
                <label class="block text-base text-gray-500 mb-2">Creation Date</label>
                <span class="text-base text-gray-900 font-medium">
                  {{ formatDate(claim?.startTime) }}
                </span>
              </div>
            </div>

            <div class="space-y-6">
              <!-- Proposer -->
              <div>
                <label class="block text-base text-gray-500 mb-2">Proposed By</label>
                <div class="flex items-center justify-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <span class="font-mono text-sm text-gray-900 whitespace-nowrap overflow-x-auto inline-block">
                    {{ claim?.proposer || "0x0" }}
                  </span>
                  <button @click="copyToClipboard(claim?.proposer)" class="text-gray-400 hover:text-gray-600 transition-colors" title="Copy address">
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
                  <span class="font-mono text-sm text-gray-900 whitespace-nowrap overflow-x-auto inline-block">
                    {{ claim?.receiver || "0x0" }}
                  </span>
                  <button @click="copyToClipboard(claim?.receiver)" class="text-gray-400 hover:text-gray-600 transition-colors" title="Copy address">
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Pool Address -->
              <div>
                <label class="block text-base text-gray-500 mb-2">Pool Address</label>
                <div class="flex items-center justify-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <span class="font-mono text-sm text-gray-900 whitespace-nowrap overflow-x-auto inline-block">
                    {{ claim?.poolAddress || "0x0" }}
                  </span>
                  <button @click="copyToClipboard(claim?.poolAddress)" class="text-gray-400 hover:text-gray-600 transition-colors" title="Copy address">
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Cover Details - Only shown for new format claims -->
              <div v-if="claim?.cover">
                <label class="block text-base text-gray-500 mb-2">Cover Details</label>
                <div class="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-600">Protocol</span>
                    <span class="text-sm font-medium text-gray-900">{{ claim.cover.protocol }}</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-600">Cover Period</span>
                    <span class="text-sm font-medium text-gray-900">
                      {{ formatDate(claim.cover.startDate / 1000) }} - {{ formatDate(claim.cover.endDate / 1000) }}
                    </span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-600">Cover Amount</span>
                    <span class="text-sm font-medium text-gray-900">{{ claim.cover.amount }} BTC</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Description -->
            <div>
              <label class="block text-base text-gray-500 mb-2 mt-4">Claim Description</label>
              <div class="bg-gray-50 rounded-lg">
                <div class="max-h-[200px] overflow-y-auto">
                  <p class="text-gray-900 p-4 whitespace-pre-wrap break-words">
                    {{ claim?.description || "No description provided" }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Approval Status -->
            <div class="space-y-4">
              <label class="block text-base text-gray-500 mb-2 mt-4">Approval Status</label>
              <div class="bg-gray-50 rounded-lg p-4 space-y-3">
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">Status</span>
                  <span class="text-sm font-medium" :class="getStatusTextClasses">
                    {{ getStatusText }}
                  </span>
                </div>
                
                <!-- Control Board Approval Progress -->
                <div v-if="!claim?.approved && !claim?.spam && !claim?.executed" class="space-y-2">
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-600">Approval Votes</span>
                    <span class="text-sm font-medium" :class="canExecuteApproval ? 'text-green-600' : 'text-gray-900'">
                      {{ currentApprovalCounts.approveCount }} / {{ threshold }}
                    </span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-600">Spam Votes</span>
                    <span class="text-sm font-medium" :class="canExecuteSpam ? 'text-red-600' : 'text-gray-900'">
                      {{ currentApprovalCounts.spamCount }} / {{ threshold }}
                    </span>
                  </div>
                  
                  <!-- Progress bars -->
                  <div class="space-y-2">
                    <div class="flex justify-between items-center">
                      <span class="text-xs text-gray-500">Approval Progress</span>
                      <span class="text-xs text-gray-500">
                        {{ Math.round((currentApprovalCounts.approveCount / threshold) * 100) }}%
                      </span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        class="bg-green-500 h-2 rounded-full transition-all duration-300"
                        :style="{ width: `${Math.min((currentApprovalCounts.approveCount / threshold) * 100, 100)}%` }"
                      ></div>
                    </div>
                    
                    <div class="flex justify-between items-center">
                      <span class="text-xs text-gray-500">Spam Progress</span>
                      <span class="text-xs text-gray-500">
                        {{ Math.round((currentApprovalCounts.spamCount / threshold) * 100) }}%
                      </span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        class="bg-red-500 h-2 rounded-full transition-all duration-300"
                        :style="{ width: `${Math.min((currentApprovalCounts.spamCount / threshold) * 100, 100)}%` }"
                      ></div>
                    </div>
                  </div>
                </div>
                
                <!-- Timing Information -->
                <div v-if="claim?.approved && !claim?.executed && !isReadyForExecution" class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">Execution</span>
                  <span class="text-sm font-medium" :class="isReadyForExecution ? 'text-blue-600' : 'text-yellow-600'">
                    {{ getExecutionTimeRemaining }}
                  </span>
                </div>
                <div v-else-if="!claim?.approved && !claim?.spam && !claim?.executed" class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">Approval Deadline</span>
                  <span class="text-sm font-medium text-gray-900">
                    {{ getApprovalTimeRemaining }}
                  </span>
                </div>
                
                <div v-if="claim?.approvalTime > 0" class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">Approved On</span>
                  <span class="text-sm font-medium text-gray-900">
                    {{ formatDate(claim.approvalTime) }}
                  </span>
                </div>
                <div v-if="claimReduction > 0" class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">Claim Reduction</span>
                  <span class="text-sm font-medium text-red-600">
                    {{ getReductionPercentage }}%
                  </span>
                </div>
              </div>
            </div>

            <!-- Error Message -->
            <div v-if="errorMessage" class="mt-6">
              <div class="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3 items-start">
                <p class="text-red-700 text-sm">{{ errorMessage }}</p>
              </div>
            </div>

            <!-- Actions -->
            <div v-if="!claim?.executed && !claim?.spam" class="flex justify-end gap-4 pt-6">
              <!-- Show execute buttons when thresholds are met -->
              <template v-if="!claim?.approved && (canExecuteApproval || canExecuteSpam)">
                <button v-if="canExecuteSpam"
                        @click="$emit('execute-spam', claim?.id)"
                        class="px-6 py-2.5 bg-red-500 border border-red-500 text-white text-lg rounded-xl hover:bg-white hover:text-red-500 hover:border-red-500 transition-colors duration-300">
                  Execute Spam Marking
                </button>
                <button v-if="canExecuteApproval"
                        @click="$emit('execute-approval', claim?.id)"
                        class="px-6 py-2.5 bg-green-500 border border-green-500 text-white text-lg rounded-xl hover:bg-white hover:text-green-500 hover:border-green-500 transition-colors duration-300">
                  Execute Approval
                </button>
              </template>
              <!-- Show operator actions for pending claims - only for controllers -->
              <template v-else-if="!claim?.approved && isApprovalPeriodActive && props.isController">
                <button @click="$emit('mark-spam', claim?.id)"
                        class="px-6 py-2.5 bg-red-500 border border-red-500 text-white text-lg rounded-xl hover:bg-white hover:text-red-500 hover:border-red-500 transition-colors duration-300">
                  Vote Spam
                </button>
                <button @click="$emit('approve', claim?.id)"
                        class="btn-primary px-6 py-2.5 text-lg rounded-xl">
                  Vote Approve
                </button>
              </template>
              <!-- Show execute button for approved claims - available for everyone -->
              <button v-else-if="claim?.approved && !claim?.executed"
                      @click="$emit('execute', claim?.id)"
                      :disabled="!isReadyForExecution"
                      :class="[
                        'px-6 py-2.5 text-lg rounded-xl transition-colors duration-300',
                        isReadyForExecution
                          ? 'bg-green-500 border border-green-500 text-white hover:bg-white hover:text-green-500 hover:border-green-500'
                          : 'bg-gray-300 border border-gray-300 text-gray-500 cursor-not-allowed'
                      ]">
                {{ isReadyForExecution ? 'Execute Claim' : `Wait ${getExecutionTimeRemaining}` }}
              </button>
              <!-- Show message if approval period has expired -->
              <div v-else-if="!claim?.approved && !isApprovalPeriodActive" class="text-sm text-gray-500">
                Approval period has expired
              </div>
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
    default: null,
  },
  isOpen: {
    type: Boolean,
    default: false,
  },
  errorMessage: {
    type: String,
    default: "",
  },
  approvalPeriod: {
    type: Number,
    required: true,
  },
  executionTimeout: {
    type: Number,
    required: true,
  },
  claimReduction: {
    type: Number,
    required: true,
  },
  isController: {
    type: Boolean,
    default: false,
  },
  threshold: {
    type: Number,
    required: true,
  },
  controllersCount: {
    type: Number,
    required: true,
  },
  claimApprovals: {
    type: Map,
    required: true,
  },
});

const emit = defineEmits(["close", "approve", "mark-spam", "execute", "execute-approval", "execute-spam"]);
import { computed, onMounted, onUnmounted, ref } from "vue";
import { ethers } from "ethers";

const isApprovalPeriodActive = computed(() => {
  if (!props.claim?.startTime) return false;
  const currentTime = Math.floor(Date.now() / 1000);
  return currentTime < Number(props.claim.startTime) + props.approvalPeriod;
});

const currentApprovalCounts = computed(() => {
  if (props.claim?.id == null) return { approveCount: 0, spamCount: 0 };
  return props.claimApprovals.get(props.claim.id) || { approveCount: 0, spamCount: 0 };
});

const canExecuteApproval = computed(() => {
  return currentApprovalCounts.value.approveCount >= props.threshold && 
         !props.claim?.approved && 
         !props.claim?.spam && 
         !props.claim?.executed;
});

const canExecuteSpam = computed(() => {
  return currentApprovalCounts.value.spamCount >= props.threshold && 
         !props.claim?.approved && 
         !props.claim?.spam && 
         !props.claim?.executed;
});

const isReadyForExecution = computed(() => {
  // Access forceUpdate to ensure reactivity
  forceUpdate.value;
  
  if (!props.claim?.approved || props.claim?.executed || props.claim?.spam) return false;
  if (!props.claim?.approvalTime || !props.executionTimeout) return false;
  
  const currentTime = Math.floor(Date.now() / 1000);
  const executionReadyTime = Number(props.claim.approvalTime) + props.executionTimeout;
  
  return currentTime >= executionReadyTime;
});

const getExecutionTimeRemaining = computed(() => {
  // Access forceUpdate to ensure reactivity
  forceUpdate.value;
  
  if (!props.claim?.approved || !props.claim?.approvalTime || !props.executionTimeout) return null;
  
  const currentTime = Math.floor(Date.now() / 1000);
  const executionReadyTime = Number(props.claim.approvalTime) + props.executionTimeout;
  const timeRemaining = executionReadyTime - currentTime;
  
  if (timeRemaining <= 0) return "Ready for execution";
  
  const hours = Math.floor(timeRemaining / 3600);
  const minutes = Math.floor((timeRemaining % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m until execution`;
  }
  return `${minutes}m until execution`;
});

const getApprovalTimeRemaining = computed(() => {
  // Access forceUpdate to ensure reactivity
  forceUpdate.value;
  
  if (!props.claim?.startTime || !props.approvalPeriod) return null;
  
  const currentTime = Math.floor(Date.now() / 1000);
  const approvalDeadline = Number(props.claim.startTime) + props.approvalPeriod;
  const timeRemaining = approvalDeadline - currentTime;
  
  if (timeRemaining <= 0) return "Approval period expired";
  
  const hours = Math.floor(timeRemaining / 3600);
  const minutes = Math.floor((timeRemaining % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m left for approval`;
  }
  return `${minutes}m left for approval`;
});

const getStatusText = computed(() => {
  if (props.claim?.spam) return "Spam";
  if (props.claim?.executed) return "Executed";
  if (props.claim?.approved && isReadyForExecution.value) return "Ready for Execution";
  if (props.claim?.approved) return "Approved";
  return "Pending";
});

const getStatusClasses = computed(() => {
  if (props.claim?.spam) return "bg-red-100 text-red-800";
  if (props.claim?.executed) return "bg-green-100 text-green-800";
  if (props.claim?.approved && isReadyForExecution.value) return "bg-blue-100 text-blue-800";
  if (props.claim?.approved) return "bg-yellow-100 text-yellow-800";
  return "bg-gray-100 text-gray-800";
});

const getStatusTextClasses = computed(() => {
  if (props.claim?.spam) return "text-red-800";
  if (props.claim?.executed) return "text-green-800";
  if (props.claim?.approved && isReadyForExecution.value) return "text-blue-800";
  if (props.claim?.approved) return "text-yellow-800";
  return "text-gray-800";
});

const formatDate = (timestamp) => {
  if (!timestamp) return "Not available";
  const date = new Date(timestamp * 1000);
  return date
      .toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      })
      .replace(",", "");
};

const formatAmount = (amount) => {
  if (!amount) return "0.00";
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(ethers.utils.formatEther(amount.toString()));
};

// Calculate the actual payout amount after claim reduction
const getActualPayoutAmount = computed(() => {
  if (!props.claim?.amount || !props.claimReduction) return null;
  
  const BASIS_POINTS = 10000;
  const reductionFactor = (BASIS_POINTS - props.claimReduction) / BASIS_POINTS;
  const reducedAmount = props.claim.amount.mul(Math.floor(reductionFactor * BASIS_POINTS)).div(BASIS_POINTS);
  
  return reducedAmount;
});

const getReductionPercentage = computed(() => {
  if (!props.claimReduction) return "0";
  return (props.claimReduction / 100).toFixed(2);
});

const copyToClipboard = async (text) => {
  if (!text) return;
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    console.error("Failed to copy text: ", err);
  }
};

const onClose = () => {
  emit("close");
};

const onBackdropClick = () => {
  onClose();
};

// Timer for updating timing information
let updateTimer = null;
const forceUpdate = ref(0);

// Setup timer to update timing information every minute
onMounted(() => {
  updateTimer = setInterval(() => {
    // Force reactive updates
    forceUpdate.value++;
  }, 60000); // Update every minute
});

onUnmounted(() => {
  if (updateTimer) {
    clearInterval(updateTimer);
  }
});
</script>
