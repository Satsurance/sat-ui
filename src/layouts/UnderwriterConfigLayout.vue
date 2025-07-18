<template>
  <div class="min-h-[85vh] bg-gray-50">
    <div class="max-w-6xl mx-auto px-4 py-8">
      <!-- Header Section -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <div class="flex flex-col items-center md:items-start text-center md:text-left space-y-2">
            <h1 class="text-2xl md:text-4xl font-semibold text-gray-900 flex items-center gap-3">
              <button
                @click="$router.push(`/pools/${poolId}`)"
                class="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md border border-gray-200 hover:border-gray-300"
                title="Back to Pool Staking"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                </svg>
              </button>
              <svg class="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              Underwriter Dashboard
            </h1>
            <p class="text-gray-500">Manage pool settings, products, and monitor performance</p>
          </div>
          
          <div class="flex items-center space-x-4 mt-4 md:mt-0">
            <div class="text-right">
              <div class="text-sm text-gray-500">Pool</div>
              <div class="text-lg font-semibold text-gray-900">{{ poolDisplayName }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Access Control Check -->
      <div v-if="!isUnderwriter && web3Store.isConnected" class="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
        <div class="flex items-center space-x-3">
          <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
          <div>
            <h3 class="text-red-800 font-semibold">Access Denied</h3>
            <p class="text-red-600">Only the pool underwriter can access this dashboard.</p>
          </div>
        </div>
      </div>

      <!-- Dashboard Content -->
      <div v-if="isUnderwriter || !web3Store.isConnected" class="space-y-8">
        <!-- Pool Statistics -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <svg class="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
            Pool Statistics
          </h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div class="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <div class="text-sm text-blue-700 mb-1">Total Assets Staked</div>
              <div class="text-2xl font-bold text-blue-600">{{ formatBTC(totalAssetsStaked) }}</div>
            </div>
            <div class="bg-green-50 p-6 rounded-lg border border-green-200">
              <div class="text-sm text-green-700 mb-1">Total Pool Shares</div>
              <div class="text-2xl font-bold text-green-600">{{ totalPoolShares.toLocaleString() }}</div>
            </div>
            <div class="bg-purple-50 p-6 rounded-lg border border-purple-200">
              <div class="text-sm text-purple-700 mb-1">Pool APR</div>
              <div class="text-2xl font-bold text-purple-600">{{ poolAPR }}%</div>
            </div>
            <div class="bg-orange-50 p-6 rounded-lg border border-orange-200">
              <div class="text-sm text-orange-700 mb-1">Cover Allocation</div>
              <div class="text-2xl font-bold text-orange-600">{{ formatBTC(totalCoverAllocation) }}</div>
            </div>
          </div>
        </div>

        <!-- Rewards Management -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <svg class="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Rewards Management
          </h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Available Rewards</label>
                <div class="text-2xl font-bold text-green-600">{{ formatBTC(availableRewards) }}</div>
              </div>
              <button
                @click="collectRewards"
                :disabled="collectRewardsLoading || availableRewards === 0"
                class="btn-primary px-4 py-2 rounded-lg disabled:opacity-50 w-full"
              >
                {{ collectRewardsLoading ? 'Collecting...' : 'Collect Rewards' }}
              </button>
            </div>
            
            <div class="space-y-4">
              <!-- Current Fee Display -->
              <div class="flex items-center justify-center">
                <div class="text-center">
                  <label class="block text-sm font-medium text-gray-700">Current Underwriter Fee</label>
                  <div class="text-lg font-semibold text-yellow-600">{{ (underwriterFee / 100).toFixed(2) }}%</div>
                </div>
              </div>
              
              <!-- Update Fee -->
              <div class="flex items-center gap-3">
                <label class="text-sm font-medium text-gray-700 whitespace-nowrap">Update Fee (%):</label>
                <input
                  v-model.number="newUnderwriterFee"
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  class="form-input w-20"
                  placeholder="10"
                />
                <button
                  @click="updateUnderwriterFee"
                  :disabled="updateSettingsLoading || newUnderwriterFee === (underwriterFee / 100)"
                  class="btn-primary px-4 py-2 rounded-lg disabled:opacity-50"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Pool Settings -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <svg class="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"/>
            </svg>
            Pool Settings
          </h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- New Deposits Setting -->
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <label class="block text-sm font-medium text-gray-700">New Deposits</label>
                  <p class="text-sm text-gray-500">Allow new users to deposit into the pool</p>
                </div>
                <div class="flex items-center">
                  <input
                    type="checkbox"
                    :checked="isNewDepositAccepted"
                    @change="toggleNewDeposits"
                    :disabled="updateSettingsLoading"
                    class="h-5 w-5 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded disabled:opacity-50"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Products Management -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <svg class="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
              </svg>
              Insurance Products
            </h2>
            <button
              @click="openCreateProductModal"
              class="btn-primary px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
              Create Product
            </button>
          </div>

          <!-- Products List -->
          <div v-if="products.length > 0" class="space-y-4">
            <div
              v-for="product in products"
              :key="product.productId"
              class="border border-gray-200 rounded-lg p-4 hover:border-yellow-300 hover:bg-yellow-50 transition-colors cursor-pointer"
              @click="openEditProductModal(product)"
            >
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-2">
                  <h3 class="font-semibold text-gray-900">{{ product.name }}</h3>
                  <span :class="[
                    'px-2 py-1 text-xs rounded-full',
                    product.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  ]">
                    {{ product.active ? 'Active' : 'Inactive' }}
                  </span>
                </div>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span class="text-gray-500">Annual Rate:</span>
                    <span class="font-medium ml-1">{{ (product.annualPercent / 100).toFixed(2) }}%</span>
                  </div>
                  <div>
                    <span class="text-gray-500">Max Duration:</span>
                    <span class="font-medium ml-1">{{ formatDuration(product.maxCoverageDuration) }}</span>
                  </div>
                  <div>
                    <span class="text-gray-500">Pool Allocation:</span>
                    <span class="font-medium ml-1">{{ (product.maxPoolAllocationPercent / 100).toFixed(2) }}%</span>
                  </div>
                  <div>
                    <span class="text-gray-500">Current Allocation:</span>
                    <span class="font-medium ml-1">{{ formatBTC(product.allocation) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div v-else class="text-center py-8 text-gray-500">
            No products created yet. Create your first product to start offering insurance coverage.
          </div>
        </div>
      </div>
    </div>

    <!-- Create Product Modal -->
    <div
      v-if="isCreateProductModalOpen"
      class="fixed inset-0 z-50 overflow-y-auto"
      @click="closeCreateProductModal"
    >
      <div class="fixed inset-0 bg-gray-500/70 backdrop-blur-sm"></div>
      <div class="flex min-h-full items-center justify-center p-4">
        <div
          class="relative w-full max-w-lg transform overflow-hidden rounded-xl bg-white p-6 shadow-xl"
          @click.stop
        >
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-gray-900">Create New Product</h3>
            <button
              @click="closeCreateProductModal"
              class="rounded-full p-2 hover:bg-gray-100 transition-colors"
            >
              <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <form @submit.prevent="createProduct" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
              <input
                v-model="productForm.name"
                type="text"
                class="form-input w-full"
                placeholder="Enter product name"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Annual Premium Rate (%)</label>
              <input
                v-model.number="productForm.annualPercent"
                type="number"
                min="0.01"
                max="100"
                step="0.01"
                class="form-input w-full"
                placeholder="e.g., 5.5"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Max Coverage Duration (days)</label>
              <input
                v-model.number="productForm.maxCoverageDuration"
                type="number"
                min="1"
                max="365"
                class="form-input w-full"
                placeholder="e.g., 90"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Max Pool Allocation (%)</label>
              <input
                v-model.number="productForm.maxPoolAllocationPercent"
                type="number"
                min="0.01"
                max="100"
                step="0.01"
                class="form-input w-full"
                placeholder="e.g., 25"
                required
              />
            </div>

            <div class="flex space-x-3 pt-4">
              <button
                type="button"
                @click="closeCreateProductModal"
                class="btn-secondary flex-1 px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="createProductLoading"
                class="btn-primary flex-1 px-4 py-2 rounded-lg disabled:opacity-50"
              >
                {{ createProductLoading ? 'Creating...' : 'Create Product' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Edit Product Modal -->
    <div
      v-if="isEditProductModalOpen"
      class="fixed inset-0 z-50 overflow-y-auto"
      @click="closeEditProductModal"
    >
      <div class="fixed inset-0 bg-gray-500/70 backdrop-blur-sm"></div>
      <div class="flex min-h-full items-center justify-center p-4">
        <div
          class="relative w-full max-w-lg transform overflow-hidden rounded-xl bg-white p-6 shadow-xl"
          @click.stop
        >
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-gray-900">Edit Product</h3>
            <button
              @click="closeEditProductModal"
              class="rounded-full p-2 hover:bg-gray-100 transition-colors"
            >
              <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <form @submit.prevent="updateProduct" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Annual Premium Rate (%)</label>
              <input
                v-model.number="editProductForm.annualPercent"
                type="number"
                min="0.01"
                max="100"
                step="0.01"
                class="form-input w-full"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Max Coverage Duration (days)</label>
              <input
                v-model.number="editProductForm.maxCoverageDuration"
                type="number"
                min="1"
                max="365"
                class="form-input w-full"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Max Pool Allocation (%)</label>
              <input
                v-model.number="editProductForm.maxPoolAllocationPercent"
                type="number"
                min="0.01"
                max="100"
                step="0.01"
                class="form-input w-full"
                required
              />
            </div>

            <div class="flex items-center justify-between">
              <label class="block text-sm font-medium text-gray-700">Active Status</label>
              <div class="flex items-center">
                <input
                  type="checkbox"
                  v-model="editProductForm.active"
                  class="h-5 w-5 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                />
              </div>
            </div>

            <div class="flex space-x-3 pt-4">
              <button
                type="button"
                @click="closeEditProductModal"
                class="btn-secondary flex-1 px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="updateProductLoading"
                class="btn-primary flex-1 px-4 py-2 rounded-lg disabled:opacity-50"
              >
                {{ updateProductLoading ? 'Updating...' : 'Update Product' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

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
import { ref, computed, watch, reactive, onMounted, markRaw } from 'vue';
import { ethers } from 'ethers';
import { useWeb3Store } from '../stores/web3Store';
import { getContractAddress, SUPPORTED_NETWORKS } from '../constants/contracts';
import { getPoolName } from '../constants/pools';
import insurancePoolABI from '../assets/abis/insurancePool.json';
import poolFactoryABI from '../assets/abis/poolFactory.json';
import TransactionStatus from '../components/TransactionStatus.vue';

// Props
const props = defineProps({
  poolId: {
    type: String,
    default: "1"
  }
});

// Store
const web3Store = useWeb3Store();

// State
const isUnderwriter = ref(false);
const poolFactory = ref(null);
const poolAddress = ref('');
const insurancePool = ref(null);
const underwriterPositionId = ref(0);
const underwriterPosition = ref({});

// Pool Statistics
const totalAssetsStaked = ref(0);
const totalPoolShares = ref(0);
const totalRewardShares = ref(0);
const poolAPR = ref(0);
const totalCoverAllocation = ref(0);
const maxSharesUserToStake = ref(0);
const maxUnderwriterSharesToUnstake = ref(0);

// Pool Settings
const isNewDepositAccepted = ref(false);
const underwriterFee = ref(0);
const newUnderwriterFee = ref(0);
const updateSettingsLoading = ref(false);

// Products
const products = ref([]);
const isCreateProductModalOpen = ref(false);
const isEditProductModalOpen = ref(false);
const createProductLoading = ref(false);
const updateProductLoading = ref(false);
const editingProductId = ref(null);

// Rewards
const availableRewards = ref(0);
const collectRewardsLoading = ref(false);

// Transaction state
const firstTxStatus = ref('');
const secondTxStatus = ref('');
const transactionType = ref('');
const currentTxHash = ref('');
const transactionError = ref('');
const currentRetryFunction = ref(null);

// Forms
const productForm = reactive({
  name: '',
  annualPercent: 0,
  maxCoverageDuration: 0,
  maxPoolAllocationPercent: 0
});

const editProductForm = reactive({
  annualPercent: 0,
  maxCoverageDuration: 0,
  maxPoolAllocationPercent: 0,
  active: true
});

// Computed
const poolDisplayName = computed(() => {
  return getPoolName(web3Store.chainId, parseInt(props.poolId));
});

const transactionSteps = computed(() => {
  switch (transactionType.value) {
    case 'toggle_deposits':
      return [
        {
          id: 'toggle',
          title: 'Update Deposit Setting',
          description: 'Change new deposit acceptance setting',
          status: firstTxStatus.value,
          showNumber: false
        }
      ];
    case 'update_fee':
      return [
        {
          id: 'update',
          title: 'Update Underwriter Fee',
          description: 'Change underwriter fee percentage',
          status: firstTxStatus.value,
          showNumber: false
        }
      ];
    case 'create_product':
      return [
        {
          id: 'create',
          title: 'Create Product',
          description: 'Create new insurance product',
          status: firstTxStatus.value,
          showNumber: false
        }
      ];
    case 'update_product':
      return [
        {
          id: 'update',
          title: 'Update Product',
          description: 'Update product settings',
          status: firstTxStatus.value,
          showNumber: false
        }
      ];
    case 'collect_rewards':
      return [
        {
          id: 'collect',
          title: 'Collect Rewards',
          description: 'Withdraw earned rewards',
          status: firstTxStatus.value,
          showNumber: false
        }
      ];
    default:
      return [];
  }
});

// Methods
const formatBTC = (amount) => {
  return (parseFloat(ethers.utils.formatEther(amount || 0))).toFixed(6) + ' BTC';
};

const formatDuration = (seconds) => {
  const days = Math.floor(seconds / (24 * 60 * 60));
  return `${days} day${days !== 1 ? 's' : ''}`;
};

const initializeContract = async () => {
  if (!web3Store.provider) return;
  
  try {
    const signer = web3Store.provider.getSigner();
    
    // Initialize pool factory
    const factoryAddress = getContractAddress("POOL_FACTORY", web3Store.chainId);
    
    poolFactory.value = markRaw(new ethers.Contract(
      factoryAddress,
      poolFactoryABI,
      signer
    ));
    
    // Get specific pool address from factory
    const poolIndex = parseInt(props.poolId);
    poolAddress.value = await poolFactory.value.pools(poolIndex);
    
    if (!poolAddress.value || poolAddress.value === '0x0000000000000000000000000000000000000000') {
      console.error(`Pool ${poolIndex} does not exist or is not deployed`);
      return;
    }
    
    // Initialize insurance pool contract with specific pool address
    insurancePool.value = markRaw(new ethers.Contract(
      poolAddress.value,
      insurancePoolABI,
      signer
    ));
    
    // Check if current user is underwriter
    const poolUnderwriter = await insurancePool.value.poolUnderwriter();
    isUnderwriter.value = poolUnderwriter.toLowerCase() === web3Store.account.toLowerCase();
    
    if (isUnderwriter.value) {
      await loadPoolData();
    }
  } catch (error) {
    console.error('Error initializing contract:', error);
  }
};

const loadPoolData = async () => {
  if (!insurancePool.value) return;
  
  try {
    // Load pool statistics
    const poolStats = await insurancePool.value.callStatic.poolStatsLatest();
    totalAssetsStaked.value = poolStats.totalAssetsStaked_;
    totalPoolShares.value = parseFloat(ethers.utils.formatEther(poolStats.totalPoolShares_));
    totalRewardShares.value = parseFloat(ethers.utils.formatEther(poolStats.totalRewardShares_));
    totalCoverAllocation.value = poolStats.totalCoverAllocation_;
    maxSharesUserToStake.value = parseFloat(ethers.utils.formatEther(poolStats.maxSharesUserToStake_));
    maxUnderwriterSharesToUnstake.value = parseFloat(ethers.utils.formatEther(poolStats.maxUnderwriterSharesToUnstake_));
    
    // Calculate APR similar to StakingLayout
    if (poolStats.totalAssetsStaked_ != 0) {
      poolAPR.value = ((Number((BigInt(poolStats.totalAssetsStaked_) + BigInt(poolStats.poolRewardRate_) * BigInt(60 * 60 * 24 * 360)) * 10000n / BigInt(poolStats.totalAssetsStaked_)) / 10000 - 1) * 100).toFixed(2);
    } else {
      poolAPR.value = "0.00";
    }
    
    // Load pool settings
    isNewDepositAccepted.value = await insurancePool.value.isNewDepositAccepted();
    underwriterFee.value = await insurancePool.value.underwriterFee();
    newUnderwriterFee.value = underwriterFee.value / 100;
    
    // Load underwriter position
    underwriterPositionId.value = await insurancePool.value.underwriterPositionId();
    underwriterPosition.value = await insurancePool.value.getPoolPosition(underwriterPositionId.value);
    
    // Load available rewards
    availableRewards.value = await insurancePool.value.callStatic.earnedPositions([0, underwriterPositionId.value]);
    
    // Load products
    await loadProducts();
    
  } catch (error) {
    console.error('Error loading pool data:', error);
  }
};

const loadProducts = async () => {
  if (!insurancePool.value) return;
  
  try {
    const productCounter = await insurancePool.value.productCounter();
    const productPromises = [];
    
    for (let i = 0; i < productCounter; i++) {
      productPromises.push(insurancePool.value.callStatic.getProduct(i));
    }
    
    const productResults = await Promise.all(productPromises);
    products.value = productResults.map(product => ({
      productId: product.productId,
      name: product.name,
      annualPercent: product.annualPercent,
      maxCoverageDuration: product.maxCoverageDuration,
      maxPoolAllocationPercent: product.maxPoolAllocationPercent,
      allocation: product.allocation,
      active: product.active
    }));
    
  } catch (error) {
    console.error('Error loading products:', error);
  }
};

const toggleNewDeposits = async () => {
  if (!insurancePool.value) return;
  
  try {
    updateSettingsLoading.value = true;
    transactionType.value = 'toggle_deposits';
    firstTxStatus.value = 'pending';
    
    const tx = await insurancePool.value.setNewDepositsFlag(!isNewDepositAccepted.value);
    currentTxHash.value = tx.hash;
    
    await tx.wait();
    firstTxStatus.value = 'success';
    
    // Update local state
    isNewDepositAccepted.value = !isNewDepositAccepted.value;
    
    setTimeout(() => {
      resetTransaction();
    }, 2000);
    
  } catch (error) {
    console.error('Error toggling deposits:', error);
    firstTxStatus.value = 'error';
    transactionError.value = error.message;
    currentRetryFunction.value = toggleNewDeposits;
  } finally {
    updateSettingsLoading.value = false;
  }
};

const updateUnderwriterFee = async () => {
  if (!insurancePool.value) return;
  
  try {
    updateSettingsLoading.value = true;
    transactionType.value = 'update_fee';
    firstTxStatus.value = 'pending';
    
    const feeInBasisPoints = Math.floor(newUnderwriterFee.value * 100);
    const tx = await insurancePool.value.setUnderwriterFee(feeInBasisPoints);
    currentTxHash.value = tx.hash;
    
    await tx.wait();
    firstTxStatus.value = 'success';
    
    // Update local state
    underwriterFee.value = feeInBasisPoints;
    
    setTimeout(() => {
      resetTransaction();
    }, 2000);
    
  } catch (error) {
    console.error('Error updating fee:', error);
    firstTxStatus.value = 'error';
    transactionError.value = error.message;
    currentRetryFunction.value = updateUnderwriterFee;
  } finally {
    updateSettingsLoading.value = false;
  }
};

const openCreateProductModal = () => {
  isCreateProductModalOpen.value = true;
  // Reset form
  productForm.name = '';
  productForm.annualPercent = 0;
  productForm.maxCoverageDuration = 0;
  productForm.maxPoolAllocationPercent = 0;
};

const closeCreateProductModal = () => {
  isCreateProductModalOpen.value = false;
};

const createProduct = async () => {
  if (!insurancePool.value) return;
  
  try {
    createProductLoading.value = true;
    transactionType.value = 'create_product';
    firstTxStatus.value = 'pending';
    
    const annualPercentInBasisPoints = Math.floor(productForm.annualPercent * 100);
    const maxCoverageDurationInSeconds = productForm.maxCoverageDuration * 24 * 60 * 60;
    const maxPoolAllocationPercentInBasisPoints = Math.floor(productForm.maxPoolAllocationPercent * 100);
    
    const tx = await insurancePool.value.createProduct(
      productForm.name,
      annualPercentInBasisPoints,
      maxCoverageDurationInSeconds,
      maxPoolAllocationPercentInBasisPoints
    );
    currentTxHash.value = tx.hash;
    
    await tx.wait();
    firstTxStatus.value = 'success';
    
    // Reload products
    await loadProducts();
    
    closeCreateProductModal();
    
    setTimeout(() => {
      resetTransaction();
    }, 2000);
    
  } catch (error) {
    console.error('Error creating product:', error);
    firstTxStatus.value = 'error';
    transactionError.value = error.message;
    currentRetryFunction.value = createProduct;
  } finally {
    createProductLoading.value = false;
  }
};

const openEditProductModal = (product) => {
  editingProductId.value = product.productId;
  editProductForm.annualPercent = product.annualPercent / 100;
  editProductForm.maxCoverageDuration = product.maxCoverageDuration / (24 * 60 * 60);
  editProductForm.maxPoolAllocationPercent = product.maxPoolAllocationPercent / 100;
  editProductForm.active = product.active;
  isEditProductModalOpen.value = true;
};

const closeEditProductModal = () => {
  isEditProductModalOpen.value = false;
  editingProductId.value = null;
};

const updateProduct = async () => {
  if (!insurancePool.value) return;
  
  try {
    updateProductLoading.value = true;
    transactionType.value = 'update_product';
    firstTxStatus.value = 'pending';
    
    const annualPercentInBasisPoints = Math.floor(editProductForm.annualPercent * 100);
    const maxCoverageDurationInSeconds = editProductForm.maxCoverageDuration * 24 * 60 * 60;
    const maxPoolAllocationPercentInBasisPoints = Math.floor(editProductForm.maxPoolAllocationPercent * 100);
    
    const tx = await insurancePool.value.setProduct(
      editingProductId.value,
      annualPercentInBasisPoints,
      maxCoverageDurationInSeconds,
      maxPoolAllocationPercentInBasisPoints,
      editProductForm.active
    );
    currentTxHash.value = tx.hash;
    
    await tx.wait();
    firstTxStatus.value = 'success';
    
    // Reload products
    await loadProducts();
    
    closeEditProductModal();
    
    setTimeout(() => {
      resetTransaction();
    }, 2000);
    
  } catch (error) {
    console.error('Error updating product:', error);
    firstTxStatus.value = 'error';
    transactionError.value = error.message;
    currentRetryFunction.value = updateProduct;
  } finally {
    updateProductLoading.value = false;
  }
};

const collectRewards = async () => {
  if (!insurancePool.value) return;
  
  try {
    collectRewardsLoading.value = true;
    transactionType.value = 'collect_rewards';
    firstTxStatus.value = 'pending';
    
    const tx = await insurancePool.value.collectRewards([0, underwriterPositionId.value]); // Position 0 is underwriter position
    currentTxHash.value = tx.hash;
    
    await tx.wait();
    firstTxStatus.value = 'success';
    
    // Reload data
    await loadPoolData();
    
    setTimeout(() => {
      resetTransaction();
    }, 2000);
    
  } catch (error) {
    console.error('Error collecting rewards:', error);
    firstTxStatus.value = 'error';
    transactionError.value = error.message;
    currentRetryFunction.value = collectRewards;
  } finally {
    collectRewardsLoading.value = false;
  }
};

const resetTransaction = () => {
  firstTxStatus.value = '';
  secondTxStatus.value = '';
  transactionType.value = '';
  currentTxHash.value = '';
  transactionError.value = '';
  currentRetryFunction.value = null;
};

const retryTransaction = () => {
  if (currentRetryFunction.value) {
    resetTransaction();
    currentRetryFunction.value();
  }
};

// Watch for wallet connection changes
watch(() => web3Store.isConnected, async (newVal) => {
  if (newVal) {
    await initializeContract();
  } else {
    isUnderwriter.value = false;
    insurancePool.value = null;
  }
});

// Initialize on mount
onMounted(async () => {
  if (web3Store.isConnected) {
    await initializeContract();
  }
});
</script>

<style scoped>
.form-input {
  @apply w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500;
}

.btn-primary {
  @apply bg-yellow-500 text-white hover:bg-yellow-600 transition-colors;
}

.btn-secondary {
  @apply bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300 transition-colors;
}
</style>
