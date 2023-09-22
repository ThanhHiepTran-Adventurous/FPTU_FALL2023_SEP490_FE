<script setup>
import TopBarItem from '@/components/page-sections/TopBarItem.vue';

</script>
<template>
    <div class="container py-2 rounded-lg">
        <div class="flex w-full justify-between gap-8 items-center overflow-auto">
            <TopBarItem text="Áo" icon="ion:shirt" />
            <TopBarItem text="Quần" icon="ph:pants-fill" />
            <TopBarItem text="Phụ kiện" icon="streamline:shopping-bag-hand-bag-2-shopping-bag-purse-goods-item-products" />
            <TopBarItem text="Giày" icon="game-icons:sonic-shoes" />
            <TopBarItem text="Top seller" icon="mdi:storm" />
        </div>
    </div>
</template>