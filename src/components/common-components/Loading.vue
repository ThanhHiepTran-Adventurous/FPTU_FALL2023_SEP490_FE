<script setup>
import { ref } from 'vue';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';

const isLoading = ref(true)
const isFullPage = ref(false)

</script>
<template>
    <div class="w-full flex justify-center">
        <div class="relative h-[20vh] w-[50vw]">
            <Loading v-model:active="isLoading" :is-full-page="isFullPage"/>
        </div>
    </div>
</template>