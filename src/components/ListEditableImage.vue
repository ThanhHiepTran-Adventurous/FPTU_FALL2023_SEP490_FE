<script setup>
import { Icon } from "@iconify/vue"
import ExpandableImageBox from "./ExpandableImageBox.vue";

const emit = defineEmits(['deleted'])
const props = defineProps({
    imgSrc: Array
})

const onDeleteClick = (event, indx) => {
  event.stopPropagation()
  emit('deleted', indx)
}

</script>

<template>
    <div class="w-full overflow-x-auto">
      <div v-for="(src, indx) in imgSrc" :key="src" class="inline-block mr-2 relative">
        <ExpandableImageBox :src="src" alt="product image" img-class="w-40 h-40 border-4 border-blue-500" />
        <button class="absolute top-0 right-0" @click="onDeleteClick($event, indx)">
            <Icon icon="carbon:close-filled" class="text-red-600" />
        </button>
      </div>
    </div>
</template>