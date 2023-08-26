<template>
  <div>
    <LandingHeader />
    <router-view />
  </div>
</template>

<script>
import { ref } from 'vue'; // Import ref from the Composition API

import LandingHeader from '../../components/page-sections/LandingHeader.vue';


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
