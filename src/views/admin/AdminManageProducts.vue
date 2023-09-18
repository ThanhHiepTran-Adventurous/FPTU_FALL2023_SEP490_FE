<template>
    <div>
      <h1 class="text-2xl font-bold">Manage Products</h1>
  
      <!-- Example: Display a list of products and provide options to manage them -->
      <div class="mt-4">
        <div class="bg-white rounded-md p-4 shadow-md">
          <h2 class="text-xl font-semibold">Product List</h2>
          <div class="mt-4">
            <!-- Example: Loop through a list of products and display them -->
            <div v-for="product in products" :key="product.id" class="mb-4">
              <h3 class="text-lg font-semibold">{{ product.name }}</h3>
              <p>Description: {{ product.description }}</p>
              <p>Price: ${{ product.price }}</p>
              <!-- Add more product details as needed -->
  
              <!-- Example: Add buttons to edit or delete products -->
              <div class="mt-2">
                <button @click="editProduct(product)" class="bg-blue-500 text-white px-3 py-1 rounded-md">Edit</button>
                <button @click="deleteProduct(product)" class="bg-red-500 text-white px-3 py-1 rounded-md">Delete</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        products: [
          {
            id: 1,
            name: "Product 1",
            description: "Description of Product 1",
            price: 25.99,
            // Add more product properties as needed
          },
          {
            id: 2,
            name: "Product 2",
            description: "Description of Product 2",
            price: 19.99,
          },
          // Add more products to the list
        ],
      };
    },
    methods: {
      editProduct(product) {
        // Add functionality to edit a product here
        // This can be a modal or a separate edit page
        console.log(`Editing product: ${product.name}`);
      },
      deleteProduct(product) {
        // Add functionality to delete a product here
        // You may want to confirm the deletion with a modal
        console.log(`Deleting product: ${product.name}`);
      },
    },
  };
  </script>
  
  <style scoped>
  /* Add your component-specific styles here */
  </style>
  