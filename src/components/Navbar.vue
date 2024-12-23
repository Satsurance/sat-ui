<template>
  <nav class="bg-white shadow-lg">
    <div class="container mx-auto px-4">
      <div class="relative flex h-16 items-center">
        <div class="flex justify-between items-center">
          <router-link class="flex items-center gap-4 cursor-pointer" to="/">
            <div
              class="w-10 h-10 bg-yellow-500 backdrop-blur-sm bg-opacity-90 rounded-xl flex items-center justify-center shadow-md"
            >
              <span class="text-white font-bold text-xl">S</span>
            </div>
            <h1 class="text-slate-800 text-xl font-semibold tracking-tight">
              Satsurance
            </h1>
          </router-link>
        </div>

        <div class="hidden lg:flex absolute left-1/2 -translate-x-1/2">
          <div class="flex items-center space-x-8">
            <router-link
                to="/cover"
                class="text-gray-600 hover:text-yellow-500"
                active-class="text-blue-600"
            >
              Get Cover
            </router-link>
            <router-link
              to="/stake"
              class="text-gray-600 hover:text-yellow-500"
              active-class="text-blue-600"
            >
              Stake
            </router-link>
            <router-link
              to="/claim"
              class="text-gray-600 hover:text-yellow-500"
              active-class="text-blue-600"
            >
              Claim
            </router-link>
            <router-link
              to="/claims_gov"
              class="text-gray-600 hover:text-yellow-500"
              active-class="text-blue-600"
            >
              Manage Claims
            </router-link>
            <a
              href="https://satsurance.gitbook.io/satsurance"
              target="_blank"
              class="text-gray-600 hover:text-yellow-500"
              active-class="text-blue-600"
            >
              Docs
            </a>
          </div>
        </div>

        <div
          class="hidden lg:flex ml-auto w-[500px] flex items-center justify-end space-x-4"
        >
          <ConnectWallet />
        </div>

        <div
          class="flex lg:hidden ml-auto w-[500px] items-center justify-end space-x-4"
          @click="toggleMobileNav"
        >
          <div class="p-2 cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </nav>

  <nav
    v-if="isMobileNavOpen"
    ref="mobileNav"
    class="fixed right-0 top-0 w-3/4 h-screen bg-white lg:hidden z-[999]"
  >
    <div class="flex flex-col w-full h-full justify-evenly items-center">
      <div class="flex justify-between items-center">
        <router-link class="flex items-center gap-4 cursor-pointer" to="/">
          <div
            class="w-10 h-10 bg-yellow-500 backdrop-blur-sm bg-opacity-90 rounded-xl flex items-center justify-center shadow-md"
          >
            <span class="text-white font-bold text-xl">S</span>
          </div>
          <h1 class="text-slate-800 text-xl font-semibold tracking-tight">
            Satsurance
          </h1>
        </router-link>
      </div>
      <div class="flex flex-col w-full items-center">
        <router-link
          to="/stake"
          class="text-gray-600 hover:text-yellow-500 py-4"
          active-class="text-blue-600"
        >
          Stake
        </router-link>
        <router-link
          to="/claim"
          class="text-gray-600 hover:text-yellow-500 py-4"
          active-class="text-blue-600"
        >
          Claims
        </router-link>
        <router-link
          to="/claims_gov"
          class="text-gray-600 hover:text-yellow-500 py-4"
          active-class="text-blue-600"
        >
          Manage Claims
        </router-link>
        <a
          href="https://satsurance.gitbook.io/satsurance"
          target="_blank"
          class="text-gray-600 hover:text-yellow-500"
          active-class="text-blue-600"
        >
          Docs
        </a>
        <router-link
          to="/cover"
          class="text-gray-600 hover:text-yellow-500 py-4"
          active-class="text-blue-600"
        >
          Contact Us
        </router-link>
      </div>
      <ConnectWallet />
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import ConnectWallet from "../components/ConnectWallet.vue";

const isMobileNavOpen = ref(false);
const mobileNav = ref(null);
const router = useRouter();

const toggleMobileNav = (e) => {
  e.stopPropagation();
  isMobileNavOpen.value = !isMobileNavOpen.value;
};

const handleClickOutside = (event) => {
  if (
    mobileNav.value &&
    !mobileNav.value.contains(event.target) &&
    isMobileNavOpen
  ) {
    isMobileNavOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
  router.beforeEach((to, from, next) => {
    isMobileNavOpen.value = false;
    next();
  });
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>
