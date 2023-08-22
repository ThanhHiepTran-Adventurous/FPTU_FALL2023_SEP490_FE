<template>
    <label :for="props.for" class="block mb-2 text-md font-medium text-black">
        <slot></slot>
    </label>
</template>
<script setup>
const props = defineProps({
    for: {
        type: String,
        required: true,
    },
})
</script>