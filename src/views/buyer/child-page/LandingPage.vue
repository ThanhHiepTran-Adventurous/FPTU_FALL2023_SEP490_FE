<script setup>
    import BrandSection from '@/components/page-sections/landing-page/BrandSection.vue';
    import PosterSection from '@/components/page-sections/landing-page/PosterSection.vue';
    import OutstandingItem from '@/components/page-sections/landing-page/OutstandingItem.vue';
    import NewTopBar from '@/components/page-sections/NewTopBar.vue';
</script>
<template>
    <div>
        <div class="mb-[10px]">
            <NewTopBar />
        </div>
        <PosterSection />
        <BrandSection />
        <OutstandingItem />
    </div>
</template>