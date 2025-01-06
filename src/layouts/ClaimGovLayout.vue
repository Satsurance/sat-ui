<!-- src/pages/ClaimsManagement.vue -->
<template>
  <!-- Header Section -->
  <div class="min-h-[85vh] bg-gray-50">
    <!-- Main Content -->
    <div class="max-w-6xl mx-auto px-4 py-8">
      <!-- Header with background -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div class="flex justify-between items-center">
          <div class="space-y-1">
            <h1
              class="text-4xl font-semibold text-gray-900 flex items-center gap-3"
            >
              <svg
                class="w-8 h-8 text-yellow-500"
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
            <p class="text-gray-500">Governance and Claims Review Platform</p>
          </div>

          <div class="flex items-center space-x-4">
            <button
              @click="openSubmitClaimDialog"
              class="btn-primary inline-flex items-center px-6 py-2.5 rounded-lg"
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

        <!-- Staking Management Card -->
        <div class="bg-white rounded-lg p-6 mb-8">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Staking Information -->
            <div class="space-y-4">
              <div
                class="flex justify-between items-center py-3 px-4 rounded w-full"
              >
                <span class="text-gray-600">Amount of SURS token staked:</span>
                <span class="font-medium">{{ stakedAmount }}</span>
              </div>
              <div class="flex justify-between items-center py-3 px-4 rounded">
                <span class="text-gray-600">Available SURS token:</span>
                <span class="font-medium">{{ availableTokens }}</span>
              </div>
              <div class="flex justify-between items-center py-3 px-4 rounded">
                <span class="text-gray-600">Voting Power:</span>
                <span class="font-medium text-yellow-500">{{
                  votingPower
                }}</span>
              </div>
            </div>

            <!-- Staking Actions -->
            <div class="space-y-4">
              <div class="flex flex-col">
                <label
                  for="stake-amount"
                  class="block mb-2 text-sm text-left font-medium text-gray-900"
                >
                  SURS Amount to Stake
                </label>
                <div class="flex items-center space-x-4">
                  <input
                    id="stake-amount"
                    v-model="toStakeAmount"
                    type="number"
                    placeholder="0.99"
                    :disabled="transactionStatus !== ''"
                    class="flex-1 form-input"
                  />
                  <button
                    @click="stakeSursTokens"
                    :disabled="transactionStatus !== ''"
                    class="btn-primary w-28 px-6 py-2.5 rounded-lg disabled:bg-gray-300 disabled:border-gray-300 disabled:cursor-not-allowed"
                  >
                    Stake
                  </button>
                </div>
              </div>
              <div class="flex flex-col">
                <label
                  for="unstake-amount"
                  class="block mb-2 text-sm text-left font-medium text-gray-900"
                >
                  SURS Amount to Unstake
                </label>
                <div class="flex items-center space-x-4">
                  <input
                    id="unstake-amount"
                    v-model="toUnstakeAmount"
                    type="number"
                    placeholder="0.99"
                    :disabled="transactionStatus !== ''"
                    class="flex-1 form-input"
                  />
                  <button
                    @click="unstakeSursTokens"
                    :disabled="transactionStatus !== ''"
                    class="btn-secondary w-28 px-6 py-2.5 rounded-lg disabled:bg-gray-300 disabled:border-gray-300 disabled:cursor-not-allowed"
                  >
                    Unstake
                  </button>
                </div>
              </div>
              <div v-if="transactionError" class="text-red-600 text-sm mt-2">
                {{ transactionError }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Claims Table -->
      <div
        class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
      >
        <table class="w-full text-sm text-gray-600 divide-y divide-gray-200">
          <thead>
            <tr class="bg-white border-b border-gray-200">
              <th
                class="px-6 py-5 text-left text-xs font-semibold uppercase tracking-wider text-gray-900"
              >
                ID
              </th>
              <th
                class="px-6 py-5 text-left text-xs font-semibold uppercase tracking-wider text-gray-900"
              >
                Date
              </th>
              <th
                class="px-6 py-5 text-right text-xs font-semibold uppercase tracking-wider text-gray-900"
              >
                Amount
              </th>
              <th
                class="px-6 py-5 text-center text-xs font-semibold uppercase tracking-wider text-gray-900"
              >
                Description
              </th>
              <th
                class="px-6 py-5 text-center text-xs font-semibold uppercase tracking-wider text-gray-900"
              >
                Receiver
              </th>
              <th
                class="px-6 py-5 text-center text-xs font-semibold uppercase tracking-wider text-gray-900"
              >
                Votes
              </th>
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
                <span
                  class="inline-flex items-center justify-center min-w-[2.5rem] px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-800 rounded-full group-hover:bg-gray-200 transition-colors"
                >
                  {{ claim.id }}
                </span>
              </td>
              <td class="px-6 py-5 text-gray-600">
                {{ formatDate(claim.date) }}
              </td>
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
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 font-mono group-hover:bg-gray-200 transition-colors"
                >
                  {{ formatAddress(claim.receiver) }}
                </span>
              </td>
              <td class="px-6 py-5">
                <div class="flex flex-col items-center gap-2">
                  <div class="flex items-center gap-3 w-full max-w-[200px]">
                    <div
                      class="h-2 flex-1 bg-gray-100 rounded-full overflow-hidden"
                    >
                      <div
                        class="h-full transition-all duration-300"
                        :class="{
                          'bg-yellow-500': claim.forPercentage > 50,
                          'bg-gray-400': claim.forPercentage <= 50,
                        }"
                        :style="{ width: `${claim.forPercentage}%` }"
                      ></div>
                    </div>
                    <span
                      class="text-sm whitespace-nowrap text-gray-600 font-medium min-w-[4.5rem] text-center"
                    >
                      {{ formatAmount(claim.forVotes) }} :
                      {{ formatAmount(claim.againstVotes) }}
                    </span>
                  </div>
                  <span
                    class="text-xs"
                    :class="{
                      'text-yellow-600': claim.forPercentage > 50,
                      'text-gray-500': claim.forPercentage <= 50,
                    }"
                  >
                    {{ claim.forPercentage }}% Support
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div
        v-if="totalClaims && totalClaims > 1"
        class="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6"
      >
        <div class="flex flex-1 justify-between items-center">
          <div class="text-sm text-gray-700">
            Showing claims
            {{
              isLoadingClaims
                ? "..."
                : `${(currentPage - 1) * itemsPerPage + 1} - ${Math.min(
                    currentPage * itemsPerPage,
                    totalClaims
                  )}`
            }}
            of {{ totalClaims }}
          </div>
          <div class="flex items-center space-x-2">
            <button
              @click="prevPage"
              :disabled="currentPage === 1 || isLoadingClaims"
              class="btn-secondary px-3 py-1 rounded-lg disabled:opacity-50"
            >
              Previous
            </button>
            <span class="text-gray-700">
              Page {{ currentPage }} of {{ totalPages }}
            </span>
            <button
              @click="nextPage"
              :disabled="currentPage >= totalPages || isLoadingClaims"
              class="btn-secondary px-3 py-1 rounded-lg disabled:opacity-50"
            >
              Next
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
        ></div>
        <div class="flex min-h-full items-center justify-center p-4">
          <div
            class="relative w-full max-w-xl transform overflow-hidden rounded-3xl bg-white p-8 shadow-xl transition-all"
            @click.stop
          >
            <!-- Dialog Header -->
            <div class="flex items-center justify-between mb-8">
              <h3 class="text-2xl font-semibold text-gray-900">
                Submit New Claim
              </h3>
              <button
                @click="closeSubmitDialog"
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

            <!-- Claim Form -->
            <form @submit.prevent="handleSubmitClaim" class="space-y-6">
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
                  v-model="submitFormData.amount"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-yellow-500 focus:border-yellow-500 focus:outline-none block w-full p-2.5"
                  placeholder="0.1"
                  step="0.00000001"
                  min="0"
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
                  v-model="submitFormData.receiver"
                  @input="validateAddress"
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
                />
                <p v-if="addressError" class="mt-1 text-sm text-red-600">
                  {{ addressError }}
                </p>
                <p
                  v-else-if="isValidAddress"
                  class="mt-1 text-sm text-green-600"
                >
                  Valid Ethereum address
                </p>
              </div>

              <div class="flex justify-end pt-4">
                <button
                  type="submit"
                  :disabled="
                    isSubmitting ||
                    (!!submitFormData.receiver &&
                      (!isValidAddress || !!addressError))
                  "
                  :class="[
                    'w-full py-3 rounded-lg transition-colors duration-300',
                    isSubmitting ||
                    (!!submitFormData.receiver &&
                      (!isValidAddress || !!addressError))
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
      :sufficient-stake="sufficientStake"
      :votingPeriod="votingPeriod"
      @close="closeClaimDetails"
      @vote="handleVote"
      @execute="handleExecute"
    />

    <!-- Transaction Status Modal -->
    <TransactionStatus
      :show="!!transactionStatus"
      :status="transactionStatus"
      :type="transactionType"
      :tx-hash="currentTxHash"
      :error="transactionError"
      @close="resetTransaction"
      @retry="retryTransaction"
      token-ticker="SURS"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, reactive } from "vue";
