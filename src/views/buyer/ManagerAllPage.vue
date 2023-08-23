<template>
  <div class="page">
    <h1>
      HEADER-BUYER
    </h1>
    <router-view></router-view>
    <h1>
      FOOTER-BUYER
    </h1>
  </div>
</template>

<script>
import { ref } from 'vue'; // Import ref from the Composition API

export default {
  name: 'ManageAllPage',
  components: {},
  setup() {
    // Use the setup function for data and methods
    const data = ref(); // Initialize your data using ref()

    const methods = {};

    return {
      data,
      ...methods,
    };
  },
};
</script>

<style>
  /* @import <--- import cac css buyer page */
</style>
