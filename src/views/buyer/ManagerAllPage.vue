<template>
  <div>
    <LayoutHeader>
      <!-- <LandingHeader /> -->
      <Navbar />
      <div class="mt-[70px] mb-[10px]">
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
  import Navbar from '@/components/page-sections/Navbar.vue';
  import NewTopBar from '@/components/page-sections/NewTopBar.vue';
  import LayoutContent from '@/layouts/LayoutContent.vue';
  import LayoutHeader from '@/layouts/LayoutHeader.vue';
  import LayoutFooter from '@/layouts/LayoutFooter.vue';
</script>
