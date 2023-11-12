<script setup>
import { ref } from 'vue';
import ImageExtendModal from './ImageExtendModal.vue';

const isExtendModalShow = ref(false)

const props = defineProps({
    src: String,
    alt: String,
    imgClass: String
})
</script>

<template>
    <img :src="src" :alt="alt" :class="imgClass" @click="isExtendModalShow=true"/>
    <ImageExtendModal :src="src" :alt="alt" @decline-modal="isExtendModalShow=false" v-if="isExtendModalShow" />
</template>