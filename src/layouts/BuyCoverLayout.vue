<!-- BuyCoverLayout.vue -->
<template>
  <div class="min-h-[85vh] bg-gray-50">
    <div class="max-w-6xl mx-auto px-4 py-8">
      <!-- Header Section -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div class="flex flex-col items-center justify-between mb-6">
          <h1 class="text-2xl md:text-4xl font-semibold text-gray-900 flex items-center gap-3">
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
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            Insurance Products
          </h1>
          <p class="text-gray-500 mt-2">Satsurance is currently running on Testnet</p>
        </div>

        <!-- Filter Tabs -->
        <div class="flex justify-center space-x-4 mb-8">
          <button
              v-for="category in categories"
              :key="category"
              @click="selectedCategory = category"
              :class="[
              'px-6 py-2 rounded-lg transition-colors',
              selectedCategory === category
                ? 'btn-primary bg-yellow-500 border border-yellow-500 text-white hover:bg-white hover:text-yellow-500'
                : 'btn-secondary bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
            ]"
          >
            {{ category }}
          </button>
        </div>
      </div>

      <!-- Product Grid - Responsive grid with different columns based on screen size -->
      <div v-if="filteredProducts.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        <ProductCard
            v-for="product in filteredProducts"
            :key="product.productId"
            :product="product"
            @click="openPurchaseModal(product.productId)"
        />
      </div>

      <!-- Empty State / Coming Soon Placeholder -->
      <div v-else class="bg-white rounded-lg shadow-sm p-12 text-center">
        <svg class="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h3 class="mt-4 text-xl font-medium text-gray-900">Coming Soon</h3>
        <p class="mt-2 text-gray-500">We're working on adding more insurance products in this category.</p>
        <button
            @click="selectedCategory = 'All'"
            class="mt-6 px-6 py-2 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 transition-colors">
          View All Products
        </button>
      </div>

    </div>

    <!-- Purchase Modal -->
    <CoverPurchaseDialog
        v-if="selectedProduct"
        :product="selectedProduct"
        :show="!!selectedProduct"
        :is-submitting="firstTxStatus !== ''"
        @close="handleClose"
        @purchase="handlePurchase"
    />

    <!-- Transaction Status Modal -->
    <TransactionStatus
        :show="!!firstTxStatus"
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
import { ref, computed, watch } from 'vue';
import { ethers } from 'ethers';
import ProductCard from '../components/CoverCard.vue';
import CoverPurchaseDialog from '../components/CoverPurchaseDialog.vue';
import TransactionStatus from '../components/TransactionStatus.vue';
import { COVER_PRODUCTS } from '../constants/projects';
import {getContractAddress, SUPPORTED_NETWORKS} from '../constants/contracts';
import { useWeb3Store } from '../stores/web3Store';
import erc20ABI from '../assets/abis/erc20.json';
import insurancePoolABI from '../assets/abis/insurancePool.json';

const categories = ['All', 'Web3', 'Cannabis', 'AI'];
const selectedCategory = ref('All');
const selectedProduct = ref(null);

// Transaction state
const firstTxStatus = ref('');
const secondTxStatus = ref('');
const transactionType = ref('');
const currentTxHash = ref('');
const transactionError = ref('');
const currentPurchaseParams = ref(null);

const web3Store = useWeb3Store();
const productsArray = ref([]);
const filteredProducts = computed(() => {
  console.log("filteredProducts", productsArray.value);
  if (selectedCategory.value === 'All') {
    return productsArray.value;
  }
  return productsArray.value.filter(product => product.category === selectedCategory.value);
});

const loadPoolProducts = async () => {
  const poolId = 1;
  const poolContract = new ethers.Contract(
      getContractAddress("INSURANCE_POOL", web3Store.chainId),
      insurancePoolABI,
      web3Store.provider
  );
  const poolProductsCount = (await poolContract.productCounter()).toNumber();
  const poolStats = await poolContract.callStatic.poolStatsLatest();
  const poolProductsList = await Promise.all(
    Array(poolProductsCount).fill().map((_, i) => {
      const productId = i;
      return poolContract.callStatic.getProduct(productId).then(productData => ({
        productId,
        ...productData
      }));
    })
  );
  console.log("poolStats", poolStats);
  console.log("poolProductsList", poolProductsList);

  productsArray.value = poolProductsList.map(product => {
      const productInfo = COVER_PRODUCTS[poolId]?.[product.productId.toNumber()];
  
      if (productInfo) {
        // Calculate minCover and maxCover
        const minCover = 0;
        const basisPoints = 10000n; // Standard basis points
        const maxCover = ethers.utils.formatEther((BigInt(product.maxPoolAllocationPercent) * BigInt(poolStats.totalAssetsStaked_) / basisPoints) - BigInt(product.allocation));
        
        return {
          name: productInfo.name,
          logo: productInfo.logo,
          category: productInfo.category,
          minCover,
          maxCover,
          // Merge with the product data from the pool
          ...product
        };
      }
      return null;
    }).filter(Boolean);

  console.log("productsArray", productsArray.value);
};

