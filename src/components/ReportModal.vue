<script setup>
import { base64Image } from '@/utils/imageFile';
import Modal from './common-components/Modal.vue';
import Button from './common-components/Button.vue';
import { Icon } from '@iconify/vue'
import { ref } from 'vue';

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

</script>

<template>
    <Modal :widthClass="'w-[900px]'" :hasOverFlowVertical=true :hasButton="true" title="Tố cáo"
        @decline-modal="onModalDecline()" @confirm-modal="onModalDecline()">
        <div class="form mb-4">
            <div class="flex flex-col text-sm">
                <button @click="() => $refs.file.click()" @click.prevent
                    class="flex items-center bg-white hover:!bg-gray-200 gap-3 w-[180px] justify-center text-gray-800 px-4 py-2 rounded text-sm border-[1px] border-blue-500">
                    <Icon icon="tdesign:upload" />
                    <span>Upload image</span>
                </button>
                <input type="file" hidden v-on:change="handleFileUpload($event)" ref="file" />
            </div>
            <div class="mt-4 w-full overflow-x-auto" v-if="imgSrc.length > 0">
                <div v-for="src in imgSrc" :key="src" class="inline-block mr-2">
                    <img :src="src" alt="product image" class="w-40 h-40 border-4 border-blue-500" />
                </div>
            </div>

            <div class="text-sm flex flex-col">
                <label for="description" class="font-bold mt-4 mb-2">Nội dung tố cáo</label>
                <textarea
                    v-model="reportText"
                    class=" appearance-none w-full border border-gray-200 p-2 h-40 focus:outline-none focus:border-gray-500"
                    placeholder="Enter your description"></textarea>
            </div>
        </div>
        <template #button>
            <div>
                <button
                    @click="onModalConfirm()"
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
    </Modal>
</template>