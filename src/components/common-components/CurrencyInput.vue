<template>
  <div class="relative">
    <input
      :id="props.id"
      v-model="value"
      :name="props.name"
      class="bg-white focus:bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 w-full h-10 py-1 pl-6"
      :class="props.w"
      :placeholder="props.placeholder"
      @keypress="onKeyPressed($event)" />
    <div class="w-8 h-10 absolute right-0 top-0 font-bold rounded-r-md px-2.5 py-2 bg-blue-200" :class="props.dollarClass">đ</div>
  </div>
</template>
<script setup>
import currencyFormatter from '@/common/currencyFormatter'
import { computed } from 'vue'

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  placeholder: {
    type: String,
    default: '',
  },
  modelValue: {
    type: [String, Number],
    default: '',
  },
  w: {
    type: String,
    default: 'w-[219px]',
  },
  id: {
    type: String,
    default: '',
  },
  name: {
    type: String,
    default: '',
  },
  dollarClass: {
    type: String,
    default: '',
  },
})
const value = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    const newValue = value.replaceAll(',', '')
    const splittedValue = newValue.split('.')
    if (splittedValue.length > 1) {
      const stringValue = currencyFormatter.fromNumberToStyledString(splittedValue[0])
      emit('update:modelValue', `${stringValue}.${splittedValue[1]}`)
    } else {
      const stringValue = currencyFormatter.fromNumberToStyledString(newValue)
      emit('update:modelValue', stringValue)
    }
  },
})

const onKeyPressed = e => {
  const charInp = String.fromCharCode(e.which)
  const acceptedChar = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', ',']
  //console.log(value.value)
  if (!acceptedChar.includes(charInp) || (value.value.toString().includes('.') && charInp === '.')) {
    e.preventDefault()
  }
}
</script>
