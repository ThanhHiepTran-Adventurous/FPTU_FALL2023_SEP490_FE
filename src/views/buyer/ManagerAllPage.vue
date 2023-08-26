<template>
  <div>
    <LayoutHeader>
      <LandingHeader />
    </LayoutHeader>
    <LayoutBreadcrumb />
    <LayoutContent>
      <router-view />
    </LayoutContent>
  </div>
</template>

<script>
import { ref } from 'vue'; // Import ref from the Composition API

import LandingHeader from '@/components/page-sections/LandingHeader.vue';
import LayoutContent from '../../layouts/LayoutContent.vue';
import LayoutHeader from '../../layouts/LayoutHeader.vue';
import LayoutBreadcrumb from '../../layouts/LayoutBreadcrumb.vue';


export default {
  name: 'ManageAllPage',
  components: {
    LandingHeader,
    LayoutContent,
    LayoutHeader,
    LayoutBreadcrumb,
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
