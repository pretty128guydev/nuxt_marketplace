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
        <p
          class="text-lg mb-4"
          :class="{ 'text-red-500': availableQuantity === 0 }"
        >
          Available Quantity: {{ availableQuantity }}
        </p>
        <div class="flex items-center mb-4">
          <label for="quantity" class="text-lg mr-2">Quantity:</label>
          <input
            type="number"
            id="quantity"
            v-model="selectedQuantity"
            :min="1"
            :max="availableQuantity"
            :disabled="availableQuantity === 0"
            @input="handleQuantityInput"
            class="w-16 text-center border rounded"
          />
        </div>
        <button
          @click="addToCart"
          class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Add to Cart
        </button>
      </div>
    </div>

    <!-- Success Popup -->
    <SuccessPopup v-if="showSuccessPopup" @close="showSuccessPopup = false" />

    <!-- Notification Popup -->
    <NotificationPopup
      :show="showNotification"
      title="Quantity Limit"
      message="Cannot add more than available quantity."
      @close="showNotification = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { useFetch, useRoute } from "#imports";
import SuccessPopup from "~/components/SuccessPopup.vue";
import NotificationPopup from "~/components/NotificationPopup.vue";

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
const showNotification = ref(false);
const selectedQuantity = ref(1); // Initialize selected quantity

const { data } = await useFetch(`/api/products/${route.params.id}`);
product.value = data.value || null;

// Compute the available quantity based on product and cart state
const availableQuantity = computed(() => {
  if (!product.value || product.value.quantity === undefined) return 0;
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const itemInCart = cart.find((item: any) => item.id === product.value?.id);
  const cartQuantity = itemInCart ? itemInCart.quantity : 0;
  return Math.max(0, (product.value.quantity || 0) - cartQuantity);
});

function handleQuantityInput(event: Event) {
  const input = event.target as HTMLInputElement;
  const value = Number(input.value);
  selectedQuantity.value = Math.max(
    1,
    Math.min(value, availableQuantity.value)
  );
}

function addToCart() {
  if (!product.value || product.value.quantity === undefined) {
    showNotification.value = true;
    return;
  }

  if (availableQuantity.value === 0) {
    showNotification.value = true;
    return;
  }

  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const itemInCart = cart.find((item: any) => item.id === product.value?.id);

  if (itemInCart) {
    if (
      itemInCart.quantity + selectedQuantity.value >
      product.value.quantity!
    ) {
      showNotification.value = true;
      return;
    }
    itemInCart.quantity += selectedQuantity.value;
  } else {
    if (selectedQuantity.value > product.value.quantity!) {
      showNotification.value = true;
      return;
    }
    cart.push({ ...product.value, quantity: selectedQuantity.value });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  showSuccessPopup.value = true;
}

// Watch for changes in product quantity to reset selected quantity if necessary
watch(
  () => product.value?.quantity,
  (newQuantity) => {
    if (newQuantity === 0) {
      selectedQuantity.value = 0;
    }
  }
);
</script>

<style scoped>
.disabled\:opacity-50 {
  opacity: 0.5;
}

.disabled\:cursor-not-allowed {
  cursor: not-allowed;
}
</style>
