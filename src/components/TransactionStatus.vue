<template>
  <div
      v-if="show"
      @click="close"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
      <!-- Stake Flow -->
      <div v-if="type === 'stake'" class="mb-6">
        <div class="flex items-center mb-6">
          <div
              :class="[
              'w-8 h-8 rounded-full flex items-center justify-center text-sm',
              status === 'approval_pending'
                ? 'bg-blue-100 text-blue-600'
                : status === 'approval_success'
                ? 'bg-green-100 text-green-600'
                : status === 'approval_failed'
                ? 'bg-red-100 text-red-600'
                : 'bg-gray-100 text-gray-600',
            ]"
          >
            1
          </div>
          <div class="ml-3 flex-1">
            <div class="font-medium">Approve {{ tokenTicker }}</div>
            <div class="text-sm text-gray-500">
              Allow smart contract to use your {{ tokenTicker }}
            </div>
          </div>
          <div
              v-if="status === 'approval_pending'"
              class="ml-2 animate-spin w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full"
          ></div>
          <div
              v-else-if="status === 'approval_success'"
              class="ml-2 text-green-600"
          >
            <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
              <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>
        </div>

        <div class="flex items-center">
          <div
              :class="[
              'w-8 h-8 rounded-full flex items-center justify-center text-sm',
              status === 'stake_pending'
                ? 'bg-blue-100 text-blue-600'
                : status === 'stake_success'
                ? 'bg-green-100 text-green-600'
                : status === 'stake_failed'
                ? 'bg-red-100 text-red-600'
                : 'bg-gray-100 text-gray-600',
            ]"
          >
            2
          </div>
          <div class="ml-3 flex-1">
            <div class="font-medium">Stake {{ tokenTicker }}</div>
            <div class="text-sm text-gray-500">
              Deposit your {{ tokenTicker }} into the pool
            </div>
          </div>
          <div
              v-if="status === 'stake_pending'"
              class="ml-2 animate-spin w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full"
          ></div>
          <div
              v-else-if="status === 'stake_success'"
              class="ml-2 text-green-600"
          >
            <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
              <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>
        </div>
      </div>

      <!-- Unstake Flow -->
      <div v-else-if="type === 'unstake'">
        <div class="flex items-center mb-6">
          <div class="ml-3 flex-1">
            <div class="font-medium">Unstake {{ tokenTicker }}</div>
            <div class="text-sm text-gray-500">
              Withdraw your {{ tokenTicker }} from the pool
            </div>
          </div>
          <div
              v-if="status === 'pending'"
              class="ml-2 animate-spin w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full"
          ></div>
          <div v-else-if="status === 'success'" class="ml-2 text-green-600">
            <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
              <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>
        </div>
      </div>

      <!-- Execute Claim Flow -->
      <div v-else-if="type === 'execute'">
        <div class="flex items-center mb-6">
          <div class="ml-3 flex-1">
            <div class="font-medium">Execute Claim</div>
            <div class="text-sm text-gray-500">
              Process the approved claim payout
            </div>
          </div>
          <div
              v-if="status === 'pending'"
              class="ml-2 animate-spin w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full"
          ></div>
          <div v-else-if="status === 'success'" class="ml-2 text-green-600">
            <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
              <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>
        </div>
      </div>

      <!-- Get Reward Flow -->
      <div v-else-if="type === 'getreward'">
        <div class="flex items-center mb-6">
          <div class="ml-3 flex-1">
            <div class="font-medium">Get Reward</div>
            <div class="text-sm text-gray-500">
              Process the reward payout
            </div>
          </div>
          <div
              v-if="status === 'pending'"
              class="ml-2 animate-spin w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full"
          ></div>
          <div v-else-if="status === 'success'" class="ml-2 text-green-600">
            <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
              <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>
        </div>
      </div>

      <!-- Error Display -->
      <div
          v-if="error"
          class="mt-4 p-3 bg-red-50 rounded-lg text-red-600 text-sm"
      >
        {{ error }}
      </div>

      <!-- Transaction Hash Display -->
      <div
          v-if="txHash"
          class="mt-4 p-3 bg-gray-50 rounded-lg text-sm break-all"
      >
        <div class="text-gray-500 mb-1">Transaction Hash:</div>
        <a
            :href="'https://etherscan.io/tx/' + txHash"
            target="_blank"
            class="text-blue-600 hover:text-blue-700"
        >
          {{ txHash }}
        </a>
      </div>

      <!-- Action Buttons -->
      <div class="mt-6 space-y-3">
        <button
            v-if="status.includes('failed')"
            @click.stop="$emit('retry')"
            class="btn-primary w-full py-2 rounded-lg focus:outline-none"
        >
          Retry Transaction
        </button>

        <button
            v-if="status.includes('success') || status.includes('failed')"
            @click.stop="close"
            class="btn-secondary w-full py-2 rounded-lg focus:outline-none"
        >
          {{ status.includes("success") ? "Close" : "Cancel" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {defineEmits, onMounted, onUnmounted} from "vue";

const props = defineProps({
  show: Boolean,
  status: String,
  type: String,
  txHash: String,
  error: String,
  tokenTicker: {
    type: String,
    default: 'BTC'
  }
});

const emit = defineEmits(["close", "retry"]);

const close = () => {
  emit("close");
};

const handleKeydown = (e) => {
  if (e.key === "Escape") {
    close();
  }
};

onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeydown);
});
</script>