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
            <div class="flex justify-between items-center py-3 px-4 rounded">
              <span class="text-gray-600">Available SURS token:</span>
              <span class="font-medium">{{ availableTokens }}</span>
            </div>
            <div class="flex justify-between items-center py-3 px-4 rounded">
              <span class="text-gray-600">Voting Power:</span>
              <span class="font-medium text-yellow-500">{{ votingPower }}</span>
            </div>
          </div>

          <!-- Staking Actions -->
          <div class="space-y-4">
            <div class="flex flex-col">
              <label for="stake-amount" class="block mb-2 text-sm text-left font-medium text-gray-900">
                SURS Amount to Stake
              </label>
              <div class="flex items-center space-x-4">
                <input
                    id="stake-amount"
                    type="number"
                    placeholder="0.99"
                    class="flex-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-yellow-500 focus:border-yellow-500 focus:outline-none block p-2.5"
                />
                <button class="w-28 px-6 py-2.5 bg-yellow-500 border border-yellow-500 hover:bg-white hover:text-yellow-500 hover:border-yellow-500 text-white rounded-lg transition-colors duration-300 focus:outline-none">
                  Stake
                </button>
              </div>
            </div>
            <div class="flex flex-col">
              <label for="unstake-amount" class="block mb-2 text-sm text-left font-medium text-gray-900">
                SURS Amount to Unstake
              </label>
              <div class="flex items-center space-x-4">
                <input
                    id="unstake-amount"
                    type="number"
                    placeholder="0.99"
                    class="flex-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-yellow-500 focus:border-yellow-500 focus:outline-none block p-2.5"
                />
                <button class="w-28 px-6 py-2.5 bg-slate-600 border border-slate-600 hover:bg-white hover:text-slate-600 hover:border-slate-600 text-white rounded-lg transition-colors duration-300 focus:outline-none">
                  Unstake
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Claims Table -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table class="w-full text-sm text-gray-600 divide-y divide-gray-200">
          <thead>
          <tr class="bg-white border-b border-gray-200">
            <th class="px-6 py-5 text-left text-xs font-semibold uppercase tracking-wider text-gray-900">ID</th>
            <th class="px-6 py-5 text-left text-xs font-semibold uppercase tracking-wider text-gray-900">Date</th>
            <th class="px-6 py-5 text-right text-xs font-semibold uppercase tracking-wider text-gray-900">Amount</th>
            <th class="px-6 py-5 text-center text-xs font-semibold uppercase tracking-wider text-gray-900">Description</th>
            <th class="px-6 py-5 text-center text-xs font-semibold uppercase tracking-wider text-gray-900">Receiver</th>
            <th class="px-6 py-5 text-center text-xs font-semibold uppercase tracking-wider text-gray-900">Votes</th>
          </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
          <tr v-if="claims.length === 0">
            <td colspan="6" class="px-6 py-10 text-center text-gray-500">
              No active claims
            </td>
          </tr>
          <tr
              v-for="claim in claims"
              :key="claim.id"
              class="hover:bg-gray-50/50 transition-colors group border-gray-200"
              @click="openClaimDetails(claim)"
          >
            <td class="px-6 py-5">
          <span class="inline-flex items-center justify-center min-w-[2.5rem] px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-800 rounded-full group-hover:bg-gray-200 transition-colors">
            {{ claim.id }}
          </span>
            </td>
            <td class="px-6 py-5 text-gray-600">{{ formatDate(claim.date) }}</td>
            <td class="px-6 py-5 text-right font-medium whitespace-nowrap">
              {{ formatAmount(claim.amount) }}
              <span class="ml-1 text-gray-500 font-normal">BTC</span>
            </td>
            <td class="px-6 py-5">
              <div class="max-w-md truncate" :title="claim.description">
                {{ claim.description }}
              </div>
            </td>
            <td class="px-6 py-5">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 font-mono group-hover:bg-gray-200 transition-colors">
            {{ formatAddress(claim.receiver) }}
          </span>
            </td>
            <td class="px-6 py-5">
              <div class="flex flex-col items-center gap-2">
                <div class="flex items-center gap-3 w-full max-w-[200px]">
                  <div class="h-2 flex-1 bg-gray-100 rounded-full overflow-hidden">
                    <div
                        class="h-full transition-all duration-300"
                        :class="{
                    'bg-yellow-500': claim.forPercentage > 50,
                    'bg-gray-400': claim.forPercentage <= 50
                  }"
                        :style="{ width: `${claim.forPercentage}%` }"
                    ></div>
                  </div>
                  <span class="text-sm whitespace-nowrap text-gray-600 font-medium min-w-[4.5rem] text-center">
                {{ claim.forVotes }} : {{ claim.againstVotes }}
              </span>
                </div>
                <span class="text-xs" :class="{
              'text-yellow-600': claim.forPercentage > 50,
              'text-gray-500': claim.forPercentage <= 50
            }">
              {{ claim.forPercentage }}% Support
            </span>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Claim Details Dialog -->
    <ClaimDetailsDialog
        :claim="selectedClaim"
        :is-open="isDialogOpen"
        :sufficient-stake="sufficientStake"
        @close="closeClaimDetails"
        @vote="handleVote"
    />
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
import { ref, computed, watch } from 'vue';
import { ethers } from "ethers";
import { getContractAddress } from "../constants/contracts.js";
import { useWeb3Store } from "../stores/web3Store";
import claimerABI from "../assets/abis/claimer.json";
import ClaimDetailsDialog from '../components/ClaimDetailsDialog.vue';

