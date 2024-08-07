<template>
  <div
    class="container mx-auto p-4 flex flex-col justify-between h-calc-100-minus-100px"
  >
    <h1 class="text-4xl font-bold mb-8">Product List</h1>

    <!-- Filters -->
    <div class="mb-8 flex gap-4">
      <div class="flex-1">
        <label for="category" class="block text-lg font-medium mb-2"
          >Category:</label
        >
        <select v-model="filters.category" id="category" class="form-select">
          <option value="">All</option>
          <option value="electronics">Electronics</option>
          <option value="furniture">Furniture</option>
          <!-- Add more options here -->
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
          <option value="0-200">All</option>
          <option value="0-50">0-50</option>
          <option value="50-100">50-100</option>
          <option value="100-200">100-200</option>
          <!-- Add more options here -->
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
import { ref, computed, watch } from "vue";
import { useFetch } from "#imports";

const currentPage = ref(1);
const itemsPerPage = 10;
const filters = ref({ category: "", priceRange: "" });

// Fetch products from the API
const fetchProducts = async () => {
  try {
    const { data } = await useFetch("/api/products", {
      params: {
        page: currentPage.value,
        limit: itemsPerPage, // Server-side pagination
        category: filters.value.category,
      },
    });

    console.log("Fetched products:", data.value); // Debugging line
    return data.value || [];
  } catch (error) {
    console.error("Error fetching products:", error); // Debugging line
    return [];
  }
};

// Products list including initial fetch
const products = ref<Array<{ id: number; name: string; price: number }>>([]);

// Fetch products whenever page or filters change
watch(
  [currentPage, () => filters.value.category, () => filters.value.priceRange],
  async () => {
    products.value = await fetchProducts();
  }
);

// Filter products based on price range
const filteredProducts = computed(() => {
  if (!filters.value.priceRange) return products.value;

  const [minPrice, maxPrice] = filters.value.priceRange.split("-").map(Number);

  return products.value.filter(
    (product) => product.price >= minPrice && product.price <= maxPrice
  );
});

// Paginate filtered products
const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredProducts.value.slice(start, end);
});

// Calculate total pages based on filtered products
const totalPages = computed(() =>
  Math.ceil(filteredProducts.value.length / itemsPerPage)
);

// Handle previous page action
function previousPage() {
  if (currentPage.value > 1) {
    currentPage.value -= 1;
  }
}

// Handle next page action
function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value += 1;
  }
}

// Fetch products initially
await fetchProducts();
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
