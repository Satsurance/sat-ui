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
          <p class="text-gray-500 mt-2">
            Satsurance is currently running on Testnet
          </p>
        </div>

        <!-- Filter Tabs -->
        <div class="flex justify-center space-x-4 mb-8">
          <button
            v-for="category in categories"
            :key="category"
            :class="[
              'px-6 py-2 rounded-lg transition-colors',
              selectedCategory === category
                ? 'btn-primary bg-yellow-500 border border-yellow-500 text-white hover:bg-white hover:text-yellow-500'
                : 'btn-secondary bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
            ]"
            @click="selectedCategory = category"
          >
            {{ category }}
          </button>
        </div>
      </div>

      <!-- Product Grid - Responsive grid with different columns based on screen size -->
      <div
        v-if="filteredProducts.length > 0"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
      >
        <ProductCard
          v-for="product in filteredProducts"
          :key="product.productId"
          :product="product"
          @click="openPurchaseModal(product.productId)"
        />
      </div>

      <!-- Empty State / Coming Soon Placeholder -->
      <div
        v-else
        class="bg-white rounded-lg shadow-sm p-12 text-center"
      >
        <svg
          class="w-16 h-16 mx-auto text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <h3 class="mt-4 text-xl font-medium text-gray-900">
          Coming Soon
        </h3>
        <p class="mt-2 text-gray-500">
          We're working on adding more insurance products in this category.
        </p>
        <button
          class="mt-6 px-6 py-2 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 transition-colors"
          @click="selectedCategory = 'All'"
        >
          View All Products
        </button>
      </div>
    </div>

    <!-- Purchase Modal -->
    <CoverPurchaseDialog
      v-if="selectedProduct"
      :product="selectedProduct"
      :show="!!selectedProduct"
      :is-submitting="!!(firstTxStatus || secondTxStatus || thirdTxStatus)"
      @close="handleClose"
      @purchase="handlePurchase"
    />

    <!-- Transaction Status Modal -->
    <TransactionStatus
      :show="!!(firstTxStatus || secondTxStatus || thirdTxStatus || transactionError)"
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
import { parseEther, formatEther, encodeFunctionData } from 'viem';
import ProductCard from '../components/CoverCard.vue';
import CoverPurchaseDialog from '../components/CoverPurchaseDialog.vue';
import TransactionStatus from '../components/TransactionStatus.vue';
import { COVER_PRODUCTS } from '../constants/projects';
import {getContractAddress, SUPPORTED_NETWORKS} from '../constants/contracts';
import { useWeb3Store } from '../stores/web3Store';
import erc20ABI from '../assets/abis/erc20.json';
import insurancePoolABI from '../assets/abis/insurancePool.json';
import poolFactoryABI from '../assets/abis/poolFactory.json';
import { addTxIntention, signIntention, finalizeBTCTransaction, convertETHtoBTC } from '@midl-xyz/midl-js-executor';
import { getBalance, waitForTransaction } from '@midl-xyz/midl-js-core';

const categories = ['All', 'Web3', 'Cannabis', 'AI'];
const selectedCategory = ref('All');
const selectedProduct = ref(null);

const firstTxStatus = ref('');
const secondTxStatus = ref('');
const thirdTxStatus = ref('');
const transactionType = ref('');
const currentTxHash = ref('');
const transactionError = ref('');
const currentPurchaseParams = ref(null);

const web3Store = useWeb3Store();
const productsArray = ref([]);
const filteredProducts = computed(() => {
  if (selectedCategory.value === 'All') {
    return productsArray.value;
  }
  return productsArray.value.filter(product => product.category === selectedCategory.value);
});