import { ethers } from "ethers";
import { getContractAddress } from "../constants/contracts.js";
import { useWeb3Store } from "../stores/web3Store";
import claimerABI from "../assets/abis/claimer.json";
import erc20ABI from "../assets/abis/erc20.json";
import ClaimDetailsDialog from "../components/ClaimDetailsDialog.vue";
import TransactionStatus from "../components/TransactionStatus.vue";

// Store and contract setup
const web3Store = useWeb3Store();

// Staking state
const stakedAmount = ref("0");
const availableTokens = ref("0");
const votingPower = computed(() => `${stakedAmount.value} VP`);
const sufficientStake = computed(() => Number(stakedAmount.value) >= 1);
const votingPeriod = ref(0);
const stakingMode = ref("stake");

// Transaction state
const transactionStatus = ref("");
const transactionType = ref("");
const currentTxHash = ref("");
const transactionError = ref("");
const toStakeAmount = ref(null);
const toUnstakeAmount = ref(null);

// Claims state
const claims = ref([]);
const selectedClaim = ref(null);
const isDialogOpen = ref(false);
const currentPage = ref(1);
const itemsPerPage = ref(10);
const totalClaims = ref(0);
const isLoadingClaims = ref(false);

// Add computed for total pages
const totalPages = computed(() =>
  Math.ceil(totalClaims.value / itemsPerPage.value)
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
});

