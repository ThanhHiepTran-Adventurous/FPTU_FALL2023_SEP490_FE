<script setup>
import TopBarItem from '@/components/page-sections/TopBarItem.vue'
</script>
<template>
  <div class="py-2 mx-auto bg-white">
    <div class="flex w-full gap-8 justify-center items-center overflow-auto">
      <router-link to="/auctions"><TopBarItem text="Áo" icon="shirt" /></router-link>
      <router-link to="/auctions"><TopBarItem text="Quần" icon="pants" /></router-link>
      <router-link to="/auctions"><TopBarItem text="Phụ kiện" icon="accessory" /></router-link>
      <router-link to="/auctions"><TopBarItem text="Giày" icon="shoes" /></router-link>
      <router-link to="/auctions"><TopBarItem text="Top seller" icon="topSeller" /></router-link>
    </div>
  </div>
</template>
