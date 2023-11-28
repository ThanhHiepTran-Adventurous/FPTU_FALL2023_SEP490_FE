<script setup>
import TopBarItem from '@/components/page-sections/TopBarItem.vue'
</script>
<template>
  <div class="py-2 mx-auto bg-white">
    <div class="flex w-full gap-8 justify-center items-center overflow-auto">
      <router-link to="/auctions?category=3974f109-8dce-11ee-871a-8685dbe3cd15"><TopBarItem text="Áo" icon="shirt" /></router-link>
      <router-link to="/auctions?category=397507e6-8dce-11ee-871a-8685dbe3cd15"><TopBarItem text="Quần" icon="pants" /></router-link>
      <router-link to="/auctions?category=9de51024-8c73-11ee-871a-8685dbe3cd15"><TopBarItem text="Phụ kiện" icon="accessory" /></router-link>
      <router-link to="/auctions?category=39750af7-8dce-11ee-871a-8685dbe3cd15"><TopBarItem text="Giày" icon="shoes" /></router-link>
      <router-link to="/auctions"><TopBarItem text="Nổi bật" icon="topSeller" /></router-link>
    </div>
  </div>
</template>
