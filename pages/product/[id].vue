<template>
  <div class="p-6 max-w-4xl mx-auto">
    <h1 class="text-3xl font-bold mb-4">Name: {{ product?.name }}</h1>
    <div class="flex items-center mb-4">
      <img
        :src="product?.image"
        alt="Product Image"
        class="w-48 h-48 object-cover rounded-lg shadow-md"
      />
      <div class="ml-6">
        <p class="text-lg mb-2">Description: {{ product?.description }}</p>
        <p class="text-xl font-semibold mb-4">Price: ${{ product?.price }}</p>
        <div class="flex items-center mb-4">
          <label for="quantity" class="text-lg mr-2">Quantity:</label>
          <input
            type="number"
            id="quantity"
            v-model.number="selectedQuantity"
            :min="1"
            :max="product?.quantity"
            :value="product?.quantity === 0 ? 0 : selectedQuantity"
            :disabled="product?.quantity === 0"
            @input="handleQuantityInput"
            class="w-16 text-center border rounded"
          />
        </div>
        <button
          @click="addToCart"
          :disabled="product?.quantity === 0"
          class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add to Cart
        </button>
      </div>
    </div>

    <!-- Success Popup -->
    <SuccessPopup v-if="showSuccessPopup" @close="showSuccessPopup = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useFetch, useRoute } from "#imports";
import SuccessPopup from "~/components/SuccessPopup.vue";

const route = useRoute();
const product = ref<{
  id?: number;
  name?: string;
  description?: string;
  price?: number;
  image?: string;
  quantity?: number;
} | null>(null);
const showSuccessPopup = ref(false);
const selectedQuantity = ref(1); // Initialize selected quantity

const { data } = await useFetch(`/api/products/${route.params.id}`);
product.value = data.value || null;

// Watch for changes in product quantity to reset selected quantity if necessary
watch(
  () => product.value?.quantity,
  (newQuantity) => {
    if (newQuantity === 0) {
      selectedQuantity.value = 0;
    }
  }
);

function handleQuantityInput(event: Event) {
  const input = event.target as HTMLInputElement;
  const value = Number(input.value);
  if (product.value?.quantity === 0) {
    selectedQuantity.value = 0;
  } else {
    selectedQuantity.value = Math.max(
      1,
      Math.min(value, product.value?.quantity || 1)
    );
  }
}

function addToCart() {
  if (product.value?.quantity === 0) {
    alert("Cannot add out-of-stock items to the cart.");
    return;
  }

  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const itemInCart = cart.find((item: any) => item.id === product.value?.id);

  if (itemInCart) {
    if (
      product.value?.quantity &&
      itemInCart.quantity + selectedQuantity.value > product.value?.quantity
    ) {
      alert("Cannot add more than available quantity.");
      return;
    }
    itemInCart.quantity += selectedQuantity.value;
  } else {
    if (
      product.value?.quantity &&
      selectedQuantity.value > product.value?.quantity
    ) {
      alert("Cannot add more than available quantity.");
      return;
    }
    cart.push({ ...product.value, quantity: selectedQuantity.value });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  showSuccessPopup.value = true;
}
</script>

<style scoped>
.disabled:opacity-50 {
  opacity: 0.5;
}

.disabled:cursor-not-allowed {
  cursor: not-allowed;
}
</style>
