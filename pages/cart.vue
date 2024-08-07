<template>
    <div class="container mx-auto p-4">
      <h1 class="text-3xl font-bold mb-6">Shopping Cart</h1>
      <div v-if="cartItems.length > 0">
        <ul class="space-y-4">
          <li
            v-for="item in cartItems"
            :key="item.id"
            class="flex justify-between items-center border-b py-4"
          >
            <div class="flex-1">
              <h2 class="text-xl font-semibold">{{ item.name }}</h2>
              <div class="flex items-center">
                <p class="text-gray-600 mr-2">Quantity: {{ item.quantity }}</p>
              </div>
              <p class="text-gray-800">Price: ${{ item.price.toFixed(2) }}</p>
            </div>
            <button
              @click="confirmRemove(item)"
              class="text-red-500 hover:text-red-700"
            >
              Remove
            </button>
          </li>
        </ul>
        <div class="mt-6 flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Total: ${{ totalPrice.toFixed(2) }}
          </h2>
          <button
            @click="proceedToCheckout"
            class="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Checkout
          </button>
        </div>
      </div>
      <div v-else>
        <p>Your cart is empty.</p>
      </div>
  
      <!-- Confirmation Modal -->
      <div
        v-if="showModal"
        class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50"
      >
        <div class="bg-white p-6 rounded shadow-lg">
          <h2 class="text-xl font-semibold mb-4">Remove Item</h2>
          <p>
            Enter the quantity you want to remove for
            <strong>{{ itemToRemove?.name }}</strong
            >:
          </p>
          <input
            v-model.number="removeQuantity"
            type="number"
            min="1"
            :max="itemToRemove?.quantity"
            class="mt-2 border p-2 rounded w-full"
          />
          <div class="mt-6 flex justify-end gap-4">
            <button
              @click="removeFromCart"
              class="bg-red-500 text-white px-4 py-2 rounded"
            >
              Yes
            </button>
            <button
              @click="showModal = false"
              class="bg-gray-300 px-4 py-2 rounded"
            >
              No
            </button>
          </div>
        </div>
      </div>
  
      <!-- Checkout Modal -->
      <div
        v-if="showCheckoutModal"
        class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50"
      >
        <div class="bg-white p-6 rounded shadow-lg">
          <h2 class="text-xl font-semibold mb-4">Checkout</h2>
          <p class="mb-4">Are you sure you want to proceed to checkout?</p>
          <div class="mt-6 flex justify-end gap-4">
            <button
              @click="confirmCheckout"
              class="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Yes
            </button>
            <button
              @click="showCheckoutModal = false"
              class="bg-gray-300 px-4 py-2 rounded"
            >
              No
            </button>
          </div>
        </div>
      </div>
  
      <!-- No Stock Popup -->
      <NoStockPopup v-if="showNoStockPopup" @close="showNoStockPopup = false" />
    </div>
  </template>
  

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import NoStockPopup from "~/components/NoStockPopup.vue";

// Initialize cartItems with data from localStorage
const cartItems = ref<Array<{
  id: number;
  name: string;
  quantity: number;
  price: number;
  originalQuantity: number;
}>>([]);

// Modal state
const showModal = ref(false);
const showCheckoutModal = ref(false);
const showNoStockPopup = ref(false); // Reactive property for no stock popup
const itemToRemove = ref<{
  id: number;
  name: string;
  quantity: number;
  price: number;
  originalQuantity: number;
} | null>(null);
const removeQuantity = ref<number>(1);

// Load cart items from localStorage
onMounted(() => {
  const savedCart = localStorage.getItem("cart");
  if (savedCart) {
    const parsedCart = JSON.parse(savedCart);
    // Ensure price and quantity are numbers
    cartItems.value = parsedCart.map((item: any) => ({
      ...item,
      price: Number(item.price),
      quantity: Number(item.quantity),
      originalQuantity: Number(item.originalQuantity),
    }));

    // Check for out-of-stock items and show popup if any
    if (cartItems.value.some(item => item.quantity === 0)) {
      showNoStockPopup.value = true;
    }
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

function updateCartItem(item: any) {
  if (item.quantity > item.originalQuantity) {
    alert("Cannot exceed original quantity.");
    item.quantity = item.originalQuantity;
  }
  saveCart();
}

function confirmRemove(item: {
  id: number;
  name: string;
  quantity: number;
  price: number;
  originalQuantity: number;
}) {
  itemToRemove.value = item;
  removeQuantity.value = 1; // Reset the remove quantity
  showModal.value = true;
}

function removeFromCart() {
  if (itemToRemove.value) {
    const item = itemToRemove.value;
    const quantityToRemove = removeQuantity.value;

    if (quantityToRemove >= 1 && quantityToRemove <= item.quantity) {
      if (quantityToRemove === item.quantity) {
        // Remove the item entirely if the quantity matches
        cartItems.value = cartItems.value.filter(
          (cartItem) => cartItem.id !== item.id
        );
      } else {
        // Decrease the quantity of the item
        cartItems.value = cartItems.value.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity - quantityToRemove }
            : cartItem
        );
      }
      saveCart();
    }
    showModal.value = false;
  }
}

function proceedToCheckout() {
  showCheckoutModal.value = true;
}

function confirmCheckout() {
  // Clear the cart
  cartItems.value = [];
  saveCart();
  showCheckoutModal.value = false;
  alert("Checkout successful!");
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cartItems.value));
}
</script>


<style scoped>
.container {
  max-width: 800px;
}
</style>
