<template>
  <!-- Remove w-screen class since it can cause overflow -->
  <div class="min-h-screen m-0 p-0 bg-yellow-50">
    <!-- Remove w-screen from header as well -->
    <header class="bg-gradient-to-r from-yellow-400 to-yellow-300 shadow-lg">
      <Navbar />
    </header>

    <!-- Remove container class to prevent extra margins -->
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup>
import Navbar from "./components/Navbar.vue";
</script>

<style>
/* Add this to ensure no default margins or padding */
body {
  margin: 0;
  padding: 0;
}
</style>