const loadPoolProducts = async () => {
  try {
    const factoryAddress = getContractAddress("POOL_FACTORY", web3Store.chainId);
    if (!factoryAddress) {
      console.error("Pool factory not available for this network");
      productsArray.value = [];
      return;
    }

    const publicClient = web3Store.ethClient;

    const poolCount = await publicClient.readContract({
      address: factoryAddress,
      abi: poolFactoryABI,
      functionName: 'poolCount'
    });

    if (poolCount === 0) {
      productsArray.value = [];
      return;
    }

    const poolIndices = Array.from({ length: Number(poolCount) }, (_, i) => i + 1);
    const poolAddresses = await Promise.all(
      poolIndices.map(poolIndex => publicClient.readContract({
        address: factoryAddress,
        abi: poolFactoryABI,
        functionName: 'pools',
        args: [poolIndex]
      }))
    );

    const [productCounts, poolStats] = await Promise.all([
      Promise.all(poolAddresses.map(address => publicClient.readContract({
        address,
        abi: insurancePoolABI,
        functionName: 'productCounter'
      }))),
      Promise.all(poolAddresses.map(address => publicClient.readContract({
        address,
        abi: insurancePoolABI,
        functionName: 'poolStatsLatest'
      })))
    ]);

    const allProductPromises = [];
    poolAddresses.forEach((address, poolIndex) => {
      const count = Number(productCounts[poolIndex]);
      const realPoolIndex = poolIndex + 1;
      
      for (let productId = 0; productId < count; productId++) {
        allProductPromises.push(
          publicClient.readContract({
            address,
            abi: insurancePoolABI,
            functionName: 'getProduct',
            args: [productId]
          }).then(productData => ({
            productId,
            poolId: realPoolIndex,
            poolAddress: address,
            poolStats: poolStats[poolIndex],
            ...productData
          }))
        );
      }
    });

    const allProducts = await Promise.all(allProductPromises);

    productsArray.value = allProducts.map(product => {
      const productInfo = COVER_PRODUCTS[product.poolId]?.[product.productId];
  
      if (productInfo && product.active) {
        const basisPoints = 10000n;
        const [totalAssetsStaked_,] = product.poolStats;
        const maxCover = formatEther((BigInt(product.maxPoolAllocationPercent) * totalAssetsStaked_) / basisPoints - product.allocation);
        
        return {
          ...product,
          name: productInfo.name,
          logo: productInfo.logo,
          category: productInfo.category,
          maxCover,
        };
      }
      return null;
    }).filter(Boolean);
    
  } catch (error) {
    console.error("Error loading pool products:", error);
    productsArray.value = [];
  }
};

