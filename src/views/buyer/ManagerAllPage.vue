<template>
  <div>
    <LayoutHeader>
      <!-- <LandingHeader /> -->
      <Navbar />
      <div class="mt-[60px]">
        <!-- <Topbar /> -->
        <NewTopBar />
      </div>
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
  import Navbar from '../../components/page-sections/Navbar.vue';
  import Topbar from '../../components/page-sections/Topbar.vue';
  import NewTopBar from '@/components/page-sections/NewTopBar.vue';
  import LayoutContent from '@/layouts/LayoutContent.vue';
  import LayoutHeader from '@/layouts/LayoutHeader.vue';
  import LayoutFooter from '@/layouts/LayoutFooter.vue';
  // import LayoutBreadcrumb from '@/layouts/LayoutBreadcrumb.vue';
</script>
