<template>
  <div>
    <LayoutHeader>
      <LandingHeader />
    </LayoutHeader>
    <!-- <LayoutBreadcrumb /> -->
    <LayoutContent>
      <router-view />
    </LayoutContent>
    <LayoutFooter />
  </div>
</template>

<script setup>
  import LandingHeader from '@/components/page-sections/LandingHeader.vue';
  import LayoutContent from '@/layouts/LayoutContent.vue';
  import LayoutHeader from '@/layouts/LayoutHeader.vue';
  import LayoutFooter from '@/layouts/LayoutFooter.vue';
  // import LayoutBreadcrumb from '@/layouts/LayoutBreadcrumb.vue';
</script>
