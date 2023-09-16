<script setup>
import { Icon } from '@iconify/vue';
import { ref } from 'vue';
import { base64Image } from  '@/utils/imageFile'

//------------------------------------------------------------
const profileModel = ref({
    name: "",
    birthday: "",
    createdAt: "",
    phone: "",
    email: "",
    address: "",
})

const fileFront = ref(undefined)
const fileBack = ref(undefined)

const backImgSrc = ref('')
const frontImgSrc = ref('')

const handleFileFrontUpload = async (e) => {
    fileFront.value = e.target.files[0]
    frontImgSrc.value = await base64Image(fileFront.value)
}

const handleFileBackUpload = async (e) => {
    fileBack.value = e.target.files[0]
    backImgSrc.value = await base64Image(fileBack.value)
}

</script>
<template>
    <div class="h-full bg-gray-200 p-8">
        <div class="bg-white rounded-lg shadow-xl pb-8">
            <div class="w-full h-[250px]">
                <img src="https://vojislavd.com/ta-template-demo/assets/img/profile-background.jpg"
                    class="w-full h-full rounded-tl-lg rounded-tr-lg">
            </div>
            <div class="flex flex-col items-center -mt-20">
                <img src="https://vojislavd.com/ta-template-demo/assets/img/profile.jpg"
                    class="w-40 border-4 border-white rounded-full">
                <button
                    class="flex items-center bg-blue-600 hover:bg-blue-700 text-gray-100 mt-3 px-4 py-2 rounded text-sm space-x-2 transition duration-100">
                    <Icon icon="tdesign:upload" />
                    <span>Upload image</span>
                </button>
                <div class="flex items-center space-x-2">
                    <p class="text-2xl">Amanda Ross</p>
                    <span class="bg-blue-500 rounded-full p-1" title="Verified">
                        <svg xmlns="http://www.w3.org/2000/svg" class="text-gray-100 h-2.5 w-2.5" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </span>
                </div>
                <p class="text-sm text-gray-500">New York, USA</p>
            </div>
        </div>

        <div class="my-4 flex flex-col 2xl:flex-row space-y-4 2xl:space-y-0 2xl:space-x-4">
            <div class="w-full flex flex-col 2xl:w-1/3">
                <div class="flex-1 bg-white rounded-lg shadow-xl p-8">
                    <h4 class="text-xl text-gray-900 font-bold">Thông tin cá nhân</h4>
                    <ul class="mt-2 text-gray-700">
                        <li class="flex border-y py-2">
                            <span class="font-bold w-28">Tên:</span>
                            <span class="text-gray-700">Amanda S. Ross</span>
                        </li>
                        <li class="flex border-b py-2">
                            <span class="font-bold w-28">Ngày sinh:</span>
                            <span class="text-gray-700">24 Jul, 1991</span>
                        </li>
                        <li class="flex border-b py-2">
                            <span class="font-bold w-28">Tạo ngày:</span>
                            <span class="text-gray-700">10 Jan 2022 (25 days ago)</span>
                        </li>
                        <li class="flex border-b py-2">
                            <span class="font-bold w-28">Điện thoại:</span>
                            <span class="text-gray-700">(123) 123-1234</span>
                        </li>
                        <li class="flex border-b py-2">
                            <span class="font-bold w-28">Email:</span>
                            <span class="text-gray-700">amandaross@example.com</span>
                        </li>
                        <li class="flex border-b py-2">
                            <span class="font-bold w-28">Địa chỉ:</span>
                            <span class="text-gray-700">New York, US</span>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="flex flex-col w-full 2xl:w-2/3">
                <div class="flex-1 bg-white rounded-lg shadow-xl p-8">
                    <div class="flex items-center justify-between">
                        <div class="text-xl text-gray-900 font-bold">Căn cước công dân</div>
                        <div class="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">Đã phê duyệt</div>
                        <div class="bg-red-100 text-red-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">Chưa phê duyệt</div>
                    </div>
                    <div class="flex items-center flex-col md:flex-row gap-4">
                        <div class="w-full md:w-[50%] flex justify-center">
                            <article aria-label="File Upload Modal"
                                class="relative w-[464px] h-[256px] flex flex-col bg-white shadow-xl rounded-md overflow-hidden"
                            >
                            <input type="file" hidden v-on:change="handleFileFrontUpload($event)" ref="fileFront" />
                            <section v-if="!frontImgSrc" class="overflow-auto p-8 w-full h-full flex flex-col">
                                <header
                                    class="border-dashed border-2 border-gray-400 py-12 flex flex-col justify-center items-center">
                                    <p class="mb-3 font-semibold text-gray-900 flex flex-wrap justify-center">
                                        <span>Tải lên <span class="text-red-500">mặt trước</span> căn cước</span>
                                    </p>
                                    <input id="hidden-input" type="file" multiple class="hidden" />
                                    <button @click="$refs.fileFront.click()"
                                        class="mt-2 rounded-sm px-3 py-1 bg-gray-200 hover:bg-gray-300 focus:shadow-outline focus:outline-none">
                                        Tải lên
                                    </button>
                                </header>
                            </section>
                            <div v-else class="w-full h-full" @click="$refs.fileFront.click()">
                                <img :src="frontImgSrc" alt="mặt trước"/>
                            </div>
                            </article>
                        </div>
                        <div class="w-full md:w-[50%] flex justify-center">
                            <article aria-label="File Upload Modal"
                                class="relative w-[464px] h-[256px] flex flex-col bg-white shadow-xl rounded-md overflow-hidden"
                            >
                                <input type="file" hidden v-on:change="handleFileBackUpload($event)" ref="fileBack" />
                                <section v-if="!backImgSrc" class="overflow-auto p-8 w-full h-full flex flex-col">
                                    <header
                                        class="border-dashed border-2 border-gray-400 py-12 flex flex-col justify-center items-center">
                                        <p class="mb-3 font-semibold text-gray-900 flex flex-wrap justify-center">
                                            <span>Tải lên <span class="text-red-500">mặt sau</span> căn cước</span>
                                        </p>
                                        <input id="hidden-input" type="file" multiple class="hidden" />
                                        <button @click="$refs.fileBack.click()"
                                            class="mt-2 rounded-sm px-3 py-1 bg-gray-200 hover:bg-gray-300 focus:shadow-outline focus:outline-none">
                                            Tải lên
                                        </button>
                                    </header>
                                </section>
                                <div v-else class="w-full h-full" @click="$refs.fileBack.click()">
                                    <img :src="backImgSrc" alt="Mặt sau"/>
                                </div>
                            </article>
                        </div>
                    </div>
                    <div class="w-full text-center flex justify-center mt-3">
                        <button
                            class="flex items-center bg-blue-600 hover:bg-blue-700 text-gray-100 mt-3 px-4 py-2 rounded text-sm space-x-2 transition duration-100">
                            <Icon icon="tdesign:upload" />
                            <span>Gửi yêu cầu kiểm tra căn cước</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>