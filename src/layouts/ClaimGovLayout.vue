<!-- src/pages/ClaimsManagement.vue -->
<template>
  <div class="min-h-[85vh] bg-gray-50">
    <div class="max-w-6xl mx-auto px-4 py-8">
      <div class="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <div class="flex flex-col items-center text-center space-y-1">
            <h1
              class="text-2xl md:text-4xl font-semibold text-gray-900 flex items-center gap-3"
            >
              <svg
                class="w-8 h-8 text-yellow-500 hidden md:flex"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Claims Management
            </h1>
            <p class="text-gray-500">
              Governance and Claims Review Platform
            </p>
          </div>

          <div class="flex items-center space-x-4 mt-4 md:mt-0 w-full md:w-max">
            <button
              class="flex items-center text-center justify-center w-full btn-primary px-6 py-2.5 rounded-lg"
              @click="openSubmitClaimDialog"
            >
              <svg
                class="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Submit New Claim
            </button>
          </div>
        </div>
      </div>

      <!-- Claims Table -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300">
        <div class="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
          <h2 class="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <svg
              class="w-5 h-5 text-yellow-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            Claims
          </h2>
          <div class="text-sm text-gray-500 font-medium">
            {{ claims.length }} total claim{{ claims.length !== 1 ? 's' : '' }}
          </div>
        </div>

        <!-- Enhanced Claim Table -->
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-gray-600">
            <thead>
              <tr class="bg-gray-50 border-b border-gray-200">
                <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-800">
                  ID
                </th>
                <th class="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-800">
                  Date
                </th>
                <th class="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-800">
                  Amount
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-800">
                  Description
                </th>
                <th class="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-800">
                  Receiver
                </th>
                <th class="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-800">
                  Status
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-if="claims.length === 0">
                <td
                  colspan="6"
                  class="px-6 py-12 text-center text-gray-500"
                >
                  <div class="flex flex-col items-center justify-center">
                    <svg
                      class="w-16 h-16 text-gray-300 mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <p class="mb-4">
                      No claims found
                    </p>
                    <button
                      class="px-5 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-lg shadow-sm transition-colors"
                      @click="openSubmitClaimDialog"
                    >
                      Submit Your First Claim
                    </button>
                  </div>
                </td>
              </tr>
              <tr
                v-for="claim in claims"
                :key="claim.id"
                class="hover:bg-gray-50 cursor-pointer transition-colors"
                @click="openClaimDetails(claim)"
              >
                <td class="px-6 py-5">
                  <span class="inline-flex items-center justify-center px-3 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                    {{ claim.id }}
                  </span>
                </td>
                <td class="px-6 py-5 text-gray-700">
                  {{ formatDate(claim.date) }}
                </td>
                <td class="px-6 py-5 text-right font-medium whitespace-nowrap">
                  {{ formatAmount(claim.amount) }}
                  <span class="ml-1 text-gray-500 font-normal">BTC</span>
                </td>
                <td class="px-6 py-5">
                  <div
                    class="max-w-md truncate"
                    :title="claim.description"
                  >
                    {{ claim.description }}
                  </div>
                </td>
                <td class="px-6 py-5 text-center">
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 font-mono">
                    {{ formatAddress(claim.receiver) }}
                  </span>
                </td>
                <td class="px-6 py-5">
                  <div class="flex flex-col items-center gap-2">
                    <span
                      class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                      :class="{
                        'bg-red-100 text-red-800': claim.spam,
                        'bg-green-100 text-green-800': claim.executed,
                        'bg-blue-100 text-blue-800': claim.approved && !claim.executed && isReadyForExecution(claim),
                        'bg-yellow-100 text-yellow-800': claim.approved && !claim.executed && !isReadyForExecution(claim),
                        'bg-gray-100 text-gray-800': !claim.approved && !claim.spam && !claim.executed,
                      }"
                    >
                      {{ claim.spam ? 'Spam' : 
                        claim.executed ? 'Executed' : 
                        claim.approved && isReadyForExecution(claim) ? 'Ready' :
                        claim.approved ? 'Approved' : 'Pending' }}
                    </span>
                  
                    <!-- Timing information -->
                    <span
                      v-if="claim.approved && !claim.executed"
                      class="text-xs text-gray-500 text-center"
                    >
                      {{ getExecutionTimeRemaining(claim) }}
                    </span>
                    <span
                      v-else-if="!claim.approved && !claim.spam && !claim.executed"
                      class="text-xs text-gray-500 text-center"
                    >
                      {{ getApprovalTimeRemaining(claim) }}
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination Controls -->
        <div
          v-if="totalClaims && totalClaims > itemsPerPage"
          class="flex items-center justify-between border-t border-gray-200 px-6 py-4"
        >
          <div class="text-sm text-gray-700">
            Showing
            <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + (totalClaims > 0 ? 1 : 0) }}</span>
            to
            <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, totalClaims) }}</span>
            of
            <span class="font-medium">{{ totalClaims }}</span>
            claims
          </div>
          <div class="flex items-center space-x-2">
            <button
              :disabled="currentPage === 1 || isLoadingClaims"
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              @click="prevPage"
            >
              <svg
                class="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Previous
            </button>
            <span class="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-md">
              Page {{ currentPage }} of {{ totalPages }}
            </span>
            <button
              :disabled="currentPage >= totalPages || isLoadingClaims"
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              @click="nextPage"
            >
              Next
              <svg
                class="w-4 h-4 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Submit Claim Dialog -->
    <Transition name="fade">
      <div
        v-if="isSubmitDialogOpen"
        class="fixed inset-0 z-50 overflow-y-auto"
        @click="closeSubmitDialog"
      >
        <div
          class="fixed inset-0 bg-gray-500/70 backdrop-blur-sm transition-opacity"
        />
        <div class="flex min-h-full items-center justify-center p-4">
          <div
            class="relative w-full max-w-xl transform overflow-hidden rounded-3xl bg-white p-4 sm:p-6 md:p-8 shadow-xl transition-all"
            @click.stop
          >
            <!-- Dialog Header -->
            <div class="flex items-center justify-between mb-8">
              <h3 class="text-2xl font-semibold text-gray-900">
                Submit New Claim
              </h3>
              <button
                class="rounded-full p-2 hover:bg-gray-100 transition-colors"
                @click="closeSubmitDialog"
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

            <!-- Claim Form -->
            <form
              class="space-y-6"
              @submit.prevent="handleSubmitClaim"
            >
              <div>
                <label
                  for="description"
                  class="block mb-2 text-sm font-medium text-gray-900"
                >
                  Incident description
                </label>
                <textarea
                  id="description"
                  v-model="submitFormData.description"
                  rows="4"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-yellow-500 focus:border-yellow-500 focus:outline-none block w-full p-2.5"
                  placeholder="Please describe the incident in detail..."
                  required
                />
              </div>

              <div>
                <label
                  for="cover"
                  class="block mb-2 text-sm font-medium text-gray-900"
                >
                  Select Cover
                </label>
                <select
                  id="cover"
                  v-model="submitFormData.selectedCover"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-yellow-500 focus:border-yellow-500 focus:outline-none block w-full p-2.5"
                  required
                >
                  <option value="">
                    Select a cover
                  </option>
                  <option
                    v-for="cover in userCovers"
                    :key="`${cover.tokenId}`"
                    :value="cover"
                    :class="isCoverExpired(cover) ? 'text-gray-500' : 'text-gray-900'"
                  >
                    NFT #{{ cover.tokenId }} - {{ cover.protocol }} - {{ cover.coverAmount }} BTC
                    (Valid: {{ formatDate(cover.startDate) }} - {{ formatDate(cover.endDate) }})
                    {{ isCoverExpired(cover) ? '(EXPIRED)' : '' }}
                  </option>
                </select>
                <p
                  v-if="submitFormData.selectedCover && isCoverExpired(submitFormData.selectedCover)"
                  class="mt-1 text-yellow-600 text-sm"
                >
                  Warning: This cover has expired
                </p>
              </div>

              <div>
                <label
                  for="amount"
                  class="block mb-2 text-sm font-medium text-gray-900"
                >
                  Claim amount (BTC)
                </label>
                <input
                  id="amount"
                  v-model="submitFormData.amount"
                  type="number"
                  :max="submitFormData.selectedCover ? submitFormData.selectedCover.coverAmount : 0"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-yellow-500 focus:border-yellow-500 focus:outline-none block w-full p-2.5"
                  placeholder="0.1"
                  step="0.00000001"
                  min="0"
                  required
                >
                <p
                  v-if="submitFormData.selectedCover && submitFormData.amount > submitFormData.selectedCover.coverAmount"
                  class="mt-1 text-red-600 text-sm"
                >
                  Maximum available: {{ submitFormData.selectedCover.coverAmount }} BTC
                </p>
              </div>

              <div>
                <label
                  for="receiver"
                  class="block mb-2 text-sm font-medium text-gray-900"
                >
                  Receiver address
                </label>
                <input
                  id="receiver"
                  v-model="submitFormData.receiver"
                  type="text"
                  :class="[
                    'bg-gray-50 border text-gray-900 text-sm rounded-lg focus:outline-none block w-full p-2.5',
                    addressError
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                      : isValidAddress
                        ? 'border-green-500 focus:ring-green-500 focus:border-green-500'
                        : 'border-gray-300 focus:ring-yellow-500 focus:border-yellow-500',
                  ]"
                  placeholder="Enter address to receive the claim"
                  required
                  @input="validateAddress"
                >
                <p
                  v-if="addressError"
                  class="mt-1 text-sm text-red-600"
                >
                  {{ addressError }}
                </p>
                <p
                  v-else-if="isValidAddress"
                  class="mt-1 text-sm text-green-600"
                >
                  Valid Ethereum address
                </p>
              </div>

              <!-- Deposit Requirement Information -->
              <div
                v-if="depositRequirement.required"
                class="bg-yellow-50 border border-yellow-200 rounded-lg p-4"
              >
                <div class="flex items-start">
                  <div>
                    <h4 class="text-sm font-medium text-yellow-800">
                      Deposit Required
                    </h4>
                    <p class="mt-1 text-sm text-yellow-700">
                      A deposit of <span class="font-medium">{{ depositRequirement.formattedAmount }} ETH</span> is required to submit this claim.
                      You may need to approve the token transfer first.
                    </p>
                  </div>
                </div>
              </div>

              <div class="flex justify-end pt-4">
                <button
                  type="submit"
                  :disabled="
                    isSubmitting ||
                      (!!submitFormData.receiver &&
                        (!isValidAddress || !!addressError)) ||
                      !isValidAmount
                  "
                  :class="[
                    'w-full py-3 rounded-lg transition-colors duration-300',
                    isSubmitting ||
                      (!!submitFormData.receiver &&
                        (!isValidAddress || !!addressError)) ||
                      !isValidAmount
                      ? 'bg-yellow-300 border-yellow-400 hover:border-yellow-500 cursor-not-allowed'
                      : 'bg-yellow-500 border border-yellow-500 hover:bg-white hover:text-yellow-500 hover:border-yellow-500 text-white',
                  ]"
                >
                  {{ isSubmitting ? "Submitting..." : "Submit Claim" }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Claim Details Dialog -->
    <ClaimDetailsDialog
      :claim="selectedClaim"
      :is-open="isDialogOpen"
      :approval-period="approvalPeriod"
      :execution-timeout="executionTimeout"
      :claim-reduction="claimReduction"
      :error-message="currentClaimError"
      :is-controller="isController"
      :threshold="controlBoardThreshold"
      :controllers-count="controlBoardControllersCount"
      :claim-approvals="claimApprovals"
      @close="closeClaimDetails"
      @approve="handleApproveClaim"
      @mark-spam="handleMarkAsSpam"
      @execute="handleExecute"
      @execute-approval="handleExecuteApprovalTransaction"
      @execute-spam="handleExecuteSpamTransaction"
    />

    <!-- Transaction Status Modal -->
    <TransactionStatus
      :show="!!(firstTxStatus || secondTxStatus || transactionError)"
      :steps="transactionSteps"
      :tx-hash="currentTxHash"
      :error="transactionError"
      :block-explorer="web3Store.chainId ? SUPPORTED_NETWORKS[web3Store.chainId].blockExplorerUrls[0] : ''"
      @close="resetTransaction"
      @retry="retryTransaction"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, reactive, onMounted, onUnmounted } from "vue";
