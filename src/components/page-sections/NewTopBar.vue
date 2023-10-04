<script setup>
import TopBarItem from '@/components/page-sections/TopBarItem.vue';

</script>
<template>
    <div class="container py-2 rounded-lg mx-auto">
        <div class="flex w-full justify-between gap-8 items-center overflow-auto">
            <router-link to="/auctions"><TopBarItem text="Áo" icon="ion:shirt" /></router-link>
            <router-link to="/auctions"><TopBarItem text="Quần" icon="ph:pants-fill" /></router-link>
            <router-link to="/auctions"><TopBarItem text="Phụ kiện" icon="streamline:shopping-bag-hand-bag-2-shopping-bag-purse-goods-item-products" /></router-link>
            <router-link to="/auctions"><TopBarItem text="Giày" icon="game-icons:sonic-shoes" /></router-link>
            <router-link to="/auctions"><TopBarItem text="Top seller" icon="mdi:storm" /></router-link>
        </div>
    </div>
</template>