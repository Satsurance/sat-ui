<!-- src/pages/ClaimsManagement.vue -->
<template>
  <div class="min-h-[85vh] pt-[7vh] bg-gray-50 py-8">
    <div class="max-w-6xl mx-auto px-4">
      <h1 class="text-3xl mb-2 font-medium">Claims Management</h1>
      <h2 class="mb-4">Manage and Review Claims with Ease</h2>

      <!-- Claims Table -->
      <div class="relative overflow-x-auto">
        <table
          class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
        >
          <thead
            class="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400"
          >
            <tr class="border-b">
              <th
                class="px-6 py-4 text-center text-xl font-normal text-gray-700"
              >
                ID
              </th>
              <th
                class="px-6 py-4 text-center text-xl font-normal text-gray-700"
              >
                Date
              </th>
              <th
                class="px-6 py-4 text-center text-xl font-normal text-gray-700"
              >
                Amount
              </th>
              <th
                class="px-6 py-4 text-center text-xl font-normal text-gray-700"
              >
                Description
              </th>
              <th class="px-6 py-4 text-left text-xl font-normal text-gray-700">
                Approve/Decline
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="claims.length === 0">
              <td colspan="5" class="px-6 py-8 text-center text-gray-500">
                List of claims
              </td>
            </tr>
            <tr v-for="claim in claims" :key="claim.id" class="border-b">
              <td class="px-6 py-4">{{ claim.id }}</td>
              <td class="px-6 py-4">{{ formatDate(claim.date) }}</td>
              <td class="px-6 py-4">${{ claim.amount.toLocaleString() }}</td>
              <td class="px-6 py-4">{{ claim.description }}</td>
              <td class="px-6 py-4">
                <div class="flex gap-2">
                  <button
                    @click="handleApprove(claim.id)"
                    class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    @click="handleDecline(claim.id)"
                    class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                  >
                    Decline
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

// Sample claims data
const claims = ref([
  {
    id: "CLM001",
    date: new Date("2024-03-18"),
    amount: 5000,
    description: "Smart contract failure compensation",
  },
  {
    id: "CLM002",
    date: new Date("2024-03-17"),
    amount: 3500,
    description: "Protocol exploit coverage",
  },
]);

const formatDate = (date) => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

const handleApprove = async (id) => {
  try {
    // TODO: Implement approval logic
    console.log("Approving claim:", id);
  } catch (error) {
    console.error("Error approving claim:", error);
  }
};

const handleDecline = async (id) => {
  try {
    // TODO: Implement decline logic
    console.log("Declining claim:", id);
  } catch (error) {
    console.error("Error declining claim:", error);
  }
};
</script>
