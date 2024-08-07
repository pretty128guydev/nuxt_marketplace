<template>
    <div class="p-6 max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold mb-4">{{product?.name }}</h1>
      <div class="flex items-center mb-4">
        <img :src="product?.image" alt="Product Image" class="w-48 h-48 object-cover rounded-lg shadow-md"/>
        <div class="ml-6">
          <p class="text-lg mb-2">{{ product?.description }}</p>
          <p class="text-xl font-semibold mb-4">{{ product?.price }}</p>
          <button @click="addToCart" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Add to Cart</button>
        </div>
      </div>
  
      <!-- Success Popup -->
      <SuccessPopup v-if="showSuccessPopup" @close="showSuccessPopup = false" />
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { useFetch, useRoute } from '#imports'
  import SuccessPopup from '~/components/SuccessPopup.vue'
  
  const route = useRoute()
  const product = ref<{ name?: string; description?: string; price?: number; image?: string } | null>(null)
  const showSuccessPopup = ref(false)
  
  const { data } = await useFetch(`/api/products/${route.params.id}`)
  product.value = data.value || null
  
  function addToCart() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    cart.push(product.value)
    localStorage.setItem('cart', JSON.stringify(cart))
    showSuccessPopup.value = true
  }
  </script>
  