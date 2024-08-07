<template>
    <div class="app-container">
      <Header />
      <main class="content-area">
        <NuxtPage />
      </main>
    </div>
  </template>
  
  <script setup lang="ts">
  import Header from '~/components/Header.vue'
  </script>
  
  <style scoped>
  .app-container {
    height: 100vh;
    display: flex;
    flex-direction: column;
  }
  
  .content-area {
    flex: 1;
    overflow-y: auto;
  }
  </style>
  