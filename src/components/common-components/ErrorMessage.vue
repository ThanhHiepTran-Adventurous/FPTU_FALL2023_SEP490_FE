<script setup>
const props = defineProps(['text'])
</script>
<template>
    <div class="ml-1.5 text-red-500 mt-1.5">
        {{ text }}
    </div>
</template>