<script setup>
import ItemBox from '@/components/common-components/ItemBox.vue';
</script>
<template>
    <div class="bg-white my-3">
        <div class="container my-[20px] py-2">
            <div class="tt-block-title py-6">
				<h1 class="tt-title">POPULAR</h1>
				<div class="tt-description">CLOTHING BRANDS</div>
			</div>
            <div class="flex justify-around">
                <ItemBox product-name="Super long long long long name long long long long"/>
                <ItemBox product-name="Super long long long"/>
                <ItemBox product-name="Super long long long"/>
                <ItemBox product-name="Super long long long"/>
            </div>
        </div>
    </div>
</template>