// Dialog management
const openSubmitClaimDialog = () => {
  isSubmitDialogOpen.value = true;
};

const closeSubmitDialog = () => {
  isSubmitDialogOpen.value = false;
  resetSubmitForm();
};

const resetSubmitForm = () => {
  submitFormData.description = "";
  submitFormData.amount = "";
  submitFormData.receiver = "";
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

    // Check if it's a valid Ethereum address format
    if (!submitFormData.receiver.match(/^0x[0-9a-fA-F]{40}$/)) {
      isValidAddress.value = false;
      addressError.value = "Invalid Ethereum address format";
      return;
    }

    // Validate checksum
    const checksumAddress = ethers.utils.getAddress(submitFormData.receiver);
    isValidAddress.value = true;
    addressError.value = "";

    // Update with checksum address
    submitFormData.receiver = checksumAddress;
  } catch (error) {
    isValidAddress.value = false;
    addressError.value = "Invalid Ethereum address";
  }
};

const handleSubmitClaim = async () => {
  try {
    if (!isValidAddress.value) {
      return;
    }

    isSubmitting.value = true;
    transactionType.value = "submit_claim";
    transactionStatus.value = "pending";

    const signer = web3Store.provider.getSigner();
    const claimer = new ethers.Contract(
      getContractAddress("CLAIMER", web3Store.chainId),
      claimerABI,
      signer
    );

    const tx = await claimer.createClaim(
      submitFormData.receiver,
      submitFormData.description,
      ethers.utils.parseEther(submitFormData.amount.toString())
    );
    currentTxHash.value = tx.hash;

    await tx.wait();
    transactionStatus.value = "success";

    // Reload claims and close dialog
    await loadClaimsState();
    closeSubmitDialog();

    // Auto-close transaction status after delay
    setTimeout(resetTransaction, 3000);
  } catch (error) {
    console.error("Error submitting claim:", error);
    transactionStatus.value = "failed";
    transactionError.value =
      error.code === 4001
        ? "Transaction rejected by user"
        : "Failed to submit claim";
  } finally {
    isSubmitting.value = false;
  }
};

// Reset transaction state
const resetTransaction = () => {
  transactionStatus.value = "";
  transactionType.value = "";
  currentTxHash.value = "";
  transactionError.value = "";
};

// Retry transaction
const retryTransaction = () => {
  if (transactionType.value === "stake") {
    stakeSursTokens();
  } else if (transactionType.value === "unstake") {
    unstakeSursTokens();
  } else if (transactionType.value === "execute" && selectedClaim.value) {
    handleExecute(selectedClaim.value.id);
  } else if (transactionType.value === "submit_claim") {
    handleSubmitClaim();
  }
};

