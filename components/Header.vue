<template>
    <header class="bg-blue-800 text-white py-4">
      <div class="container mx-auto flex items-center justify-between px-4">
        <div class="text-2xl font-bold">
          <NuxtLink to="/" class="hover:underline">Marketplace</NuxtLink>
        </div>
        <nav>
          <ul class="flex space-x-6">
            <li>
              <NuxtLink to="/" class="hover:underline">Home</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/cart" class="hover:underline">Cart</NuxtLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  </template>
  
  <script setup lang="ts">
  </script>
  
  <style scoped>
  </style>
  