import { parseEther, formatEther, keccak256, toHex, encodeFunctionData } from "viem";
import {getContractAddress, SUPPORTED_NETWORKS} from "../constants/contracts.js";
import { COVER_PRODUCTS } from "../constants/projects.js";
import { useWeb3Store } from "../stores/web3Store";
import claimerABI from "../assets/abis/claimer.json";
import coverNftABI from '../assets/abis/coverNFT.json';
import poolFactoryABI from '../assets/abis/poolFactory.json';
import controlBoardABI from '../assets/abis/controlBoard.json';
import erc20ABI from '../assets/abis/erc20.json';
import ClaimDetailsDialog from "../components/ClaimDetailsDialog.vue";
import TransactionStatus from "../components/TransactionStatus.vue";

// Store and contract setup
const web3Store = useWeb3Store();

// Approval state
const approvalPeriod = ref(0);
const executionTimeout = ref(0);
const claimReduction = ref(0);

// Deposit state
const claimDeposit = ref(0n);
const depositToken = ref(null);

// Controller state
const isController = ref(false);
const controlBoardThreshold = ref(0);
const controlBoardControllersCount = ref(0);

// Transaction state
const firstTxStatus = ref("");
const secondTxStatus = ref("");
const transactionType = ref("");
const currentTxHash = ref("");
const transactionError = ref("");