// Staking functionality
const handleStakeProcess = async (amountInWei) => {
  try {
    const signer = web3Store.provider.getSigner();
    const claimer = new ethers.Contract(
      getContractAddress("CLAIMER", web3Store.chainId),
      claimerABI,
      signer
    );
    const sursToken = new ethers.Contract(
      getContractAddress("SURS_TOKEN", web3Store.chainId),
      erc20ABI,
      signer
    );

    // Check allowance
    const currentAllowance = await sursToken.allowance(
      web3Store.account,
      claimer.address
    );

    // Handle approval if needed
    if (currentAllowance.lt(amountInWei)) {
      transactionType.value = "stake";
      transactionStatus.value = "approval_pending";

      try {
        const approveTx = await sursToken.approve(
          claimer.address,
          amountInWei,
          {
            from: web3Store.account,
          }
        );
        currentTxHash.value = approveTx.hash;

        await approveTx.wait();
        transactionStatus.value = "approval_success";
      } catch (error) {
        transactionStatus.value = "approval_failed";
        transactionError.value =
          error.code === 4001
            ? "Transaction rejected by user"
            : "Failed to approve tokens";
        throw error;
      }
    }

    // Handle staking
    transactionStatus.value = "stake_pending";
    const stakeTx = await claimer.stake(amountInWei, {
      from: web3Store.account,
    });
    currentTxHash.value = stakeTx.hash;

    await stakeTx.wait();
    transactionStatus.value = "stake_success";

    await loadClaimsState();
    toStakeAmount.value = null;

    // Auto-close on success after delay
    setTimeout(resetTransaction, 3000);
  } catch (error) {
    console.error("Stake process error:", error);
    throw error;
  }
};

const stakeSursTokens = async () => {
  try {
    if (!toStakeAmount.value || toStakeAmount.value <= 0) {
      transactionError.value = "Please enter a valid amount to stake";
      return;
    }

    const amountInWei = ethers.utils.parseEther(toStakeAmount.value.toString());

    // Check SURS balance
    const signer = web3Store.provider.getSigner();
    const sursToken = new ethers.Contract(
      getContractAddress("SURS_TOKEN", web3Store.chainId),
      erc20ABI,
      signer
    );
    const balance = await sursToken.balanceOf(web3Store.account);

    if (balance.lt(amountInWei)) {
      transactionError.value = `Insufficient SURS balance. You have ${ethers.utils.formatEther(
        balance
      )} SURS but trying to stake ${toStakeAmount.value} SURS`;
      return;
    }

    await handleStakeProcess(amountInWei);
  } catch (error) {
    console.error("Staking error:", error);

    if (transactionStatus.value !== "approval_failed") {
      transactionStatus.value = "stake_failed";
      transactionError.value =
        error.code === 4001
          ? "Transaction rejected by user"
          : error.code === -32603
          ? "Insufficient balance or internal error"
          : "Transaction failed. Please try again";
    }
  }
};

const unstakeSursTokens = async () => {
  try {
    if (!toUnstakeAmount.value || toUnstakeAmount.value <= 0) {
      transactionError.value = "Please enter a valid amount to unstake";
      return;
    }

    const amountInWei = ethers.utils.parseEther(
      toUnstakeAmount.value.toString()
    );

    // Check staked balance
    const claimer = new ethers.Contract(
      getContractAddress("CLAIMER", web3Store.chainId),
      claimerABI,
      web3Store.provider
    );
    const stakedBalance = await claimer.stakes(web3Store.account);

    if (stakedBalance.currentAmount.lt(amountInWei)) {
      transactionError.value = `Insufficient staked balance. You have ${ethers.utils.formatEther(
        stakedBalance.currentAmount
      )} SURS but trying to unstake ${toUnstakeAmount.value} SURS`;
      return;
    }

    transactionType.value = "unstake";
    transactionStatus.value = "pending";

    const signer = web3Store.provider.getSigner();
    const claimerWithSigner = claimer.connect(signer);

    const unstakeTx = await claimerWithSigner.unstake(amountInWei, {
      from: web3Store.account,
    });
    currentTxHash.value = unstakeTx.hash;

    await unstakeTx.wait();
    transactionStatus.value = "success";

    await loadClaimsState();
    toUnstakeAmount.value = null;

    // Auto-close on success after delay
    setTimeout(resetTransaction, 3000);
  } catch (error) {
    console.error("Unstaking error:", error);
    transactionStatus.value = "failed";
    transactionError.value =
      error.code === 4001 ? "Transaction rejected by user" : "Unstaking failed";
  }
};

