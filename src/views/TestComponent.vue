<script setup>
import Modal from '@/components/common-components/Modal.vue';
import Input from '@/components/common-components/Input.vue';
import Label from '../components/common-components/Label.vue';
import { Icon } from '@iconify/vue';
import Countdown from '@/components/common-components/Countdown.vue';

import { ref } from 'vue';

const isModalActive = ref(true)
const inputVal = ref('')

</script>

<template>
  <div>
    <Modal v-if="isModalActive" title="Test Modal" @decline-modal="() => isModalActive = false">
      <div>
        <Label for="test">Label test</Label>
        <Input v-model="inputVal" w="w-full" id="test" /> {{ inputVal }}
        <Icon icon="mdi-light:home" />
        <Countdown :coefficientSize="0.5" :deadlineInMilis="1693895388011" />
      </div>
    </Modal>
    <div class="h-[1000px]"></div>
  </div>
</template>
