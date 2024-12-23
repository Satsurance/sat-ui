<!-- src/pages/ClaimsManagement.vue -->
<template>
  <div class="min-h-[85vh] pt-[7vh] bg-gray-50 py-8">
    <div class="max-w-6xl mx-auto px-4">
      <h1 class="text-3xl mb-2 font-medium">Claims Management</h1>
      <h2 class="mb-4">Governance and Claims Review Platform</h2>

      <!-- Staking Management Card -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Staking Information -->
          <div class="space-y-4">
            <div class="flex justify-between items-center py-3 px-4 rounded w-full">
              <span class="text-gray-600">Amount of SURS token staked:</span>
              <span class="font-medium">{{ stakedAmount }}</span>
            </div>
            <div class="flex justify-between items-center py-3 px-4  rounded">
              <span class="text-gray-600">Available SURS token:</span>
              <span class="font-medium">{{ availableTokens }}</span>
            </div>
            <div class="flex justify-between items-center py-3 px-4  rounded">
              <span class="text-gray-600">Voting Power:</span>
              <span class="font-medium text-yellow-500">{{ stakedAmount }} VP</span>
            </div>
          </div>

          <!-- Staking Actions -->
          <div class="space-y-4">
            <div class="flex flex-col">
              <label for="stake-amount" class="block mb-2 text-sm text-left font-medium text-gray-900">SURS Amount to Stake</label>
              <div class="flex items-center space-x-4">
                <input
                    id="stake-amount"
                    type="number"
                    placeholder="0.99"
                    class="flex-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-yellow-500 focus:border-yellow-500 focus:outline-none block p-2.5"
                />
                <button class="w-28 px-6 py-2.5 bg-yellow-500 border border-yellow-500 hover:bg-white hover:text-yellow-500 hover:border-yellow-500 text-white px-4 rounded-lg transition-colors transition duration-300 w-full focus:outline-none">
                  Stake
                </button>
              </div>
            </div>
            <div class="flex flex-col">
              <label for="unstake-amount" class="block mb-2 text-sm text-left font-medium text-gray-900">SURS Amount to Unstake</label>
              <div class="flex items-center space-x-4">
                <input
                    id="unstake-amount"
                    type="number"
                    placeholder="0.99"
                    class="flex-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-yellow-500 focus:border-yellow-500 focus:outline-none block p-2.5"
                />
                <button class="w-28 px-6 py-2.5 bg-slate-600 border border-slate-600 hover:bg-white hover:text-slate-600 hover:border-slate-600 text-white px-4 rounded-lg transition-colors transition duration-300 w-full focus:outline-none">
                  Unstake
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Claims Table -->
      <div class="bg-white rounded-lg shadow-sm overflow-x-auto">
        <table class="w-full text-sm text-left text-gray-500">
          <thead class="text-xs text-gray-700 uppercase bg-gray-100 border-b border-gray-200">
          <tr>
            <th class="px-6 py-4 text-center font-semibold">ID</th>
            <th class="px-6 py-4 text-center font-semibold">Date</th>
            <th class="px-6 py-4 text-center font-semibold">Amount</th>
            <th class="px-6 py-4 text-center font-semibold">Description</th>
            <th class="px-6 py-4 text-center font-semibold">Address</th>
            <th class="px-6 py-4 text-center font-semibold">Voting Status</th>
            <th class="px-6 py-4 text-center font-semibold">Vote</th>
          </tr>
          </thead>
          <tbody>
          <tr v-if="claims.length === 0">
            <td colspan="7" class="px-6 py-8 text-center text-gray-500">
              No active claims
            </td>
          </tr>
          <tr v-for="claim in claims" :key="claim.id" class="border-b hover:bg-gray-50">
            <td class="px-6 py-4 text-center">{{ claim.id }}</td>
            <td class="px-6 py-4 text-center">{{ formatDate(claim.date) }}</td>
            <td class="px-6 py-4 text-center">${{ claim.amount.toLocaleString() }}</td>
            <td class="px-6 py-4">{{ claim.description }}</td>
            <td class="px-6 py-4 text-center font-mono">{{ claim.address }}</td>
            <td class="px-6 py-4">
              <div class="flex flex-col items-center gap-1">
                <div class="flex items-center gap-2">
                  <div class="h-2 w-24 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        class="h-full bg-yellow-500"
                        :style="{ width: `${claim.forPercentage}%` }"
                    ></div>
                  </div>
                  <span class="text-sm">{{ claim.forPercentage }}%</span>
                </div>
                <span class="text-xs text-gray-500">
                    {{ claim.votesNeeded }} more votes needed
                  </span>
              </div>
            </td>
            <td class="px-6 py-4">
              <div class="flex justify-center gap-2">
                <button
                    class="px-4 py-2 bg-yellow-500 border border-yellow-500 hover:bg-white hover:text-yellow-500 hover:border-yellow-500 text-white rounded-lg transition-colors transition duration-300 focus:outline-none"
                    :disabled="!sufficientStake"
                >
                  For
                </button>
                <button
                    class="px-4 py-2 bg-rose-400 border border-rose-400 hover:bg-white hover:text-rose-400 hover:border-rose-400 text-white rounded-lg transition-colors transition duration-300 focus:outline-none"
                    :disabled="!sufficientStake"
                >
                  Against
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

<style scoped>
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>

<script setup>
import { ref, computed } from 'vue';

// Sample data - replace with actual data from your application
const stakedAmount = ref('1000');
const availableTokens = ref('5000');
const votingPower = computed(() => `${stakedAmount.value} VP`);
const sufficientStake = computed(() => Number(stakedAmount.value) >= 100);

const claims = ref([
  {
    id: 'CLM001',
    date: new Date('2024-03-18'),
    amount: 5000,
    description: 'Smart contract failure compensation',
    address: '0x1234...5678',
    forPercentage: 65,
    votesNeeded: 1000
  },
  {
    id: 'CLM002',
    date: new Date('2024-03-17'),
    amount: 3500,
    description: 'Protocol exploit coverage',
    address: '0xabcd...efgh',
    forPercentage: 45,
    votesNeeded: 2000
  }
]);

const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
};
</script>