// Load claims
const loadClaimsState = async () => {
  try {
    isLoadingClaims.value = true;
    const claimer = new ethers.Contract(
      getContractAddress("CLAIMER", web3Store.chainId),
      claimerABI,
      web3Store.provider
    );
    const sursToken = new ethers.Contract(
      getContractAddress("SURS_TOKEN", web3Store.chainId),
      erc20ABI,
      web3Store.provider
    );
    const accountStake = await claimer.stakes(web3Store.account);
    stakedAmount.value = Number(
      ethers.utils.formatEther(accountStake.currentAmount)
    ).toFixed(2);
    availableTokens.value = Number(
      ethers.utils.formatEther(await sursToken.balanceOf(web3Store.account))
    ).toFixed(2);

    votingPeriod.value = (await claimer.votingPeriod()).toNumber();
    totalClaims.value = (await claimer.claimCounter()).toNumber();
    const startIndex = Math.max(
      0,
      totalClaims.value - currentPage.value * itemsPerPage.value
    );
    const endIndex =
      totalClaims.value - (currentPage.value - 1) * itemsPerPage.value;

    claims.value = [];

    for (let i = endIndex; i > startIndex && i >= 0; i--) {
      const claim = await claimer.claims(i - 1);
      const newClaim = {
        id: i - 1,
        date: new Date(claim.startTime * 1000),
        amount: claim.amount,
        description: claim.description,
        receiver: claim.receiver,
        proposer: claim.proposer,
        forVotes: claim.forVotes,
        againstVotes: claim.againstVotes,
        startTime: Number(claim.startTime),
        executed: claim.executed,
        exists: claim.exists,
        forPercentage: calculateVotePercentage(
          Number(claim.forVotes),
          Number(claim.againstVotes)
        ),
        votesNeeded: calculateVotesNeeded(
          Number(claim.forVotes),
          Number(claim.againstVotes)
        ),
      };
      claims.value.push(newClaim);
    }
  } catch (error) {
    console.error("Error loading claims:", error);
  } finally {
    isLoadingClaims.value = false;
  }
};

// Utility functions
const calculateVotePercentage = (forVotes, againstVotes) => {
  const total = forVotes + againstVotes;
  if (total === 0) return 0;
  return Math.round((forVotes / total) * 100);
};

const calculateVotesNeeded = (forVotes, againstVotes) => {
  const requiredMajority = 0.5; // 50% majority required
  const total = forVotes + againstVotes;
  const neededVotes = Math.ceil(total * requiredMajority - forVotes);
  return Math.max(0, neededVotes);
};

const formatDate = (date) => {
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
  return Number(ethers.utils.formatEther(amount.toString())).toFixed(2);
};

// Claim details dialog management
const openClaimDetails = (claim) => {
  selectedClaim.value = claim;
  isDialogOpen.value = true;
};

const closeClaimDetails = () => {
  isDialogOpen.value = false;
  selectedClaim.value = null;
};

const handleVote = async ({ claimId, support }) => {
  try {
    const claimer = new ethers.Contract(
      getContractAddress("CLAIMER", web3Store.chainId),
      claimerABI,
      web3Store.provider.getSigner()
    );

    const tx = await claimer.vote(claimId, support);
    await tx.wait();

    // Reload the claims state after voting
    await loadClaimsState();
  } catch (error) {
    console.error("Error voting on claim:", error);
  }
  closeClaimDetails();
};

const handleExecute = async (claimId) => {
  try {
    transactionType.value = "execute";
    transactionStatus.value = "pending";

    const claimer = new ethers.Contract(
      getContractAddress("CLAIMER", web3Store.chainId),
      claimerABI,
      web3Store.provider.getSigner()
    );

    const executeTx = await claimer.executeClaim(claimId);
    currentTxHash.value = executeTx.hash;

    await executeTx.wait();
    transactionStatus.value = "success";

    // Reload claims after successful execution
    await loadClaimsState();

    // Close dialog and reset state after delay
    closeClaimDetails();
    setTimeout(resetTransaction, 3000);
  } catch (error) {
    console.error("Execution error:", error);
    transactionStatus.value = "failed";
    transactionError.value =
      error.code === 4001
        ? "Transaction rejected by user"
        : "Execution failed. Please try again.";
  }
};

const goToPage = async (page) => {
  currentPage.value = page;
  await loadClaimsState();
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