// Claims state
const claims = ref([]);
const selectedClaim = ref(null);
const isDialogOpen = ref(false);
const currentPage = ref(1);
const itemsPerPage = ref(5);
const totalClaims = ref(0);
const isLoadingClaims = ref(false);
const currentClaimError = ref('');
const userCovers = ref([]);

// Approval tracking state
const claimApprovals = ref(new Map()); // Map<claimId, { approveCount: number, spamCount: number }>

// Add computed for total pages
const totalPages = computed(() =>
  Math.max(Math.ceil(totalClaims.value / itemsPerPage.value), 1)
);

// Submit claim form state
const isSubmitDialogOpen = ref(false);
const isSubmitting = ref(false);
const isValidAddress = ref(false);
const addressError = ref("");
const submitFormData = reactive({
  description: "",
  amount: "",
  receiver: "",
  selectedCover: ""
});

const transactionSteps = computed(() => {
  switch (transactionType.value) {
    case 'submit_claim':
      return [
        {
          id: 'submit',
          title: 'Submit Claim',
          description: 'Submit your new claim',
          status: firstTxStatus.value,
          showNumber: false
        }
      ];
    case 'submit_claim_with_approval':
      return [
        {
          id: 'approve',
          title: 'Approve Deposit Token',
          description: 'Allow contract to use your deposit tokens',
          status: firstTxStatus.value,
          showNumber: true
        },
        {
          id: 'submit',
          title: 'Submit Claim',
          description: 'Submit your new claim',
          status: secondTxStatus.value,
          showNumber: true
        }
      ];
    case 'approve':
      return [
        {
          id: 'approve',
          title: 'Approve Claim',
          description: 'Cast your approval vote',
          status: firstTxStatus.value,
          showNumber: false
        }
      ];
    case 'mark_spam':
      return [
        {
          id: 'mark_spam',
          title: 'Mark as Spam',
          description: 'Cast your spam vote',
          status: firstTxStatus.value,
          showNumber: false
        }
      ];
    case 'execute_approval':
      return [
        {
          id: 'execute_approval',
          title: 'Execute Approval',
          description: 'Execute the claim approval',
          status: firstTxStatus.value,
          showNumber: false
        }
      ];
    case 'execute_spam':
      return [
        {
          id: 'execute_spam',
          title: 'Execute Spam Marking',
          description: 'Execute the spam marking',
          status: firstTxStatus.value,
          showNumber: false
        }
      ];
    case 'execute':
      return [
        {
          id: 'execute',
          title: 'Execute Claim',
          description: 'Execute the approved claim',
          status: firstTxStatus.value,
          showNumber: false
        }
      ];
    default:
      return [];
  }
});

