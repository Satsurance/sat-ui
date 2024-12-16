<!-- src/components/common/Navbar.vue -->
<template>
  <nav class="bg-white shadow-lg">
    <div class="container mx-auto px-4">
      <div class="flex justify-between items-center h-16">
        <!-- Logo/Brand -->
        <div class="flex items-center">
          <router-link to="/" class="text-xl font-bold text-gray-800">
            Web3 App
          </router-link>
        </div>

        <!-- Navigation Links -->
        <div class="hidden md:flex items-center space-x-8">
          <router-link
              to="/"
              class="text-gray-600 hover:text-gray-900"
              active-class="text-blue-600"
          >
            Home
          </router-link>
          <router-link
              to="/portfolio"
              class="text-gray-600 hover:text-gray-900"
              active-class="text-blue-600"
          >
            Portfolio
          </router-link>
        </div>

        <!-- Network Status and Wallet Connection -->
        <div class="flex items-center space-x-4">
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