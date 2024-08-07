<template>
    <div
      class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50"
    >
      <div class="bg-white p-6 rounded-lg shadow-lg">
        <h2 class="text-xl font-semibold mb-4">Out of Stock</h2>
        <p class="mb-4">
          This product is currently out of stock. Please check back later.
        </p>
        <button
          @click="redirectToHome"
          class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          OK
        </button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useRouter } from "vue-router";
  
  const router = useRouter();
  
  function redirectToHome() {
    router.push({ name: "index" }); // Adjust the route name according to your router setup
  }
  </script>
  
  <style scoped>
  /* Add any additional styling if needed */
  </style>
  