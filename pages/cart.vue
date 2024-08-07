<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-6">Shopping Cart</h1>
    <div v-if="cartItems.length > 0">
      <ul class="space-y-4">
        <li v-for="item in cartItems" :key="item.id" class="flex justify-between items-center border-b py-4">
          <div class="flex-1">
            <h2 class="text-xl font-semibold">{{ item.name }}</h2>
            <p class="text-gray-600">Quantity: {{ item.quantity }}</p>
            <p class="text-gray-800">Price: ${{ item.price.toFixed(2) }}</p>
          </div>
          <button @click="removeFromCart(item.id)" class="text-red-500 hover:text-red-700">Remove</button>
        </li>
      </ul>
      <div class="mt-6 flex justify-between items-center">
        <h2 class="text-xl font-semibold">Total: ${{ totalPrice.toFixed(2) }}</h2>
        <button @click="proceedToCheckout" class="bg-blue-500 text-white px-4 py-2 rounded">Checkout</button>
      </div>
    </div>
    <div v-else>
      <p>Your cart is empty.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

// Initialize cartItems with data from localStorage
const cartItems = ref<Array<{ id: number, name: string, quantity: number, price: number }>>([]);

// Load cart items from localStorage
onMounted(() => {
  const savedCart = localStorage.getItem('cart');
  if (savedCart) {
    const parsedCart = JSON.parse(savedCart);
    // Ensure price and quantity are numbers
    cartItems.value = parsedCart.map((item: any) => ({
      ...item,
      price: Number(item.price),
      quantity: Number(item.quantity)
    }));
  }
});

const totalPrice = computed(() =>
  cartItems.value.reduce((sum, item) => {
    // Ensure price and quantity are numbers
    const price = Number(item.price);
    const quantity = Number(item.quantity);
    return sum + price * quantity;
  }, 0)
);

function removeFromCart(id: number) {
  cartItems.value = cartItems.value.filter(item => item.id !== id);
  saveCart();
}

function proceedToCheckout() {
  // Handle checkout logic
}

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cartItems.value));
}
</script>

<style scoped>
.container {
  max-width: 800px;
}
</style>
