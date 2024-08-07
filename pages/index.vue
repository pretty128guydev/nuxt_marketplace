<template>
  <div
    class="container mx-auto p-4 flex flex-col justify-between h-[calc(100%-100px)]"
  >
    <h1 class="text-4xl font-bold mb-8">Product List</h1>

    <!-- Filters -->
    <div class="mb-8 flex gap-4">
      <div class="flex-1">
        <label for="quantityRange" class="block text-lg font-medium mb-2"
          >Quantity Range:</label
        >
        <select
          v-model="filters.quantityRange"
          id="quantityRange"
          class="form-select"
        >
          <option value="">All</option>
          <option value="0-5">0 ~ 5</option>
          <option value="5-10">5 ~ 10</option>
          <option value="10-15">10 ~ 15</option>
          <option value="15+">15+</option>
        </select>
      </div>

      <div class="flex-1">
        <label for="priceRange" class="block text-lg font-medium mb-2"
          >Price Range:</label
        >
        <select
          v-model="filters.priceRange"
          id="priceRange"
          class="form-select"
        >
          <option value="">All</option>
          <option value="0-50">0-50</option>
          <option value="50-100">50-100</option>
          <option value="100-200">100-200</option>
        </select>
      </div>
    </div>

    <!-- Product List -->
    <ul v-if="paginatedProducts.length" class="space-y-6">
      <li
        v-for="product in paginatedProducts"
        :key="product.id"
        class="bg-white shadow-md rounded-lg p-4 flex justify-between items-center border border-gray-200"
      >
        <NuxtLink
          :to="`/product/${product.id}`"
          class="text-xl font-semibold text-blue-600 hover:underline"
        >
          {{ product.name }}
        </NuxtLink>
        <span class="text-gray-600">${{ product.price.toFixed(2) }}</span>
      </li>
    </ul>
    <p v-else class="text-center text-gray-600">No products found.</p>

    <!-- Pagination Controls -->
    <div class="mt-8 flex justify-between items-center">
      <button
        @click="previousPage"
        :disabled="currentPage === 1"
        class="bg-gray-200 text-gray-600 px-4 py-2 rounded hover:bg-gray-300 disabled:opacity-50"
      >
        Previous
      </button>
      <span class="text-lg">Page {{ currentPage }} of {{ totalPages }}</span>
      <button
        @click="nextPage"
        :disabled="currentPage === totalPages"
        class="bg-gray-200 text-gray-600 px-4 py-2 rounded hover:bg-gray-300 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";

const currentPage = ref(1);
const itemsPerPage = 3;
const filters = ref({ quantityRange: "", priceRange: "" });
const products = ref<
  Array<{ id: number; name: string; price: number; quantity: number }>
>([]);

const fetchProducts = async () => {
  try {
    const response = await fetch("/api/products");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Fetched products:", data);
    return data || [];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

onMounted(async () => {
  products.value = await fetchProducts();
});

watch(
  [
    currentPage,
    () => filters.value.quantityRange,
    () => filters.value.priceRange,
  ],
  async () => {
    products.value = await fetchProducts();
  }
);

const filteredProducts = computed(() => {
  if (!filters.value.quantityRange && !filters.value.priceRange) {
    return products.value;
  }

  let minQuantity = 0;
  let maxQuantity = Infinity;

  if (filters.value.quantityRange === "15+") {
    minQuantity = 15;
  } else if (filters.value.quantityRange) {
    [minQuantity, maxQuantity] = filters.value.quantityRange
      .split("-")
      .map(Number);
  }

  const [priceMin, priceMax] = filters.value.priceRange
    ? filters.value.priceRange.split("-").map(Number)
    : [0, Infinity];

  return products.value.filter((product) => {
    const isInQuantityRange =
      product.quantity >= minQuantity &&
      (maxQuantity === Infinity || product.quantity <= maxQuantity);
    const isInPriceRange =
      product.price >= priceMin && product.price <= priceMax;
    return isInQuantityRange && isInPriceRange;
  });
});

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredProducts.value.slice(start, end);
});

const totalPages = computed(() =>
  Math.ceil(filteredProducts.value.length / itemsPerPage)
);

function previousPage() {
  if (currentPage.value > 1) {
    currentPage.value -= 1;
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value += 1;
  }
}
</script>

<style scoped>
.form-select {
  @apply block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm;
}

.container {
  max-width: 1200px;
}

ul {
  padding: 0;
  list-style: none;
}

li {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

li:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>
