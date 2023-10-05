<script setup>
import { Dropdown, ListGroup, ListGroupItem } from 'flowbite-vue'
import { computed } from 'vue'
import { Icon } from '@iconify/vue';

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
    data: {
        type: Array,
        required: true,
    },
    modelValue: {
        type: Object,
        default: undefined,
    },
    class: {
      type: String,
      default: "",
    }
})
const selectedObject = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})
</script>
<template>
  <dropdown text="Bottom">
    <template #trigger>
        <div class="flex items-center">
            <div class="grid grid-cols-2 justify-items-stretch bg-[#F7F8FA] px-6 py-2 rounded-md !text-black" :class="props.class">
                <div class="w-max">{{ selectedObject?.label }}</div>
                <div class="justify-self-end self-center"><Icon icon="gridicons:dropdown" class="text-[14px]" /></div>
            </div>
        </div>
    </template>
    <list-group class="cursor-pointer w-min max-h-48 overflow-y-auto" :class="props.class">
      <list-group-item
            v-for="item in props.data"
            :key="item.data"
            :class="selectedObject?.data === item.data ? `bg-blue-50 font-bold ${props.class}` : props.class"
            class="py-1 hover:bg-blue-50"
            @click="() => selectedObject = item"
        >
        {{ item.label }}
      </list-group-item>
    </list-group>
  </dropdown>
</template>