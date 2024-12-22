<template>
  <div>
    <div class="min-h-[85vh] pt-[7vh] bg-gray-50 py-8">
      <div class="max-w-4xl mx-auto px-4">
        <!-- Header -->
        <h1 class="text-3xl mb-2 font-medium">Insurance Claim</h1>
        <h2 class="mb-8">Submit your insurance claim for coverage assessment.</h2>

        <div class="bg-white rounded-lg text-start shadow-sm p-6 py-12 mb-[1vh]">
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
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-yellow-500 focus:border-yellow-500 focus:outline-none block w-full p-2.5"
                  placeholder="Enter BTC address to receive the claim"
                  required
              />
            </div>

            <div>
              <label
                  for="transactionLink"
                  class="block mb-2 text-sm font-medium text-gray-900"
              >
                Transaction link
              </label>
              <input
                  type="text"
                  id="transactionLink"
                  v-model="formData.transactionLink"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-yellow-500 focus:border-yellow-500 focus:outline-none block w-full p-2.5"
                  placeholder="Enter transaction hash or link"
                  required
              />
            </div>

            <div class="flex justify-end">
              <button
                  type="submit"
                  :disabled="isSubmitting"
                  :class="[
                  'w-full py-3 rounded-lg transition-colors duration-300',
                  isSubmitting
                    ? 'bg-yellow-300 cursor-not-allowed'
                    : 'bg-yellow-500 hover:bg-white hover:text-yellow-500 border border-yellow-500 text-white'
                ]"
              >
                {{ isSubmitting ? "Submitting..." : "Submit Claim" }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";

const isSubmitting = ref(false);
const formData = reactive({
  description: "",
  amount: "",
  receiver: "",
  transactionLink: "",
});

const handleSubmit = async () => {
  try {
    isSubmitting.value = true;
    console.log("Form submitted:", formData);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Reset form
    formData.description = "";
    formData.amount = "";
    formData.receiver = "";
    formData.transactionLink = "";

    alert("Claim submitted successfully!");
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