// Store and contract setup
const web3Store = useWeb3Store();

// Staking state
const stakedAmount = ref('1000');
const availableTokens = ref('5000');
const votingPower = computed(() => `${stakedAmount.value} VP`);
const sufficientStake = computed(() => Number(stakedAmount.value) >= 100);

// Claims state
const claims = ref([]);
const selectedClaim = ref(null);
const isDialogOpen = ref(false);

// Load claims from blockchain
const loadClaimsState = async () => {
  try {
    console.log("Loading claims state...");
    const claimer = new ethers.Contract(
        getContractAddress("CLAIMER", web3Store.chainId),
        claimerABI,
        web3Store.provider
    );

    const latestClaim = (await claimer.claimCounter()).toNumber();
    claims.value = [];

    for (let i = latestClaim - 1; i > 0; i--) {
      const claim = await claimer.claims(i);
      const newClaim = {
        id: i,
        date: new Date(claim.startTime * 1000),
        amount: Number(ethers.utils.formatEther(claim.amount)).toFixed(2),
        description: claim.description,
        receiver: claim.receiver,
        proposer: claim.proposer,
        forVotes: Number(claim.forVotes),
        againstVotes: Number(claim.againstVotes),
        startTime: Number(claim.startTime),
        executed: claim.executed,
        exists: claim.exists,
        forPercentage: calculateVotePercentage(Number(claim.forVotes), Number(claim.againstVotes)),
        votesNeeded: calculateVotesNeeded(Number(claim.forVotes), Number(claim.againstVotes))
      };
      claims.value.push(newClaim);
    }
  } catch (error) {
    console.error("Error loading claims:", error);
  }
};

// Utility functions
const calculateVotePercentage = (forVotes, againstVotes) => {
  const total = forVotes + againstVotes;
  if (total === 0) return 0;
  return Math.round((forVotes / total) * 100);
};

const calculateVotesNeeded = (forVotes, againstVotes) => {
  // This is a placeholder - adjust the calculation based on your governance rules
  const requiredMajority = 0.66; // 66% majority required
  const total = forVotes + againstVotes;
  const neededVotes = Math.ceil((total * requiredMajority) - forVotes);
  return Math.max(0, neededVotes);
};

const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
};

const formatAddress = (address) => {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// Dialog management
const openClaimDetails = (claim) => {
  selectedClaim.value = claim;
  isDialogOpen.value = true;
};

const closeClaimDetails = () => {
  isDialogOpen.value = false;
  selectedClaim.value = null;
};

// Voting functions
const voteClaim = async (claimId, support) => {
  try {
    const claimer = new ethers.Contract(
        getContractAddress("CLAIMER", web3Store.chainId),
        claimerABI,
        web3Store.signer
    );

    const tx = await claimer.vote(claimId, support);
    await tx.wait();

    // Reload the claims state after voting
    await loadClaimsState();
  } catch (error) {
    console.error("Error voting on claim:", error);
  }
};

const handleVote = ({ claimId, support }) => {
  voteClaim(claimId, support);
  closeClaimDetails();
};

const formatAmount = (amount) => {
  // Format number to have exactly 2 decimal places
  return Number(amount).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

// Watch for wallet connection changes
watch(
    () => [web3Store.isConnected, web3Store.account],
    async (values) => {
      if (values[0]) {
        await loadClaimsState();
      }
    }
);

// Initial load if wallet is connected
if (web3Store.isConnected) loadClaimsState();

</script>