// Dialog management
const openSubmitClaimDialog = () => {
  isSubmitDialogOpen.value = true;
  loadUserCovers();
};

const closeSubmitDialog = () => {
  isSubmitDialogOpen.value = false;
  resetSubmitForm();
};

const resetSubmitForm = () => {
  submitFormData.description = "";
  submitFormData.amount = "";
  submitFormData.receiver = "";
  submitFormData.selectedCover = "";
  isValidAddress.value = false;
  addressError.value = "";
};

const validateAddress = () => {
  try {
    if (!submitFormData.receiver) {
      isValidAddress.value = false;
      addressError.value = "";
      return;
    }

    const address = submitFormData.receiver.trim();

    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      isValidAddress.value = false;
      addressError.value = "Invalid Ethereum address";
      return;
    }

    isValidAddress.value = true;
    addressError.value = "";

    submitFormData.receiver = address;
  } catch (error) {
    isValidAddress.value = false;
    addressError.value = "Invalid Ethereum address";
  }
};

const isCoverExpired = (cover) => {
  return cover.endDate < Date.now();
};


const isValidAmount = computed(() => {
  if (!submitFormData.amount || !submitFormData.selectedCover) return false;
  return parseFloat(submitFormData.amount) <= parseFloat(submitFormData.selectedCover.coverAmount);
});

const depositRequirement = computed(() => {
  if (!claimDeposit.value || claimDeposit.value === 0n) {
    return {
      required: false,
      amount: "0",
      formattedAmount: "0"
    };
  }

  return {
    required: true,
    amount: claimDeposit.value,
    formattedAmount: formatEther(claimDeposit.value)
  };
});

const checkDepositAllowance = async () => {
  if (!claimDeposit.value || claimDeposit.value === 0n) {
    return { needsApproval: false, currentAllowance: 0n };
  }

  try {
    const publicClient = web3Store.ethClient;

    const claimerAddress = getContractAddress("CLAIMER", web3Store.chainId);
    const currentAllowance = await publicClient.readContract({
      address: depositToken.value,
      abi: erc20ABI,
      functionName: 'allowance',
      args: [web3Store.account, claimerAddress]
    });

    return {
      needsApproval: currentAllowance < claimDeposit.value,
      currentAllowance
    };
  } catch (error) {
    console.error("Error checking deposit allowance:", error);
    return { needsApproval: true, currentAllowance: 0n };
  }
};

const approveDepositToken = async () => {
  try {
    const walletClient = web3Store.signer;

    const claimerAddress = getContractAddress("CLAIMER", web3Store.chainId);
    
    const hash = await walletClient.writeContract({
      address: depositToken.value,
      abi: erc20ABI,
      functionName: 'approve',
      args: [claimerAddress, claimDeposit.value],
      account: web3Store.account
    });
    return hash;
  } catch (error) {
    console.error("Error approving deposit token:", error);
    throw error;
  }
};

const loadUserCovers = async () => {
  try {
    const publicClient = web3Store.ethClient;

    const coverContractAddress = getContractAddress('COVER_NFT', web3Store.chainId);

    const balance = await publicClient.readContract({
      address: coverContractAddress,
      abi: coverNftABI,
      functionName: 'balanceOf',
      args: [web3Store.account]
    });
    
    let coversPromise = [];
    for(let i = 0; i < Number(balance); i++) {
      const tokenIdPromise = publicClient.readContract({
        address: coverContractAddress,
        abi: coverNftABI,
        functionName: 'tokenOfOwnerByIndex',
        args: [web3Store.account, i]
      });
      coversPromise.push(tokenIdPromise);
    }
    const tokenIds = await Promise.all(coversPromise);

    let coverDetailsPromise = [];
    for(let tokenId of tokenIds) {
      coverDetailsPromise.push(publicClient.readContract({
        address: coverContractAddress,
        abi: coverNftABI,
        functionName: 'covers',
        args: [tokenId]
      }));
    }
    const covers = await Promise.all(coverDetailsPromise);

    userCovers.value = covers.map((cover, index) => {
      const poolId = Number(cover[4]);
      const productId = Number(cover[1]);
      const protocolName = COVER_PRODUCTS[poolId]?.[productId]?.name || `Protocol ${productId}`;

      return {
        tokenId: Number(tokenIds[index]),
        protocol: protocolName,
        startDate: parseInt(cover[2]) * 1000,
        endDate: parseInt(cover[3]) * 1000,
        coverAmount: formatEther(cover[0]),
        productId: productId,
        poolId: poolId
      };
    });
  } catch (e) {
    console.error('Error loading covers:', e);
  }
};

