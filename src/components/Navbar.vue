<!-- src/components/common/Navbar.vue -->
<template>
  <nav class="bg-white shadow-lg">
    <div class="container mx-auto px-4">
      <!-- Use absolute positioning for perfect centering -->
      <div class="relative flex h-16 items-center">
        <!-- Logo/Brand - Compact width -->
        <div class="w-[200px]">
          <router-link to="/" class="text-xl font-bold text-gray-800">
            Home
          </router-link>
        </div>

        <!-- Navigation Links - Absolutely centered -->
        <div class="absolute left-1/2 -translate-x-1/2">
          <div class="flex items-center space-x-8">
            <router-link
                to="/cover"
                class="text-gray-600 hover:text-gray-900"
                active-class="text-blue-600"
            >
              Request Cover
            </router-link>
            <router-link
                to="/stake"
                class="text-gray-600 hover:text-gray-900"
                active-class="text-blue-600"
            >
              Stakes
            </router-link>
            <router-link
                to="/claim"
                class="text-gray-600 hover:text-gray-900"
                active-class="text-blue-600"
            >
              Claims
            </router-link>
            <router-link
                to="/docs"
                class="text-gray-600 hover:text-gray-900"
                active-class="text-blue-600"
            >
              Docs
            </router-link>
          </div>
        </div>

        <!-- Network Status and Wallet Connection - Larger width -->
        <div class="ml-auto w-[500px] flex items-center justify-end space-x-4">
          <NetworkStatus v-if="isConnected" />
          <ConnectWallet />
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue';
import { useWeb3 } from '../composables/useWeb3';
import ConnectWallet from '../components/ConnectWallet.vue';
import NetworkStatus from '../components/NetworkStatus.vue';

const { isConnected } = useWeb3();
</script>