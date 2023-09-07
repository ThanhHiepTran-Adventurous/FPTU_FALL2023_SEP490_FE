<script setup>
import TopBarItem from '@/components/page-sections/TopBarItem.vue';

</script>
<template>
    <div class="container py-2 rounded-lg">
        <div class="flex w-full justify-between gap-8 items-center">
            <TopBarItem text="Women" icon="grommet-icons:restroom-women" />
            <TopBarItem text="Men" icon="grommet-icons:restroom-men" />
            <TopBarItem text="Accessories" icon="streamline:shopping-bag-hand-bag-2-shopping-bag-purse-goods-item-products" />
            <TopBarItem text="Shoes" icon="game-icons:sonic-shoes" />
            <TopBarItem text="Voucher" icon="mdi:voucher" />
            <TopBarItem text="Top seller" icon="mdi:storm" />
        </div>
    </div>
</template>