const handleSubmitClaim = async () => {
  try {
    if (!isValidAddress.value) {
      return;
    }

    isSubmitting.value = true;
    
    const { needsApproval } = await checkDepositAllowance();
    
    if (needsApproval) {
      transactionType.value = "submit_claim_with_approval";
      firstTxStatus.value = "pending";
      
      const hash = await approveDepositToken();
      currentTxHash.value = hash;
      
      await web3Store.ethClient.waitForTransactionReceipt({ hash });
      firstTxStatus.value = "success";
      
      secondTxStatus.value = "pending";
    } else {
      transactionType.value = "submit_claim";
      firstTxStatus.value = "pending";
    }

    const claimData = {
      version: 1,
      cover: {
        tokenId: submitFormData.selectedCover.tokenId,
        protocol: submitFormData.selectedCover.protocol,
        productId: submitFormData.selectedCover.productId,
        poolId: submitFormData.selectedCover.poolId,
        startDate: submitFormData.selectedCover.startDate,
        endDate: submitFormData.selectedCover.endDate,
        amount: submitFormData.selectedCover.coverAmount
      },
      description: submitFormData.description
    };

    const walletClient = web3Store.signer;
    
    const poolFactoryAddress = getContractAddress("POOL_FACTORY", web3Store.chainId);
    const poolAddress = await web3Store.ethClient.readContract({
      address: poolFactoryAddress,
      abi: poolFactoryABI,
      functionName: 'pools',
      args: [submitFormData.selectedCover.poolId]
    });
    
    const claimerAddress = getContractAddress("CLAIMER", web3Store.chainId);

    const hash = await walletClient.writeContract({
      address: claimerAddress,
      abi: claimerABI,
      functionName: 'createClaim',
      args: [
        submitFormData.receiver,
        poolAddress,
        JSON.stringify(claimData),
        parseEther(submitFormData.amount.toString())
      ],
      account: web3Store.account
    });
    
    if (needsApproval) {
      currentTxHash.value = hash;
      await web3Store.ethClient.waitForTransactionReceipt({ hash });
      secondTxStatus.value = "success";
    } else {
      currentTxHash.value = hash;
      await web3Store.ethClient.waitForTransactionReceipt({ hash });
      firstTxStatus.value = "success";
    }

    await loadClaimsState();
    closeSubmitDialog();

    setTimeout(resetTransaction, 3000);
  } catch (error) {
    console.error("Error submitting claim:", error);
    
    const isApprovalStep = transactionType.value === "submit_claim_with_approval" && secondTxStatus.value !== "pending";
    
    if (isApprovalStep) {
      firstTxStatus.value = "failed";
    } else {
      if (transactionType.value === "submit_claim_with_approval") {
        secondTxStatus.value = "failed";
      } else {
        firstTxStatus.value = "failed";
      }
    }
    
    transactionError.value = error.shortMessage || (isApprovalStep ? "Failed to approve deposit token" : "Failed to submit claim");
  } finally {
    isSubmitting.value = false;
  }
};

const resetTransaction = () => {
  firstTxStatus.value = "";
  secondTxStatus.value = "";
  transactionType.value = "";
  currentTxHash.value = "";
  transactionError.value = "";
};

const retryTransaction = () => {
  if (transactionType.value === "execute" && selectedClaim.value) {
    handleExecute(selectedClaim.value.id);
  } else if (transactionType.value === "submit_claim" || transactionType.value === "submit_claim_with_approval") {
    handleSubmitClaim();
  } else if (transactionType.value === "approve" && selectedClaim.value) {
    handleApproveClaim(selectedClaim.value.id);
  } else if (transactionType.value === "mark_spam" && selectedClaim.value) {
    handleMarkAsSpam(selectedClaim.value.id);
  } else if (transactionType.value === "execute_approval" && selectedClaim.value) {
    handleExecuteApprovalTransaction(selectedClaim.value.id);
  } else if (transactionType.value === "execute_spam" && selectedClaim.value) {
    handleExecuteSpamTransaction(selectedClaim.value.id);
  }
};

const parseClaimDescription = (rawDescription) => {
  try {
    const parsedData = JSON.parse(rawDescription);
    if (parsedData.version === 1 && parsedData.cover && parsedData.description) {
      return {
        description: parsedData.description,
        cover: parsedData.cover
      };
    }
  } catch (e) {
    // If parsing fails, treat as old format
  }

  return {
    description: rawDescription
  };
};

