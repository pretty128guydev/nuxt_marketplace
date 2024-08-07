<template>
  <div
    class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50"
  >
    <div class="bg-white p-6 rounded-lg shadow-lg w-80">
      <h2 class="text-xl font-bold text-green-600">Success!</h2>
      <p class="mt-2 text-gray-700">The product has been added to your cart.</p>
      <button
        @click="handleClick"
        class="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
      >
        Close
      </button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useRouter } from "vue-router";
import { defineEmits } from "vue";

const router = useRouter();
const emit = defineEmits(["close"]);

function redirectToHome() {
  router.push({ name: "index" }); // Adjust the route name according to your router setup
}

function handleClick() {
  emit("close");
  redirectToHome();
}
</script>
