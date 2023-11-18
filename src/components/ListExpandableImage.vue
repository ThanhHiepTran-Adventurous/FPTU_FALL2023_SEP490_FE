<script setup>
import ExpandableImageBox from "./ExpandableImageBox.vue";

const emit = defineEmits(['deleted'])
const props = defineProps({
    imgSrc: Array
})

</script>

<template>
    <div class="w-full overflow-x-auto">
      <div v-for="src in imgSrc" :key="src" class="inline-block mr-2 relative">
        <ExpandableImageBox :src="src" alt="product image" img-class="w-40 h-40 border-4 border-blue-500" />
      </div>
    </div>
</template>