<template>
  <div>
    <div class="relative w-full">
      <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <transition name="icon">
          <svg
            v-if="showIcon"
            aria-hidden="true"
            class="w-5 h-5 text-neutral-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </transition>
      </div>
      <input
        :id="props.id"
        v-model="searchValue"
        type="search"
        class="block w-[219px] px-4 py-[11px] pl-10 focus:pl-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:bg-gray-50 focus:ring-primary focus:border-primary"
        :class="props.addOnInputClass"
        :placeholder="placeholderValue"
        @focus="hideIcon()"
        @focusout="show()" />
    </div>
  </div>
</template>

<script setup>
import {computed, ref} from "vue"

const emit = defineEmits(['update:modelValue'])
const props = defineProps({
  type: {
    type: String,
    default: 'text',
  },
  placeholder: {
    type: String,
    default: '',
  },
  modelValue: {
    type: String,
    default: '',
  },
  id: {
    type: String,
    default: '',
  },
  addOnInputClass: {
    type: String,
    default: '',
  },
})
const searchValue = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})
const placeholderValue = ref(props.placeholder)
const showIcon = ref(true)
const hideIcon = () => {
  showIcon.value = false
  placeholderValue.value = ''
}
const show = () => {
  showIcon.value = true
  placeholderValue.value = props.placeholder
}
</script>
<style>
.icon-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}
.icon-enter-active {
  transition: all 0.2s ease-out;
}
.icon-leave-to,
.icon-enter-from {
  transform: translateX(-20px);
  opacity: 0;
}
</style>
