<template>
  <div class="min-h-[85vh] bg-gray-50">
    <div class="max-w-6xl mx-auto px-4 py-8">
      <!-- Header Section -->
      <div class="bg-white rounded-xl p-6 mb-8 border border-gray-100">
        <div class="text-center mb-6">
          <h1 class="text-3xl md:text-4xl font-bold text-gray-900 flex items-center justify-center gap-3 mb-2">
            <svg class="w-10 h-10 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Available Insurance Pools
          </h1>
          <p class="text-gray-500 text-lg">Choose insurance pools to stake your BTC and earn rewards</p>
        </div>

        <!-- Stats Overview -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-gradient-to-r from-yellow-50 to-yellow-100 p-6 rounded-xl border border-yellow-200">
            <div class="text-sm text-yellow-700 mb-1">Avg APR</div>
            <div class="text-3xl font-bold text-yellow-600">{{ averageAPR }}<span class="text-lg">%</span></div>
          </div>
          <div class="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
            <div class="text-sm text-green-700 mb-1">Total TVL</div>
            <div class="text-3xl font-bold text-green-600">{{ totalTVL }} <span class="text-lg">BTC</span></div>
          </div>
          <div class="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
            <div class="text-sm text-blue-700 mb-1">Total Pools</div>
            <div class="text-3xl font-bold text-blue-600">{{ poolCount }}</div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="bg-white rounded-xl p-12 border border-gray-100">
        <div class="flex flex-col items-center justify-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mb-4"></div>
          <p class="text-gray-500">Loading available pools...</p>
        </div>
      </div>

      <!-- Pools Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="pool in pools"
          :key="pool.id"
          class="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-300 cursor-pointer"
          @click="navigateToPool(pool)"
        >
          <!-- Pool Header -->
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div>
                <h3 class="font-semibold text-gray-900">{{ pool.name }}</h3>
                <p class="text-sm text-gray-500">Insurance Pool</p>
              </div>
            </div>
            <div class="text-right">
              <div class="text-2xl font-bold text-yellow-600">{{ pool.apr }}%</div>
              <div class="text-sm text-gray-500">APR</div>
            </div>
          </div>

          <!-- Pool Stats -->
          <div class="space-y-3 mb-6">
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Total Value Locked</span>
              <span class="font-medium text-gray-900">{{ pool.tvl }} BTC</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Pool Utilization</span>
              <span class="font-medium text-gray-900">{{ pool.utilization }}%</span>
            </div>
          </div>

          <!-- Action Button -->
          <button
            class="w-full btn-primary py-3 rounded-lg font-medium transition-all duration-300 hover:shadow-md"
            @click.stop="navigateToPool(pool)"
          >
            Stake
          </button>
        </div>

        <!-- Create New Pool Card (if user has permission) -->
        <div
          v-if="canCreatePool"
          class="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border-2 border-dashed border-gray-300 hover:border-yellow-400 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center"
          @click="openCreatePoolDialog"
        >
          <div class="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
            <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
          </div>
          <h3 class="font-semibold text-gray-900 mb-2">Create New Pool</h3>
          <p class="text-sm text-gray-500 text-center">Set up a new insurance pool for staking</p>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && pools.length === 0" class="bg-white rounded-xl p-12 border border-gray-100">
        <div class="flex flex-col items-center justify-center">
          <svg class="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">No Pools Available</h3>
          <p class="text-gray-500 text-center">There are currently no insurance pools available for staking.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, markRaw, onMounted } from "vue";
import { ethers } from "ethers";
import { useRouter } from "vue-router";
import { useWeb3Store } from "../stores/web3Store";
import { getContractAddress } from "../constants/contracts.js";
import { getPoolName } from "../constants/pools.js";
import poolFactoryABI from "../assets/abis/poolFactory.json";
import insurancePoolABI from "../assets/abis/insurancePool.json";

// Router and store
const router = useRouter();
const web3Store = useWeb3Store();

// State
const pools = ref([]);
const poolCount = ref(0);
const loading = ref(true);
const poolFactory = ref(null);
const canCreatePool = ref(false);

// Computed properties
const totalTVL = computed(() => {
  return pools.value.reduce((total, pool) => total + parseFloat(pool.tvl), 0).toFixed(2);
});

