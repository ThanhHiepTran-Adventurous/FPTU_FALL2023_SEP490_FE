<script setup>
import { base64Image } from '@/utils/imageFile'
import OuterModal from './common-components/OuterModal.vue'
import Button from './common-components/Button.vue'
import { Icon } from '@iconify/vue'
import { ref } from 'vue'
import ListEditableImage from '@/components/ListEditableImage.vue'

const imgData = ref([])
const imgSrc = ref([])
const reportText = ref('')

const emit = defineEmits(['confirm', 'decline'])

const onModalDecline = () => {
  emit('decline')
}
const onModalConfirm = () => {
  emit('confirm', imgData.value, reportText.value)
}

const handleFileUpload = async e => {
  imgData.value.push(e.target.files[0])
  imgSrc.value.push(await base64Image(e.target.files[0]))
}
const handleImageDeleted = (indx) => {
  imgData.value.splice(indx, 1)
  imgSrc.value.splice(indx, 1)
}

</script>

<template>
  <OuterModal
    :widthClass="'w-[900px]'"
    :hasOverFlowVertical="true"
    :hasButton="true"
    title="Tố cáo"
    @decline-modal="onModalDecline()"
    @confirm-modal="onModalDecline()">
    <div class="form mb-4">
      <div class="flex flex-col text-sm">
        <button
          @click="() => $refs.file.click()"
          @click.prevent
          class="flex items-center bg-white hover:!bg-gray-200 gap-3 w-[180px] justify-center text-gray-800 px-4 py-2 rounded text-sm border-[1px] border-blue-500">
          <Icon icon="tdesign:upload" />
          <span>Upload image</span>
        </button>
        <input type="file" hidden v-on:change="handleFileUpload($event)" ref="file" />
      </div>

      <div v-if="imgSrc.length > 0" class="mt-3">
        <ListEditableImage :img-src="imgSrc" @deleted="handleImageDeleted" />
      </div>

      <div class="text-sm flex flex-col">
        <label for="description" class="font-bold mt-4 mb-2">Nội dung tố cáo</label>
        <textarea
          v-model="reportText"
          class="appearance-none w-full border border-gray-200 p-2 h-40 focus:outline-none focus:border-gray-500"
          placeholder="Enter your description"></textarea>
      </div>
    </div>
    <template #button>
      <div>
        <button
          @click="onModalDecline()"
          class="bg-white hover:!bg-blue-200 text-black font-bold py-2 px-4 rounded border focus:outline-none focus:shadow-outline"
          type="button">
          Đóng
        </button>
      </div>
      <div>
        <button
          @click="onModalConfirm()"
          class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded border focus:outline-none focus:shadow-outline"
          type="button">
          Tố cáo
        </button>
      </div>
    </template>
  </OuterModal>
</template>
