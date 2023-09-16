<template>
  <div>
    <LayoutHeader>
      <Navbar />
    </LayoutHeader>
    <div class="mt-[60px] mb-[10px]">
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