const transactionSteps = computed(() => {
  if (transactionType.value === 'cover_purchase') {
    return [
      {
        id: 'approve',
        title: 'Approve BTC',
        description: 'Allow smart contract to use your BTC',
        status: firstTxStatus.value,
        showNumber: true
      },
      {
        id: 'purchase',
        title: 'Purchase Cover',
        description: 'Process your cover purchase',
        status: secondTxStatus.value,
        showNumber: true
      }
    ];
  }
  return [];
});

const openPurchaseModal = (productId) => {
  selectedProduct.value = productsArray.value.find(product => product.productId === productId);
};

const resetTransaction = () => {
  firstTxStatus.value = '';
  secondTxStatus.value = '';
  transactionType.value = '';
  currentTxHash.value = '';
  transactionError.value = '';
  currentPurchaseParams.value = null;
};

const handleClose = () => {
  selectedProduct.value = null;
  resetTransaction();
};

const handlePurchase = async (purchaseParams) => {
  try {
    const { coverAmount, duration, premium } = purchaseParams;

    // Store params for retry functionality
    currentPurchaseParams.value = purchaseParams;

    console.log('params: ', coverAmount, duration, premium);

    const durationInSeconds = duration * 86400;
    const coverAmountWei = ethers.utils.parseEther(coverAmount.toFixed(18));
    const premiumWei = ethers.utils.parseEther(premium.toFixed(18));

    const signer = web3Store.provider.getSigner();

    // Get contract instances
    const poolContract = new ethers.Contract(
        getContractAddress('INSURANCE_POOL', web3Store.chainId),
        insurancePoolABI,
        signer
    );

    const paymentToken = new ethers.Contract(
        getContractAddress('BTC_TOKEN', web3Store.chainId),
        erc20ABI,
        signer
    );

    // Check and handle allowance
    const currentAllowance = await paymentToken.allowance(
        web3Store.account,
        poolContract.address
    );

    transactionType.value = 'cover_purchase';

    // First step: Token approval if needed
    if (currentAllowance.lt(premiumWei)) {
      try {
        firstTxStatus.value = 'pending';

        const approveTx = await paymentToken.approve(
            poolContract.address,
            premiumWei
        );
        currentTxHash.value = approveTx.hash;

        await approveTx.wait();
        firstTxStatus.value = 'success';
      } catch (error) {
        console.error('Approval error:', error);
        firstTxStatus.value = 'failed';
        transactionError.value = error.code === 4001
            ? 'Transaction rejected by user'
            : 'Failed to approve tokens';
        throw error;
      }
    }

    // Second step: Purchase cover
    try {
      secondTxStatus.value = 'pending';

      const purchaseTx = await poolContract.purchaseCover(
          selectedProduct.value.productId,
          web3Store.account,
          durationInSeconds,
          coverAmountWei
      );

      currentTxHash.value = purchaseTx.hash;
      await purchaseTx.wait();
      secondTxStatus.value = 'success';

      setTimeout(handleClose, 2000);

    } catch (error) {
      console.error('Purchase error:', error);
      secondTxStatus.value = 'failed';
      transactionError.value = error.code === 4001
          ? 'Transaction rejected by user'
          : error.code === -32603
              ? 'Insufficient balance or internal error'
              : 'Transaction failed. Please try again';
      throw error;
    }

  } catch (error) {
    console.error('Cover purchase process error:', error);
  }
};

const retryTransaction = async () => {
  if (currentPurchaseParams.value) {
    await handlePurchase(currentPurchaseParams.value);
  }
};

// Initialize contracts and load data when web3 is connected
if (web3Store.isConnected) {
  loadPoolProducts();
}

// Watch for web3 connection changes
watch(
    () => [web3Store.isConnected, web3Store.account, web3Store.chainId],
    async ([isConnected]) => {
      if (isConnected) {
        loadPoolProducts();
      }
    }
);
</script>