const loadClaimsTable = async () => {
  const publicClient = web3Store.ethClient;

  const claimerAddress = getContractAddress("CLAIMER", web3Store.chainId);

  const startIndex = Math.max(0, totalClaims.value - (currentPage.value * itemsPerPage.value));
  const endIndex = totalClaims.value - ((currentPage.value - 1) * itemsPerPage.value);

  let promises = [];
  for (let i = endIndex; i > startIndex && i >= 0; i--) {
    promises.push(publicClient.readContract({
      address: claimerAddress,
      abi: claimerABI,
      functionName: 'claims',
      args: [i - 1]
    }));
  }
  const retClaims = await Promise.all(promises);

  claims.value = [];
  let orderCounter = 0;
  for (let i = endIndex; i > startIndex && i >= 0; i--) {
    const claim = retClaims[orderCounter];

    const parsedDescription = parseClaimDescription(claim.description);

    const newClaim = {
      id: i - 1,
      date: new Date(Number(claim[6]) * 1000),
      amount: claim[4],
      description: parsedDescription.description,
      ...(parsedDescription.cover && { cover: parsedDescription.cover }),
      receiver: claim[1],
      proposer: claim[0],
      poolAddress: claim[2],
      depositAmount: claim[5],
      startTime: Number(claim[6]),
      approvalTime: Number(claim[7]),
      approved: claim[8],
      executed: claim[9],
      exists: claim[10],
      spam: claim[11]
    };
    claims.value.push(newClaim);
    orderCounter++;
  }

  await loadApprovalCounts();
}

const loadApprovalCounts = async () => {
  if (claims.value.length === 0) return;

  const claimerAddress = getContractAddress("CLAIMER", web3Store.chainId);
  const approvalPromises = [];
  
  for (const claim of claims.value) {
    const approveData = encodeApproveClaimCall(claim.id);
    const spamData = encodeMarkAsSpamCall(claim.id);
    
    const approveTxHash = createTransactionHash(claimerAddress, 0, approveData);
    const spamTxHash = createTransactionHash(claimerAddress, 0, spamData);
    
    approvalPromises.push(
      getApprovalCount(approveTxHash),
      getApprovalCount(spamTxHash)
    );
  }
  
  const results = await Promise.all(approvalPromises);
  for (let i = 0; i < claims.value.length; i++) {
    const claim = claims.value[i];
    const approveCount = results[i * 2];
    const spamCount = results[i * 2 + 1];
    claimApprovals.value.set(claim.id, {
      approveCount,
      spamCount
    });
  }
}

const loadClaimsState = async () => {
  try {
    isLoadingClaims.value = true;
    const publicClient = web3Store.ethClient;

    const claimerAddress = getContractAddress("CLAIMER", web3Store.chainId);
    const controlBoardAddress = getContractAddress("CONTROL_BOARD", web3Store.chainId);

    const retValues = await Promise.all([
        publicClient.readContract({ address: claimerAddress, abi: claimerABI, functionName: 'approvalPeriod' }),
        publicClient.readContract({ address: claimerAddress, abi: claimerABI, functionName: 'executionTimeout' }),
        publicClient.readContract({ address: claimerAddress, abi: claimerABI, functionName: 'claimReduction' }),
        publicClient.readContract({ address: claimerAddress, abi: claimerABI, functionName: 'claimCounter' }),
        publicClient.readContract({ address: claimerAddress, abi: claimerABI, functionName: 'claimDeposit' }),
        publicClient.readContract({ address: claimerAddress, abi: claimerABI, functionName: 'depositToken' }),
        publicClient.readContract({ address: controlBoardAddress, abi: controlBoardABI, functionName: 'threshold' }),
        publicClient.readContract({ address: controlBoardAddress, abi: controlBoardABI, functionName: 'controllersCount' })
    ]);

    approvalPeriod.value = Number(retValues[0]);
    executionTimeout.value = Number(retValues[1]);
    claimReduction.value = Number(retValues[2]);
    totalClaims.value = Number(retValues[3]);
    claimDeposit.value = retValues[4];
    depositToken.value = retValues[5];
    controlBoardThreshold.value = Number(retValues[6]);
    controlBoardControllersCount.value = Number(retValues[7]);

    await loadClaimsTable();
    await checkControllerStatus();
  } catch (error) {
    console.error("Error loading claims:", error);
  } finally {
    isLoadingClaims.value = false;
  }
};

