<template>
  <Transition name="fade">
    <div
        v-if="show"
        class="fixed inset-0 z-50 overflow-y-auto"
        @click="$emit('close')"
    >
      <div class="fixed inset-0 bg-gray-500/70 backdrop-blur-sm transition-opacity"></div>
      <div class="flex min-h-full items-center justify-center p-4">
        <div
            class="relative w-full max-w-xl transform overflow-hidden rounded-3xl bg-white p-8 shadow-xl transition-all"
            @click.stop
        >
          <!-- Modal Header -->
          <div class="flex items-center justify-between mb-8">
            <div class="flex items-center space-x-4">
              <h3 class="text-2xl font-semibold text-gray-900">
                {{ project.name }} cover
              </h3>
            </div>
            <button
                @click="$emit('close')"
                class="rounded-full p-2 hover:bg-gray-100 transition-colors"
            >
              <svg
                  class="h-5 w-5 text-gray-400"
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

          <!-- Cover Form -->
          <form @submit.prevent="handlePurchase" class="space-y-6">
            <!-- Cover Amount -->
            <div>
              <label
                  for="cover-amount"
                  class="block mb-2 text-sm font-medium text-gray-900"
              >
                Cover Amount (BTC)
              </label>
              <div class="space-y-1">
                <input
                    type="number"
                    id="cover-amount"
                    v-model="coverAmount"
                    @input="coverAmountError = ''"
                    placeholder="0.0001"
                    step="0.0000000001"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-yellow-500 focus:border-yellow-500 focus:outline-none block w-full p-2.5 transition-colors duration-200"
                    :class="{'border-red-300': coverAmountError}"
                    :aria-invalid="!!coverAmountError"
                    :aria-describedby="coverAmountError ? 'cover-amount-error' : undefined"
                    :disabled="isSubmitting"
                    required
                />
                <!-- Error message container with fixed height -->
                <div class="h-5 overflow-hidden">
                  <Transition
                      enter-active-class="transition-all duration-200 ease-out"
                      enter-from-class="opacity-0 -translate-y-1"
                      enter-to-class="opacity-100 translate-y-0"
                      leave-active-class="transition-all duration-200 ease-in"
                      leave-from-class="opacity-100 translate-y-0"
                      leave-to-class="opacity-0 -translate-y-1"
                  >
                    <p
                        v-if="coverAmountError"
                        id="cover-amount-error"
                        class="text-sm text-red-600"
                    >
                      {{ coverAmountError }}
                    </p>
                  </Transition>
                </div>
                <p class="text-sm text-gray-500">
                  Available range: {{ project.minCover }} - {{ project.maxCover }} BTC
                </p>
              </div>
            </div>

            <!-- Cover Duration Controls -->
            <div class="space-y-4">
              <label
                  for="cover-duration"
                  class="block text-sm font-medium text-gray-900"
              >
                Cover Duration
              </label>

              <!-- Duration Input -->
              <div class="space-y-1">
                <div
                    class="flex items-center bg-gray-50 border border-gray-300 rounded-lg p-2 focus-within:ring-2 focus-within:ring-yellow-500 focus-within:border-yellow-500 transition-colors duration-200"
                    :class="{'border-red-300': durationError}"
                >
                  <input
                      type="number"
                      id="cover-duration-input"
                      v-model="duration"
                      @input="durationError = ''"
                      step="1"
                      class="w-20 bg-transparent border-none focus:outline-none text-gray-900 text-sm p-1"
                      :aria-invalid="!!durationError"
                      :aria-describedby="durationError ? 'duration-error' : undefined"
                      :disabled="isSubmitting"
                  />
                  <span class="text-sm text-gray-600 ml-1">days</span>
                </div>

                <!-- Error message container with fixed height -->
                <div class="h-5 overflow-hidden">
                  <Transition
                      enter-active-class="transition-all duration-200 ease-out"
                      enter-from-class="opacity-0 -translate-y-1"
                      enter-to-class="opacity-100 translate-y-0"
                      leave-active-class="transition-all duration-200 ease-in"
                      leave-from-class="opacity-100 translate-y-0"
                      leave-to-class="opacity-0 -translate-y-1"
                  >
                    <p
                        v-if="durationError"
                        id="duration-error"
                        class="text-sm text-red-600"
                    >
                      {{ durationError }}
                    </p>
                  </Transition>
                </div>
              </div>

              <!-- Duration Slider with Marks -->
              <div class="space-y-2">
                <input
                    type="range"
                    id="cover-duration-slider"
                    v-model="duration"
                    @input="durationError = ''"
                    :min="30"
                    :max="360"
                    step="1"
                    class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                    :disabled="isSubmitting"
                />
                <div class="flex justify-between px-1 text-xs text-gray-500">
                  <span>30d</span>
                  <span>90d</span>
                  <span>180d</span>
                  <span>270d</span>
                  <span>360d</span>
                </div>
              </div>
            </div>

            <!-- Premium Calculation -->
            <div class="bg-gray-50 rounded-lg p-4 space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Premium Rate:</span>
                <span class="font-medium">{{ project.rate }}% per year</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Cover Duration:</span>
                <span class="font-medium">{{ duration }} days</span>
              </div>
              <div class="flex justify-between text-sm font-semibold pt-2 border-t">
                <span class="text-gray-900">Total Premium:</span>
                <span class="text-yellow-600">
                  {{ calculatePremium }} BTC
                </span>
              </div>
            </div>

            <!-- Submit Button -->
            <div class="flex justify-end pt-4">
              <button
                  type="submit"
                  :disabled="isSubmitting || hasErrors"
                  class="w-full py-3 btn-primary rounded-lg disabled:bg-gray-300 disabled:border-gray-300 disabled:cursor-not-allowed"
              >
                {{ isSubmitting ? "Processing..." : "Purchase Cover" }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  project: {
    type: Object,
    required: true
  },
  show: {
    type: Boolean,
    required: true
  },
  isSubmitting: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits(['close', 'purchase']);

const coverAmount = ref('');
const duration = ref(30);
const coverAmountError = ref('');
const durationError = ref('');

const hasErrors = computed(() => {
  return !!coverAmountError.value || !!durationError.value;
});

const calculatePremium = computed(() => {
  const yearlyPremium = (coverAmount.value * props.project.rate) / 100;
  const durationInYears = Number(duration.value) / 365;
  return (yearlyPremium * durationInYears).toFixed(4);
});

const validateCoverAmount = (value) => {
  if (value < props.project.minCover) {
    coverAmountError.value = `Cover amount must be at least ${props.project.minCover} BTC`;
    return false;
  } else if (value > props.project.maxCover) {
    coverAmountError.value = `Cover amount cannot exceed ${props.project.maxCover} BTC`;
    return false;
  }
  coverAmountError.value = '';
  return true;
};

const validateDuration = (value) => {
  const numValue = Number(value);
  if (numValue < 30) {
    durationError.value = 'Duration must be at least 30 days';
    return false;
  } else if (numValue > 360) {
    durationError.value = 'Duration cannot exceed 360 days';
    return false;
  } else if (!Number.isInteger(numValue)) {
    durationError.value = 'Duration must be a whole number';
    return false;
  }
  durationError.value = '';
  return true;
};

const handlePurchase = async () => {
  // Clear previous errors
  coverAmountError.value = '';
  durationError.value = '';

  // Run validations
  const isValidAmount = validateCoverAmount(coverAmount.value);
  const isValidDuration = validateDuration(duration.value);

  // Only emit if all validations pass
  if (isValidAmount && isValidDuration) {
    emit('purchase', {
      coverAmount: coverAmount.value,
      duration: duration.value,
      premium: calculatePremium.value
    });
  }
};
</script>