const transactionSteps = computed(() => {
  if (transactionType.value === 'cover_purchase') {
    return [
      {
        id: 'wrap',
        title: 'Wrap BTC',
        description: 'Convert BTC to wrapped BTC tokens',
        status: firstTxStatus.value,
        showNumber: true
      },
      {
        id: 'approve',
        title: 'Approve BTC',
        description: 'Allow smart contract to use your BTC tokens',
        status: secondTxStatus.value,
        showNumber: true
      },
      {
        id: 'purchase',
        title: 'Purchase Cover',
        description: 'Process your cover purchase',
        status: thirdTxStatus.value,
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
  thirdTxStatus.value = '';
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

    currentPurchaseParams.value = purchaseParams;

    const durationInSeconds = duration * 86400;
    const coverAmountWei = parseEther(coverAmount.toString());
    const premiumWei = parseEther(premium.toString());
    const premiumInSatoshis = convertETHtoBTC(premiumWei);

    const poolAddress = selectedProduct.value.poolAddress;
    const btcAddress = getContractAddress('BTC_TOKEN', web3Store.chainId);

    // Check if we need approval
    const currentAllowance = await web3Store.ethClient.readContract({
      address: btcAddress,
      abi: erc20ABI,
      functionName: 'allowance',
      args: [web3Store.account, poolAddress]
    });

    const needsApproval = currentAllowance < premiumWei;
    const intentions = [];

    transactionType.value = 'cover_purchase';

    // Step 1: Create tx intention for wrapping BTC
    const wrapIntention = await addTxIntention(web3Store.midlConfig, {
      evmTransaction: {
        to: btcAddress,
        value: premiumWei
      },
      satoshis: premiumInSatoshis
    });
    intentions.push(wrapIntention);

    // Step 2: Create tx intention for approval (if needed)
    if (needsApproval) {
      const approveIntention = await addTxIntention(web3Store.midlConfig, {
        evmTransaction: {
          to: btcAddress,
          data: encodeFunctionData({
            abi: erc20ABI,
            functionName: 'approve',
            args: [poolAddress, premiumWei]
          }),
          value: 0n
        }
      });
      intentions.push(approveIntention);
    }

    // Step 3: Create tx intention for purchasing cover
    const purchaseCoverIntention = await addTxIntention(web3Store.midlConfig, {
      evmTransaction: {
        to: poolAddress,
        data: encodeFunctionData({
          abi: insurancePoolABI,
          functionName: 'purchaseCover',
          args: [selectedProduct.value.productId, web3Store.account, durationInSeconds, coverAmountWei]
        }),
        value: 0n
      }
    });
    intentions.push(purchaseCoverIntention);

    // Step 4: Finalize BTC transaction with all intentions
    const btcTx = await finalizeBTCTransaction(web3Store.midlConfig, intentions, web3Store.ethClient);

    // If approval wasn't needed, mark the approve step as success immediately
    if (!needsApproval) {
      secondTxStatus.value = "success";
    }

    // Step 5: Sign each intention separately
    const serialized = [];

    // Sign wrap intention (always first)
    try {
      firstTxStatus.value = "pending";
      const signedWrapIntention = await signIntention(web3Store.midlConfig, web3Store.ethClient, intentions[0], intentions, {
        txId: btcTx.tx.id,
      });
      serialized.push(signedWrapIntention);
      firstTxStatus.value = "success";
    } catch (error) {
      console.error('Failed to sign wrap intention:', error);
      firstTxStatus.value = "failed";
      throw error;
    }

    if (needsApproval) {
      // Sign approve intention (second when approval is needed)
      try {
        secondTxStatus.value = "pending";
        const signedApproveIntention = await signIntention(web3Store.midlConfig, web3Store.ethClient, intentions[1], intentions, {
          txId: btcTx.tx.id,
        });
        serialized.push(signedApproveIntention);
        secondTxStatus.value = "success";
      } catch (error) {
        console.error('Failed to sign approve intention:', error);
        secondTxStatus.value = "failed";
        throw error;
      }
    }

    // Sign purchase cover intention (index depends on whether approval was needed)
    const purchaseIntentionIndex = needsApproval ? 2 : 1;
    try {
      thirdTxStatus.value = "pending";
      const signedPurchaseIntention = await signIntention(web3Store.midlConfig, web3Store.ethClient, intentions[purchaseIntentionIndex], intentions, {
        txId: btcTx.tx.id,
      });
      serialized.push(signedPurchaseIntention);
      thirdTxStatus.value = "success";
    } catch (error) {
      console.error('Failed to sign purchase cover intention:', error);
      thirdTxStatus.value = "failed";
      throw error;
    }

    // Step 6: Broadcast the BTC transaction to the network
    await web3Store.ethClient.sendBTCTransactions({
        serializedTransactions: serialized,
        btcTransaction: btcTx.tx.hex,
    });
    await waitForTransaction(web3Store.midlConfig, btcTx.tx.id, 1);

    setTimeout(handleClose, 2000);

  } catch (error) {
    console.error('Cover purchase process error:', error);
    transactionError.value = error.message || error.shortMessage || "Transaction failed. Please try again";
  }
};

const retryTransaction = async () => {
  if (currentPurchaseParams.value) {
    await handlePurchase(currentPurchaseParams.value);
  }
};

if (web3Store.isConnected) {
  loadPoolProducts();
}

watch(
    () => [web3Store.isConnected, web3Store.account, web3Store.chainId],
    async ([isConnected]) => {
      if (isConnected) {
        loadPoolProducts();
      }
    }
);
</script>