const averageAPR = computed(() => {
  if (pools.value.length === 0) return 0;
  const totalAPR = pools.value.reduce((total, pool) => total + parseFloat(pool.apr), 0);
  return (totalAPR / pools.value.length).toFixed(2);
});

// Methods
const initializeContracts = () => {
  try {
    const signer = web3Store.provider.getSigner();
    
    // Check if pool factory exists for this network
    const factoryAddress = getContractAddress("POOL_FACTORY", web3Store.chainId);
    if (factoryAddress) {
      poolFactory.value = markRaw(new ethers.Contract(
        factoryAddress,
        poolFactoryABI,
        signer
      ));
    }
  } catch (error) {
    console.error("Pool factory not available for this network:", error);
  }
};

const loadPools = async () => {
  try {
    loading.value = true;
    
    if (!poolFactory.value) {
      // No pool factory available, no pools to load
      pools.value = [];
      poolCount.value = 0;
      return;
    }

    // Get pool count from factory
    const count = await poolFactory.value.poolCount();
    poolCount.value = count.toNumber();

    // Load all pools
    const poolPromises = [];
    for (let i = 0; i < poolCount.value; i++) {
      poolPromises.push(loadPoolData(i + 1));
    }

    const poolData = await Promise.all(poolPromises);
    pools.value = poolData.filter(pool => pool !== null);
    
  } catch (error) {
    console.error("Error loading pools:", error);
    pools.value = [];
    poolCount.value = 0;
  } finally {
    loading.value = false;
  }
};



const loadPoolData = async (poolIndex) => {
  try {
    // Get pool address from factory
    const poolAddress = await poolFactory.value.pools(poolIndex);
    
    // Create contract instance for this pool
    const signer = web3Store.provider.getSigner();
    const poolContract = markRaw(new ethers.Contract(
      poolAddress,
      insurancePoolABI,
      signer
    ));

    // Get pool stats
    const poolStats = await poolContract.callStatic.poolStatsLatest();
    
    const tvl = Number(ethers.utils.formatEther(poolStats.totalAssetsStaked_)).toFixed(2);
    const totalCoverAllocation = Number(ethers.utils.formatEther(poolStats.totalCoverAllocation_));
    let apr = 0;
    
    if (poolStats.totalAssetsStaked_ != 0) {
      apr = ((Number((BigInt(poolStats.totalAssetsStaked_) + BigInt(poolStats.poolRewardRate_) * BigInt(60 * 60 * 24 * 360)) * 10000n / BigInt(poolStats.totalAssetsStaked_)) / 10000 - 1) * 100).toFixed(2);
    }

    return {
      id: poolIndex,
      name: getPoolName(web3Store.chainId, poolIndex),
      address: poolAddress,
      tvl: tvl,
      apr: apr,
      utilization: tvl > 0 ? (totalCoverAllocation / parseFloat(tvl) * 100).toFixed(1) : 0
    };
  } catch (error) {
    console.error(`Error loading pool ${poolIndex}:`, error);
    return null;
  }
};

const navigateToPool = (pool) => {
  router.push(`/pools/${pool.id}`);
};

const openCreatePoolDialog = () => {
  // TODO: Implement pool creation dialog
  console.log("Create pool dialog would open here");
};

const checkCreatePermission = async () => {
  try {
    if (!poolFactory.value) return;
    
    // Check if user has MINTER_ROLE or similar permission
    const minterRole = await poolFactory.value.MINTER_ROLE();
    const hasRole = await poolFactory.value.hasRole(minterRole, web3Store.account);
    canCreatePool.value = hasRole;
  } catch (error) {
    console.error("Error checking create permission:", error);
    canCreatePool.value = false;
  }
};

// Lifecycle
onMounted(() => {
  if (web3Store.isConnected) {
    initializeContracts();
    loadPools();
    checkCreatePermission();
  }
});

// Watch for web3 connection changes
watch(
  () => [web3Store.isConnected, web3Store.account, web3Store.chainId],
  async ([isConnected]) => {
    if (isConnected) {
      initializeContracts();
      await loadPools();
      await checkCreatePermission();
    } else {
      pools.value = [];
      poolCount.value = 0;
      canCreatePool.value = false;
    }
  }
);
</script> 