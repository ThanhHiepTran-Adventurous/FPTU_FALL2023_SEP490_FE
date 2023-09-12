<script setup>
import { computed, ref, watch } from 'vue';
import OtpInput from 'vue3-otp-input';

const emit = defineEmits(['valueChange'])

const handleOnChange = (value) => {
    emit("valueChange", value)
};
const valueBind = ref('')

</script>
<template>
    <OtpInput
        :value="valueBind"
        input-classes="bg-[#F7F8FA] px-6 py-2 rounded-md !text-black w-16 mx-2"
        separator=""
        :num-inputs="6"
        :should-auto-focus="true"
        :is-input-num="true"
        @on-change="handleOnChange"
    />
</template>