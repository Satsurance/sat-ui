<template>
  <div class="w-screen min-h-screen m-0 p-0 bg-yellow-50">
    <header class="w-screen bg-gradient-to-r from-yellow-400 to-yellow-300 shadow-lg">
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

          <!-- User section -->
          <div class="flex items-center gap-3">
            <div class="px-4 py-2 bg-white bg-opacity-50 rounded-lg text-slate-700 text-sm font-medium hover:bg-opacity-70 transition-all duration-300">
              Welcome, User
            </div>
          </div>
        </div>

        <!-- Navigation row -->
        <nav class="mt-6">
          <Navbar />
        </nav>
      </div>
    </header>
  </div>
</template>

<script setup>
import Navbar from './components/Navbar.vue'
</script>