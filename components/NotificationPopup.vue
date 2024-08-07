<template>
  <div
    v-if="show"
    class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50"
  >
    <div class="bg-white p-4 rounded shadow-lg max-w-sm w-full">
      <h2 class="text-lg font-semibold mb-2">{{ title }}</h2>
      <p class="mb-4">{{ message }}</p>
      <button
        @click="handleClick"
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        OK
      </button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

function redirectToHome() {
  router.push({ name: "index" }); // Adjust the route name according to your router setup
}

const props = defineProps({
  show: Boolean,
  title: String,
  message: String,
});

const emit = defineEmits(["close"]);

function close() {
  emit("close");
}

function handleClick() {
  close();
  redirectToHome();
}
</script>
