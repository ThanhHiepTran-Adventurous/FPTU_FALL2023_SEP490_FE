<template>
  <div>
    <LayoutHeader>
      <Navbar />
    </LayoutHeader>
    <!-- To prevent margin collapsing -->
    <div class="mt-[150px] md:mt-[60px] float-left"></div>
    <div class="clear-both"></div>
    <div class="mb-[10px]">
      <LayoutContent>
        <router-view />
      </LayoutContent>
    </div>
    <LayoutFooter />
  </div>
</template>

<script setup>
  import Navbar from '@/components/page-sections/Navbar.vue';
  import LayoutContent from '@/layouts/LayoutContent.vue';
  import LayoutHeader from '@/layouts/LayoutHeader.vue';
  import LayoutFooter from '@/layouts/LayoutFooter.vue';
</script>
