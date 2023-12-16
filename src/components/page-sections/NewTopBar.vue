<script setup>
import TopBarItem from '@/components/page-sections/TopBarItem.vue'
</script>
<template>
  <div class="py-2 mx-auto bg-white">
    <div class="flex w-full gap-8 justify-center items-center overflow-auto">
      <router-link to="/auctions?category=9290b770-4263-11ee-b20e-9828a648e145"><TopBarItem text="Áo" icon="shirt" /></router-link>
      <router-link to="/auctions?category=c7a589c1-9b32-11ee-871a-8685dbe3cd15"><TopBarItem text="Quần" icon="pants" /></router-link>
      <router-link to="/auctions?category=c7a42652-9b32-11ee-871a-8685dbe3cd15"><TopBarItem text="Phụ kiện" icon="accessory" /></router-link>
      <router-link to="/auctions?category=9290b770-4263-11ee-b20e-9828a648e145"><TopBarItem text="Giày" icon="shoes" /></router-link>
      <router-link to="/auctions/outstanding"><TopBarItem text="Nổi bật" icon="topSeller" /></router-link>
    </div>
  </div>
</template>
