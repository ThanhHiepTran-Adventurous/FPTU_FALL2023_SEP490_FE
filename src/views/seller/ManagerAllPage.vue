<template>
  <div>
    <LayoutHeader>
      <Navbar />
    </LayoutHeader>
    <div class="mt-[150px] md:mt-[70px] mb-[10px]">
      <LayoutContent>
        <ManagerProductHeader v-if="!route.path.includes('profile')" />
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
  import ManagerProductHeader from './ManagerProductHeader.vue';
  import { useRoute } from 'vue-router';

  const route = useRoute()


</script>
