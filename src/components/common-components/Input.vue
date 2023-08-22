<template>
    <div>
        <input :id="props.id" v-model="value" :type="props.type"
            class="bg-white focus:bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
            :class="props.w" :placeholder="props.placeholder" :disabled="isReadonly" :name="props.name" />
    </div>
</template>
<script setup>
import constants from '@/common/constant'
import { computed } from 'vue'

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
    type: {
        type: String,
        default: constants.inputTypes.TEXT,
    },
    placeholder: {
        type: String,
        default: '',
    },
    modelValue: {
        type: String,
        default: '',
    },
    w: {
        type: String,
        default: 'w-[219px]',
    },
    isReadonly: {
        type: Boolean,
        default: false,
    },
    id: {
        type: String,
        default: '',
    },
    name: {
        type: String,
        default: '',
    },
})
const value = computed({
    get() {
        return props.modelValue
    },
    set(value) {
        emit('update:modelValue', value)
    },
})
</script>  