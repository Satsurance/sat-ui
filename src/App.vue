<template>
  <!-- Remove w-screen class since it can cause overflow -->
  <div class="min-h-screen m-0 p-0 bg-yellow-50">
    <!-- Remove w-screen from header as well -->
    <header class="bg-gradient-to-r from-yellow-400 to-yellow-300 shadow-lg">
      <div class="px-8 py-6">
        <!-- Top row with logo and user info -->
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-4">
            <!-- Logo -->
            <div class="w-10 h-10 bg-white backdrop-blur-sm bg-opacity-90 rounded-xl flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300">
              <span class="text-yellow-500 font-bold text-xl">S</span>
            </div>
            <!-- App title -->
            <h1 class="text-slate-800 text-xl font-semibold tracking-tight">Satsurance</h1>
          </div>
        </div>

        <!-- Navigation row -->
        <nav class="mt-6">
          <Navbar />
        </nav>
      </div>
    </header>

    <!-- Remove container class to prevent extra margins -->
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup>
import Navbar from './components/Navbar.vue'
</script>

<style>
/* Add this to ensure no default margins or padding */
body {
  margin: 0;
  padding: 0;
}
</style>