<template>
  <div>
    <div class="min-h-[85vh] pt-[7vh] bg-gray-50 py-8">
      <div class="max-w-4xl mx-auto px-4">
        <!-- Header -->
        <h1 class="text-3xl mb-2 font-medium">Insurance Claim</h1>
        <h2 class="mb-8">Submit your insurance claim for coverage assessment.</h2>

        <div class="bg-white rounded-lg text-start shadow-sm p-6 py-12 mb-[1vh]">
          <template v-if="!isSubmitSuccessful">
            <h2 class="text-2xl font-normal text-center mb-8">
              Insurance Claim Form
            </h2>

            <form @submit.prevent="handleSubmit" class="max-w-lg mx-auto space-y-6">
              <div>
                <label
                    for="description"
                    class="block mb-2 text-sm font-medium text-gray-900"
                >
                  Incident description
                </label>
                <textarea
                    id="description"
                    v-model="formData.description"
                    rows="4"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-yellow-500 focus:border-yellow-500 focus:outline-none block w-full p-2.5"
                    placeholder="Please describe the incident in detail..."
                    required
                ></textarea>
              </div>

              <div>
                <label
                    for="amount"
                    class="block mb-2 text-sm font-medium text-gray-900"
                >
                  Claim amount (BTC)
                </label>
                <input
                    type="number"
                    id="amount"
                    v-model="formData.amount"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-yellow-500 focus:border-yellow-500 focus:outline-none block w-full p-2.5"
                    placeholder="0.1"
                    required
                />
              </div>

              <div>
                <label
                    for="receiver"
                    class="block mb-2 text-sm font-medium text-gray-900"
                >
                  Receiver address
                </label>
                <input
                    type="text"
                    id="receiver"
                    v-model="formData.receiver"
                    @input="validateAddress"
                    :class="[
                      'bg-gray-50 border text-gray-900 text-sm rounded-lg focus:outline-none block w-full p-2.5',
                      addressError
                        ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                        : isValidAddress
                          ? 'border-green-500 focus:ring-green-500 focus:border-green-500'
                          : 'border-gray-300 focus:ring-yellow-500 focus:border-yellow-500'
                    ]"
                    placeholder="Enter address to receive the claim"
                    required
                />
                <p v-if="addressError" class="mt-1 text-sm text-red-600">
                  {{ addressError }}
                </p>
                <p v-else-if="isValidAddress" class="mt-1 text-sm text-green-600">
                  Valid Ethereum address
                </p>
              </div>
              <div class="flex justify-end">
                <button
                    type="submit"
                    :disabled="isSubmitting || (!!formData.receiver && (!isValidAddress || !!addressError))"
                    :class="[
                      'w-full py-3 rounded-lg transition-colors duration-300',
                      (isSubmitting || (!!formData.receiver && (!isValidAddress || !!addressError)))
                        ? 'bg-yellow-300 border-yellow-400 hover:border-yellow-500 cursor-not-allowed'
                        : 'bg-yellow-500 border border-yellow-500 hover:bg-white hover:text-yellow-500 hover:border-yellow-500 text-white'
                    ]"
                >
                  {{ isSubmitting ? "Submitting..." : "Submit Claim" }}
                </button>
              </div>
            </form>
          </template>

          <template v-else>
            <div class="text-center space-y-4">
              <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h2 class="text-2xl font-medium text-gray-900">Claim Submitted Successfully!</h2>
              <p class="text-gray-600 max-w-md mx-auto">
                Your insurance claim has been successfully submitted. Our team will review your claim and get back to you shortly.
              </p>
              <button
                  @click="resetForm"
                  class="mt-6 px-6 py-2 text-sm font-medium text-yellow-500 hover:text-white border border-yellow-500 hover:bg-yellow-500 rounded-lg transition-colors duration-300"
              >
                Submit Another Claim
              </button>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { ethers } from "ethers";
import { useWeb3Store } from "../stores/web3Store";
import { getContractAddress } from "../constants/contracts.js";
import claimerABI from "../assets/abis/claimer.json";

const web3Store = useWeb3Store();

const isSubmitting = ref(false);
const isSubmitSuccessful = ref(false);
const isValidAddress = ref(false);
const addressError = ref("");

const formData = reactive({
  description: "",
  amount: "",
  receiver: "",
});

const validateAddress = () => {
  try {
    if (!formData.receiver) {
      isValidAddress.value = false;
      addressError.value = "";
      return;
    }

    // Check if it's a valid Ethereum address format
    if (!formData.receiver.match(/^0x[0-9a-fA-F]{40}$/)) {
      isValidAddress.value = false;
      addressError.value = "Invalid Ethereum address format";
      return;
    }

    // Validate checksum
    const checksumAddress = ethers.utils.getAddress(formData.receiver);
    isValidAddress.value = true;
    addressError.value = "";

    // Update with checksum address
    formData.receiver = checksumAddress;
  } catch (error) {
    isValidAddress.value = false;
    addressError.value = "Invalid Ethereum address";
  }
};

const resetForm = () => {
  isSubmitSuccessful.value = false;
  isValidAddress.value = false;
  addressError.value = "";
  formData.description = "";
  formData.amount = "";
  formData.receiver = "";
};

const handleSubmit = async () => {
  try {
    if (!isValidAddress.value) {
      return;
    }

    isSubmitting.value = true;

    const signer = web3Store.provider.getSigner();
    const claimer = new ethers.Contract(
        getContractAddress("CLAIMER", web3Store.chainId),
        claimerABI,
        signer
    );

    await claimer.createClaim(
        formData.receiver,
        formData.description,
        ethers.utils.parseEther(formData.amount.toString())
    );

    isSubmitSuccessful.value = true;

  } catch (error) {
    console.error("Error submitting claim:", error);
    alert("Failed to submit claim. Please try again.");
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>