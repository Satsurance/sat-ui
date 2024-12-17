<!-- src/pages/ApplyInsurance.vue -->
<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4">
      <!-- Header -->
      <h1 class="text-4xl font-normal text-center mb-16 text-gray-800">Smart-contract Insurance</h1>

      <div class="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-16">
        <!-- Application Form -->
        <div class="space-y-8">
          <form @submit.prevent="handleSubmit" class="space-y-8">
            <!-- Name Input -->
            <div class="flex items-center gap-4">
              <label for="name" class="text-xl text-gray-700 w-32 text-right">
                Name:
              </label>
              <input
                  type="text"
                  id="name"
                  v-model="formData.name"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  required
              />
            </div>

            <!-- Company Input -->
            <div class="flex items-center gap-4">
              <label for="company" class="text-xl text-gray-700 w-32 text-right">
                Company:
              </label>
              <input
                  type="text"
                  id="company"
                  v-model="formData.company"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  required
              />
            </div>

            <!-- Phone Input -->
            <div class="flex items-center gap-4">
              <label for="phone" class="text-xl text-gray-700 w-32 text-right">
                Phone:
              </label>
              <input
                  type="tel"
                  id="phone"
                  v-model="formData.phone"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  required
              />
            </div>

            <!-- Email Input -->
            <div class="flex items-center gap-4">
              <label for="email" class="text-xl text-gray-700 w-32 text-right">
                Email:
              </label>
              <input
                  type="email"
                  id="email"
                  v-model="formData.email"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  required
              />
            </div>

            <!-- Submit Button - Now properly aligned with inputs -->
            <div class="flex items-center">
              <div class="flex-2 w-40"><!-- Spacer to align with inputs --></div>
              <button
                  type="submit"
                  class="flex-1 bg-[#4747ff] text-white py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors text-lg font-normal"
                  :disabled="isSubmitting"
              >
                APPLY
              </button>
            </div>
          </form>
        </div>

        <!-- Information Links -->
        <div class="space-y-8 pt-2">
          <a href="#" class="flex items-center gap-3 text-xl text-gray-700 hover:text-blue-600 transition-colors">
            <FileText class="h-6 w-6" />
            <span>See the policy</span>
          </a>

          <a href="#" class="flex items-center gap-3 text-xl text-gray-700 hover:text-blue-600 transition-colors">
            <Shield class="h-6 w-6" />
            <span>Insurance partner</span>
          </a>

          <a href="#" class="flex items-center gap-3 text-xl text-gray-700 hover:text-blue-600 transition-colors">
            <ClipboardList class="h-6 w-6" />
            <span>Required application</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { FileText, Shield, ClipboardList } from 'lucide-vue-next';

const isSubmitting = ref(false);
const formData = reactive({
  name: '',
  company: '',
  phone: '',
  email: '',
});

const handleSubmit = async () => {
  try {
    isSubmitting.value = true;
    // TODO: Implement your form submission logic here
    console.log('Form submitted:', formData);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Reset form after successful submission
    formData.name = '';
    formData.company = '';
    formData.phone = '';
    formData.email = '';

    alert('Application submitted successfully!');
  } catch (error) {
    console.error('Error submitting application:', error);
    alert('Failed to submit application. Please try again.');
  } finally {
    isSubmitting.value = false;
  }
};
</script>