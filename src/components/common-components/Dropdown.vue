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
                <div class="w-max">{{ selectedObject.label }}</div>
                <div class="justify-self-end self-center"><Icon icon="gridicons:dropdown" class="text-[14px]" /></div>
            </div>
        </div>
    </template>
    <list-group class="cursor-pointer w-min max-h-48 overflow-y-auto" :class="props.class">
      <list-group-item
            v-for="item in props.data"
            :key="item.data"
            :class="selectedObject.data === item.data ? `bg-blue-50 font-bold ${props.class}` : props.class"
            class="py-1 hover:bg-blue-50"
            @click="() => selectedObject = item"
        >
        <!-- <template #prefix>
          <svg class="w-4 h-4 fill-current" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clip-rule="evenodd"></path></svg>
        </template> -->
        {{ item.label }}
      </list-group-item>
    </list-group>
  </dropdown>
</template>