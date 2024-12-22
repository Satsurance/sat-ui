<template>
  <div class="min-h-[85vh]  bg-gray-50 py-8">
    <h1 class="text-3xl mb-2 font-medium">Got some questions?</h1>
    <h2 class="mb-4">
      Have questions or need assistance? We're here to help you explore the
      future of decentralized insurance.
    </h2>
    <div
      class="container mx-auto px-4 w-full flex md:flex-row flex-col justify-between"
    >
      <div
        class="md:w-1/2 lg:w-2/3 text-start bg-white rounded-lg shadow-sm p-8"
      >
        <div v-if="!isSubmitted" class="w-full">
          <div class="w-full space-y-8">
            <form @submit.prevent="handleSubmit" class="max-w-sm mx-auto">
              <div class="mb-5">
                <label
                  for="name"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >Name</label
                >
                <input
                  type="name"
                  id="name"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-yellow-500 focus:border-yellow-500 focus:outline-none block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-yellow-500 dark:focus:border-yellow-500"
                  placeholder="Satoshi Nakamoto"
                  :disabled="isSubmitting"
                  required
                />
              </div>

              <div class="mb-5">
                <label
                  for="company"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >Company</label
                >
                <input
                  type="company"
                  id="company"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-yellow-500 focus:border-yellow-500 focus:outline-none block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-yellow-500 dark:focus:border-yellow-500"
                  placeholder="Bitcoin"
                  :disabled="isSubmitting"
                  required
                />
              </div>

              <div class="mb-5">
                <label
                  for="phone"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >Phone</label
                >
                <input
                  type="phone"
                  id="phone"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-yellow-500 focus:border-yellow-500 focus:outline-none block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-yellow-500 dark:focus:border-yellow-500"
                  placeholder="+1 (123) 456-7890"
                  :disabled="isSubmitting"
                  required
                />
              </div>

              <div class="mb-5">
                <label
                  for="email"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >Email</label
                >
                <input
                  type="email"
                  id="email"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-yellow-500 focus:border-yellow-500 focus:outline-none block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-yellow-500 dark:focus:border-yellow-500"
                  placeholder="satoshi@bitcoin.com"
                  :disabled="isSubmitting"
                  required
                />
              </div>

              <div class="flex justify-center">
                <button
                  type="submit"
                  v-if="!isSubmitting"
                  class="flex flex-row align-center bg-yellow-500 border border-yellow-500 hover:bg-white hover:text-yellow-500 hover:border-yellow-500 text-white px-4 py-2 rounded-lg transition-colors transition duration-300"
                  :disabled="isSubmitting"
                >
                  Send
                </button>
                <button
                  v-if="isSubmitting"
                  type="submit"
                  class="flex flex-row align-center bg-yellow-500 border border-yellow-500 hover:bg-white hover:text-yellow-500 hover:border-yellow-500 text-white px-4 py-2 rounded-lg transition-colors transition duration-300"
                  :disabled="isSubmitting"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="size-6 animate-spin"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                    />
                  </svg>
                  Sending...
                </button>
              </div>
            </form>
          </div>
        </div>
        <div
          v-if="isSubmitted"
          class="flex flex-col items-center justify-between w-full text-center h-full"
        >
          <h1 class="text-3xl mb-2 font-medium">
            We'ev received your request!
          </h1>
          <h2 class="mb-2">Our team will contact you within 2 business days</h2>
          <img class="w-full lg:w-2/3" src="../assets/Success.gif" />
        </div>
      </div>
      <div
        class="flex flex-col justify-between md:w-1/2 lg:w-1/3 space-y-8 pt-2 items-center"
      >
        <p class="font-bold mt-2">These links may be helpfull for you 🤓</p>
        <a
          href="#"
          class="flex items-center text-yellow-500 hover:text-yellow-500 hover:underline"
        >
          <FileText class="h-6 w-6 mr-2" />
          <span>See the policy</span>
        </a>

        <a
          href="#"
          class="flex items-center text-yellow-500 hover:text-yellow-500 hover:underline"
        >
          <Shield class="h-6 w-6 mr-2" />
          <span>Insurance partner</span>
        </a>

        <a
          href="#"
          class="flex items-center text-yellow-500 hover:text-yellow-500 hover:underline"
        >
          <FileText class="h-6 w-6 mr-2" />
          <span>Required application</span>
        </a>
        <div>
          <img class="h-60" src="../assets/Insurance.gif" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { FileText, Shield } from "lucide-vue-next";

const isSubmitting = ref(false);
const isSubmitted = ref(false);

const formData = reactive({
  name: "",
  company: "",
  phone: "",
  email: "",
});

const handleSubmit = async () => {
  try {
    isSubmitting.value = true;
    // TODO: Implement your form submission logic here
    console.log("Form submitted:", formData);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Reset form after successful submission
    formData.name = "";
    formData.company = "";
    formData.phone = "";
    formData.email = "";

    isSubmitted.value = true;
  } catch (error) {
    console.error("Error submitting application:", error);
  } finally {
    isSubmitting.value = false;
  }
};
</script>