const formatDate = (date) => {
  if (!date || new Date(date).getTime() === 0 || isNaN(new Date(date))) return "N/A";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

const formatAddress = (address) => {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

const formatAmount = (amount) => {
  if (!amount) return "0.00";
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(formatEther(amount.toString()));
};

const isReadyForExecution = (claim) => {
  if (!claim?.approved || claim?.executed || claim?.spam) return false;
  if (!claim?.approvalTime || !executionTimeout.value) return false;
  
  const currentTime = Math.floor(Date.now() / 1000);
  const executionReadyTime = Number(claim.approvalTime) + executionTimeout.value;
  
  return currentTime >= executionReadyTime;
};

const getExecutionTimeRemaining = (claim) => {
  if (!claim?.approved || !claim?.approvalTime || !executionTimeout.value) return null;
  
  const currentTime = Math.floor(Date.now() / 1000);
  const executionReadyTime = Number(claim.approvalTime) + executionTimeout.value;
  const timeRemaining = executionReadyTime - currentTime;
  
  if (timeRemaining <= 0) return null;
  
  const hours = Math.floor(timeRemaining / 3600);
  const minutes = Math.floor((timeRemaining % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m until execution`;
  }
  return `${minutes}m until execution`;
};

const getApprovalTimeRemaining = (claim) => {
  if (!claim?.startTime || !approvalPeriod.value) return null;
  
  const currentTime = Math.floor(Date.now() / 1000);
  const approvalDeadline = Number(claim.startTime) + approvalPeriod.value;
  const timeRemaining = approvalDeadline - currentTime;
  
  if (timeRemaining <= 0) return "Approval period expired";
  
  const hours = Math.floor(timeRemaining / 3600);
  const minutes = Math.floor((timeRemaining % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m left for approval`;
  }
  return `${minutes}m left for approval`;
};

const createTransactionHash = (target, value, data) => {
  const controlBoardAddress = getContractAddress('CONTROL_BOARD', web3Store.chainId);
  return keccak256(
    toHex(
      ['address', 'address', 'uint256', 'bytes'],
      [controlBoardAddress, target, value, data]
    )
  );
};

const encodeApproveClaimCall = (claimId) => {
  return encodeFunctionData({
    abi: claimerABI,
    functionName: 'approveClaim',
    args: [claimId]
  });
};

const encodeMarkAsSpamCall = (claimId) => {
  return encodeFunctionData({
    abi: claimerABI,
    functionName: 'markAsSpam',
    args: [claimId]
  });
};

const getApprovalCount = async (txHash) => {
  try {
    const publicClient = web3Store.ethClient;
    const controlBoardAddress = getContractAddress('CONTROL_BOARD', web3Store.chainId);
    
    const count = await publicClient.readContract({
      address: controlBoardAddress,
      abi: controlBoardABI,
      functionName: 'approvalCount',
      args: [txHash]
    });
    return Number(count);
  } catch (error) {
    console.error('Error getting approval count:', error);
    return 0;
  }
};

const hasUserApproved = async (txHash, userAddress) => {
  try {
    const publicClient = web3Store.ethClient;
    const controlBoardAddress = getContractAddress('CONTROL_BOARD', web3Store.chainId);
    
    return await publicClient.readContract({
      address: controlBoardAddress,
      abi: controlBoardABI,
      functionName: 'transactionApprovals',
      args: [txHash, userAddress]
    });
  } catch (error) {
    console.error('Error checking user approval:', error);
    return false;
  }
};

const openClaimDetails = (claim) => {
  selectedClaim.value = claim;
  isDialogOpen.value = true;
};

const closeClaimDetails = () => {
  isDialogOpen.value = false;
  selectedClaim.value = null;
  currentClaimError.value = '';
};

const handleApproveClaim = async (claimId) => {
  try {
    const claim = selectedClaim.value;
    if (claim) {
      const currentTime = Math.floor(Date.now() / 1000);
      const approvalDeadline = Number(claim.startTime) + approvalPeriod.value;
      
      if (currentTime > approvalDeadline) {
        transactionError.value = "Approval period has expired for this claim.";
        currentClaimError.value = transactionError.value;
        return;
      }
    }

    const claimerAddress = getContractAddress("CLAIMER", web3Store.chainId);
    const approveData = encodeApproveClaimCall(claimId);
    const approveTxHash = createTransactionHash(claimerAddress, 0, approveData);
    
    const alreadyApproved = await hasUserApproved(approveTxHash, web3Store.account);
    if (alreadyApproved) {
      transactionError.value = "You have already approved this claim.";
      currentClaimError.value = transactionError.value;
      return;
    }

    transactionType.value = "approve";
    firstTxStatus.value = "pending";

    const walletClient = web3Store.signer;

    const hash = await walletClient.writeContract({
      address: getContractAddress("CONTROL_BOARD", web3Store.chainId),
      abi: controlBoardABI,
      functionName: 'approveTransaction',
      args: [claimerAddress, 0, approveData],
      account: web3Store.account
    });
    currentTxHash.value = hash;

    await web3Store.ethClient.waitForTransactionReceipt({ hash });
    firstTxStatus.value = "success";

    await loadClaimsState();
    closeClaimDetails();
  } catch (error) {
    console.error("Error approving claim:", error);
    firstTxStatus.value = "failed";
    transactionError.value = error.shortMessage || "Approval failed. Please try again.";
    currentClaimError.value = transactionError.value;
  }
};

const handleMarkAsSpam = async (claimId) => {
  try {
    const claim = selectedClaim.value;
    if (claim) {
      const currentTime = Math.floor(Date.now() / 1000);
      const approvalDeadline = Number(claim.startTime) + approvalPeriod.value;
      
      if (currentTime > approvalDeadline) {
        transactionError.value = "Approval period has expired for this claim.";
        currentClaimError.value = transactionError.value;
        return;
      }
    }

    const claimerAddress = getContractAddress("CLAIMER", web3Store.chainId);
    const spamData = encodeMarkAsSpamCall(claimId);
    const spamTxHash = createTransactionHash(claimerAddress, 0, spamData);
    
    const alreadyApproved = await hasUserApproved(spamTxHash, web3Store.account);
    if (alreadyApproved) {
      transactionError.value = "You have already marked this claim as spam.";
      currentClaimError.value = transactionError.value;
      return;
    }

    transactionType.value = "mark_spam";
    firstTxStatus.value = "pending";

    const walletClient = web3Store.signer;

    const hash = await walletClient.writeContract({
      address: getContractAddress("CONTROL_BOARD", web3Store.chainId),
      abi: controlBoardABI,
      functionName: 'approveTransaction',
      args: [claimerAddress, 0, spamData],
      account: web3Store.account
    });
    currentTxHash.value = hash;

    await web3Store.ethClient.waitForTransactionReceipt({ hash });
    firstTxStatus.value = "success";

    await loadClaimsState();
    closeClaimDetails();
  } catch (error) {
    console.error("Error marking claim as spam:", error);
    firstTxStatus.value = "failed";
    transactionError.value = error.shortMessage || "Mark as spam failed. Please try again.";
    currentClaimError.value = transactionError.value;
  }
};

const handleExecuteApprovalTransaction = async (claimId) => {
  try {
    const claimerAddress = getContractAddress("CLAIMER", web3Store.chainId);
    const approveData = encodeApproveClaimCall(claimId);
    
    transactionType.value = "execute_approval";
    firstTxStatus.value = "pending";

    const walletClient = web3Store.signer;

    const hash = await walletClient.writeContract({
      address: getContractAddress("CONTROL_BOARD", web3Store.chainId),
      abi: controlBoardABI,
      functionName: 'executeTransaction',
      args: [claimerAddress, 0, approveData, []],
      account: web3Store.account
    });
    currentTxHash.value = hash;

    await web3Store.ethClient.waitForTransactionReceipt({ hash });
    firstTxStatus.value = "success";

    await loadClaimsState();
    closeClaimDetails();
    setTimeout(resetTransaction, 3000);
  } catch (error) {
    console.error("Error executing approval transaction:", error);
    firstTxStatus.value = "failed";
    transactionError.value = error.shortMessage || "Execution failed. Please try again.";
    currentClaimError.value = transactionError.value;
  }
};

const handleExecuteSpamTransaction = async (claimId) => {
  try {
    const claimerAddress = getContractAddress("CLAIMER", web3Store.chainId);
    const spamData = encodeMarkAsSpamCall(claimId);
    
    transactionType.value = "execute_spam";
    firstTxStatus.value = "pending";

    const walletClient = web3Store.signer;

    const hash = await walletClient.writeContract({
      address: getContractAddress("CONTROL_BOARD", web3Store.chainId),
      abi: controlBoardABI,
      functionName: 'executeTransaction',
      args: [claimerAddress, 0, spamData, []],
      account: web3Store.account
    });
    currentTxHash.value = hash;

    await web3Store.ethClient.waitForTransactionReceipt({ hash });
    firstTxStatus.value = "success";

    await loadClaimsState();
    closeClaimDetails();
    setTimeout(resetTransaction, 3000);
  } catch (error) {
    console.error("Error executing spam transaction:", error);
    firstTxStatus.value = "failed";
    transactionError.value = error.shortMessage || "Execution failed. Please try again.";
    currentClaimError.value = transactionError.value;
  }
};

const handleExecute = async (claimId) => {
  try {
    const claim = selectedClaim.value;
    if (claim && !isReadyForExecution(claim)) {
      transactionError.value = "Execution timeout has not passed yet. Please wait.";
      return;
    }

    transactionType.value = "execute";
    firstTxStatus.value = "pending";

    const walletClient = web3Store.signer;

    const hash = await walletClient.writeContract({
      address: getContractAddress("CLAIMER", web3Store.chainId),
      abi: claimerABI,
      functionName: 'executeClaim',
      args: [claimId],
      account: web3Store.account
    });
    currentTxHash.value = hash;

    await web3Store.ethClient.waitForTransactionReceipt({ hash });
    firstTxStatus.value = "success";

    await loadClaimsState();

    closeClaimDetails();
    setTimeout(resetTransaction, 3000);
  } catch (error) {
    console.error("Execution error:", error);
    firstTxStatus.value = "failed";
    transactionError.value = error.shortMessage || "Execution failed. Please try again.";
  }
};

const goToPage = async (page) => {
  currentPage.value = page;
  await loadClaimsTable();
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    goToPage(currentPage.value + 1);
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    goToPage(currentPage.value - 1);
  }
};

watch(
  () => [web3Store.isConnected, web3Store.account, web3Store.chainId],
  async (values) => {
    if (values[0]) {
      await loadClaimsState();
    } else {
      isController.value = false;
    }
  }
);

let updateTimer = null;

onMounted(() => {
  updateTimer = setInterval(() => {
    const dummy = ref(0);
    dummy.value++;
  }, 60000);
});

onUnmounted(() => {
  if (updateTimer) {
    clearInterval(updateTimer);
  }
});

if (web3Store.isConnected) {
  loadClaimsState();
}

const checkControllerStatus = async () => {
  try {
    if (!web3Store.isConnected || !web3Store.account) {
      isController.value = false;
      return;
    }

    const controlBoardAddress = getContractAddress('CONTROL_BOARD', web3Store.chainId);
    if (!controlBoardAddress || controlBoardAddress === '0x0000000000000000000000000000000000000000') {
      isController.value = false;
      return;
    }

    const publicClient = web3Store.ethClient;

    isController.value = await publicClient.readContract({
      address: controlBoardAddress,
      abi: controlBoardABI,
      functionName: 'isController',
      args: [web3Store.account]
    });
  } catch (error) {
    console.error('Error checking controller status:', error);
    isController.value = false;
  }
};

</script>
