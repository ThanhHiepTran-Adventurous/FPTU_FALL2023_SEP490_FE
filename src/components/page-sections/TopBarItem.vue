<script setup>
import { Icon } from '@iconify/vue';

const props = defineProps({
    icon: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    }
})
</script>

<template>
    <div class="group flex flex-col justify-center items-center w-[50px] rounded-md px-12 py-2 my-2 hover:bg-blue-500">
        <slot name="">
            <Icon :icon="props.icon" class="text-[44px] group-hover:text-white"/>
        </slot>
        <div class="pt-2 text-black group-hover:text-white text-[16px] w-max">{{ text }}</div>
    </div>
</template>