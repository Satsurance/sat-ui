<!-- src/pages/Stake.vue -->
<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4">
      <!-- Header -->
      <h1 class="text-4xl font-normal text-center mb-16 text-gray-800">Insurance Pool</h1>

      <!-- Pool Info -->
      <div class="bg-white rounded-lg shadow-sm mb-8">
        <div class="grid grid-cols-3 divide-x">
          <div class="p-6 text-center">
            <div class="text-gray-600 mb-2">APR</div>
            <div class="text-2xl font-medium">5.2%</div>
          </div>
          <div class="p-6 text-center">
            <div class="text-gray-600 mb-2">Total Staked</div>
            <div class="text-2xl font-medium">{{ totalStakedAmount }} BTC</div>
          </div>
          <div class="p-6 text-center">
            <div class="text-gray-600 mb-2">Lock Period</div>
            <div class="text-2xl font-medium">7 days</div>
          </div>
        </div>
      </div>

      <!-- Staking Interface -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h2 class="text-2xl font-normal text-center mb-8">
          {{ hasPosition ? 'Your Pool Position' : 'Add Pool Position' }}
        </h2>

        <!-- Active Position View -->
        <div v-if="hasPosition" class="max-w-lg mx-auto space-y-6">
          <div class="space-y-4">
            <div class="flex justify-between items-center py-3 px-4 bg-gray-50 rounded">
              <span class="text-gray-600">Days Staked</span>
              <span class="font-medium">{{dayStayked}} days</span>
            </div>
            <div class="flex justify-between items-center py-3 px-4 bg-gray-50 rounded">
              <span class="text-gray-600">Staked Amount</span>
              <span class="font-medium">{{ stakedAmount }} BTC</span>
            </div>
          </div>

          <button
              class="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors"
          >
            Unstake Position
          </button>
        </div>

        <!-- Staking Form -->
        <div v-else class="max-w-lg mx-auto space-y-6">
          <div class="space-y-2">
            <label class="block text-gray-600">BTC Amount to Stake</label>
            <div class="flex gap-3">
              <input
                  v-model="toStakeAmount"
                  type="number"
                  placeholder="0.00"
                  class="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              >
              <button @click="stakeFunds"
                      class="px-8 bg-[#4747ff] text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Stake
              </button>
            </div>
          </div>

          <div class="bg-blue-50 rounded-lg p-4 text-blue-700">
            Minimum stake 0.01 BTC. 7-day lock period applies.
          </div>
        </div>
      </div>

      <!-- Pool Description -->
      <div class="mt-8 text-center text-gray-600">
        Stake your BTC to earn rewards while providing coverage for the community.
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, watch} from 'vue';
import {ethers} from 'ethers';
import {useWeb3Store} from '../stores/web3Store';
import {getContractAddress} from '../constants/contracts.js';
import insurancePoolABI from '../assets/abis/insurancePool.json';
import erc20ABI from '../assets/abis/erc20.json';

const hasPosition = ref(false);
const totalStakedAmount = ref(0);
const toStakeAmount = ref(0);
const stakedAmount = ref(0);
const dayStayked = ref(0);
const web3Store = useWeb3Store();

const loadPositionState = async () => {
  web3Store.isLoadedPosition = true;
  const insurancePool = new ethers.Contract(
      getContractAddress("INSURANCE_POOL", web3Store.chainId),
      insurancePoolABI,
      web3Store.provider
  );

  totalStakedAmount.value = Number(ethers.utils.formatEther(await insurancePool.totalAssetsStaked())).toFixed(2);
  const position = await insurancePool.getPoolPosition(web3Store.account);
  const K_coeff = await insurancePool.SHARED_K();
  if (position.startDate > 0) {
    hasPosition.value = true;
    stakedAmount.value = Number(ethers.utils.formatEther((position.amount / K_coeff).toString())).toFixed(2);
    dayStayked.value = (((new Date().getTime())/1000- position.startDate) /60/60/24).toFixed(2);
  }
}

const stakeFunds = async () => {
  try {
    if (!toStakeAmount.value || toStakeAmount.value <= 0) {
      alert('Please enter a valid amount to stake');
      return;
    }

    // Convert the amount to Wei (assuming 18 decimals)
    const amountInWei = ethers.utils.parseEther(toStakeAmount.value.toString());

    // Get signer for sending transactions
    const signer = web3Store.provider.getSigner();

    // Get contract instances with signer
    const insurancePool = new ethers.Contract(
        getContractAddress("INSURANCE_POOL", web3Store.chainId),
        insurancePoolABI,
        signer
    );

    const btcContract = new ethers.Contract(
        getContractAddress("BTC_TOKEN", web3Store.chainId),
        erc20ABI,
        signer
    );

    // Check BTC balance first
    const balance = await btcContract.balanceOf(web3Store.account);
    if (balance.lt(amountInWei)) {
      alert(`Insufficient BTC balance. You have ${ethers.utils.formatEther(balance)} BTC but trying to stake ${toStakeAmount.value} BTC`);
      return;
    }

    // Check if we have enough allowance
    const currentAllowance = await btcContract.allowance(
        web3Store.account,
        insurancePool.address
    );

    // If allowance is insufficient, request approval
    if (currentAllowance.lt(amountInWei)) {
      console.log('Requesting approval...');
      const approveTx = await btcContract.approve(
          insurancePool.address,
          amountInWei
      );

      // Wait for approval transaction to be mined
      console.log('Waiting for approval transaction...');
      const approveReceipt = await approveTx.wait();
      console.log('Approval successful:', approveReceipt.transactionHash);
    }

    // Submit stake transaction
    console.log('Staking funds...');
    const stakeTx = await insurancePool.joinPool(amountInWei);

    // Wait for stake transaction to be mined
    console.log('Waiting for stake transaction...');
    const stakeReceipt = await stakeTx.wait();

    console.log('Stake successful:', stakeReceipt.transactionHash);

    // Refresh position state
    await loadPositionState();

    // Clear input
    toStakeAmount.value = 0;

  } catch (error) {
    console.error('Staking error:', error);

    // Handle specific error cases
    if (error.code === 4001) {
      alert('Transaction rejected by user');
    } else if (error.code === -32603) {
      // Parse custom error for better message
      const match = error.message.match(/ERC20InsufficientBalance\((.*?)\)/);
      if (match) {
        alert('Insufficient BTC balance. Please make sure you have enough BTC tokens.');
      } else {
        alert('Internal JSON-RPC error. Please check your balance and try again.');
      }
    } else {
      alert('Error while staking: ' + error.message);
    }
  }
}

if (web3Store.isConnected) loadPositionState();

watch(() => [web3Store.isConnected, web3Store.account], async (values) => {
  if (values[0]) {
    await loadPositionState()
  }
})
</script>

<style scoped>
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>