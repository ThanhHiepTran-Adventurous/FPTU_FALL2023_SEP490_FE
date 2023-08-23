<template>
  <div class="page">
    <LandingHeader />
    <router-view></router-view>
    <h1>
      FOOTER-BUYER
    </h1>
  </div>
</template>

<script>
import { ref } from 'vue'; // Import ref from the Composition API

import { defineAsyncComponent } from 'vue';

const LandingHeader = defineAsyncComponent(() => import('@/components/page-sections/LandingHeader.vue'))


export default {
  name: 'ManageAllPage',
  components: {
    LandingHeader,
  },
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
