<!-- src/pages/Claims.vue -->
<template>
  <div>

    <!-- Main Content -->
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="container mx-auto px-4">
        <!-- Header -->
        <h1 class="text-3xl font-semibold text-center mb-8">Insurance claim</h1>

        <!-- Claims Content -->
        <div class="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-medium mb-6">Claim for insurance event form:</h2>

          <form @submit.prevent="handleSubmit" class="space-y-6">
            <!-- Incident Description -->
            <div>
              <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
                Incident description
              </label>
              <textarea
                  id="description"
                  v-model="formData.description"
                  rows="4"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Please describe the incident in detail..."
                  required
              ></textarea>
            </div>

            <!-- Transaction Link -->
            <div>
              <label for="transactionLink" class="block text-sm font-medium text-gray-700 mb-2">
                Transaction link
              </label>
              <input
                  type="text"
                  id="transactionLink"
                  v-model="formData.transactionLink"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter transaction hash or link"
                  required
              />
            </div>

            <!-- Submit Button -->
            <div class="flex justify-end">
              <button
                  type="submit"
                  class="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                  :disabled="isSubmitting"
              >
                {{ isSubmitting ? 'Submitting...' : 'Submit Claim' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';

const isSubmitting = ref(false);
const formData = reactive({
  description: '',
  transactionLink: '',
});

const handleSubmit = async () => {
  try {
    isSubmitting.value = true;
    // TODO: Implement your form submission logic here
    console.log('Form submitted:', formData);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Reset form after successful submission
    formData.description = '';
    formData.transactionLink = '';

    alert('Claim submitted successfully!');
  } catch (error) {
    console.error('Error submitting claim:', error);
    alert('Failed to submit claim. Please try again.');
  } finally {
    isSubmitting.value = false;
  }
};
</script>