<script setup>
import constant from '@/common/constant';
import Modal from '../common-components/Modal.vue';
import { OrderStatus } from '@/common/contract';
import formatCurrency from '@/utils/currency-output-formatter';
import moment from 'moment';
import OrderTimeline from '../OrderTimeline.vue';
import Button from '../common-components/Button.vue';
import { ref, computed, watch, onMounted } from 'vue';
import Dropdown from '../common-components/Dropdown.vue';
import { Icon } from "@iconify/vue";
import locationService from '@/services/location.service';

// for address update purpose
const districts = ref([])
const provinces = ref([])
const wards = ref([])
const selectedDistrict = ref({
  label: '',
  data: '',
})
const selectedProvince = ref({
  label: '',
  data: '',
})
const selectedWard = ref({
  label: '',
  data: '',
})

const isEditing = ref(false)

const curAddress = ref('')
const curPhone = ref('')

const props = defineProps(['detail', 'isUpdating', 'status', 'phone', 'address'])
const emit = defineEmits(["modal-declined", "update-status", "update-detail"])

const statusOrder = ref(OrderStatus.CONFIRM_DELIVERY.value)

watch(() => props.detail, () => {
    statusOrder.value = props.detail?.statusOrder
}, {deep: true})
watch(() => props.address, () => {
    curPhone.value = props.phone
})
watch(() => props.phone, () => {
    curAddress.value = props.address
})

watch(selectedProvince, async () => {
  const districtsFetch = await locationService.fetchAllDistrictOfProvinces(selectedProvince.value.data)
  districts.value = districtsFetch.data.map(p => {
    return {
      label: p.name,
      data: p.code,
    }
  })
})

watch(selectedDistrict, async () => {
  const wardFetch = await locationService.fetchAllWardOfDistrict(selectedDistrict.value.data)
  wards.value = wardFetch.data.map(p => {
    return {
      label: p.name,
      data: p.code,
    }
  })
})

onMounted(async () => {
    const provincesFetch = await locationService.fetchAllProvinces()
    provinces.value = provincesFetch.data.map(p => {
        return {
        label: p.name,
        data: p.code,
        }
    })
})

const onUpdateStatusClick = () => {
    if(confirm("Bạn có chắc chắn muốn chuyển trạng thái của đơn hàng sang trạng thái tiếp theo không?")){
        emit("update-status")
    }
}
const onUpdateDetailClick = () => {
    const messageData = {
        newPhone: curPhone.value,
        newAddress: `${curAddress.value}${selectedWard.value.value ? ',' + selectedWard.value.value : ''},${selectedDistrict.value.value ? ',' + selectedDistrict.value.value : ''},${selectedProvince.value.value ? ',' + selectedProvince.value.value : ''}`
    }
    emit("update-detail", messageData)
}

onMounted(() => {
    statusOrder.value = props.detail?.statusOrder
})

</script>
<template>
    <Modal :widthClass="'w-[900px]'" :hasOverFlowVertical=true :hasButton=true
        title="Chi tiết"
        @decline-modal="emit('modal-declined')" @confirm-modal="() => {}">
        <div class="bg-gray rounded-lg mx-1 my-1">
        <div class="relative mb-2 px-2">
            <div class="mx-auto container align-middle">
            <div class="text-xl font-bold ml-5 underline mb-2">Thông tin đơn hàng</div>
            <table class="w-full table-auto text-lg">
                <tbody>
                <tr>
                    <td
                    class="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">
                    Tên Sản Phẩm :
                    </td>
                    <td class="py-2 px-4 border-b border-grey-light">{{ detail?.productResponse.name }}</td>
                </tr>
                <tr>
                    <td
                    class="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">
                    Giá tiền :
                    </td>
                    <td class="py-2 px-4 border-b border-grey-light">{{ formatCurrency(detail?.price) }}</td>
                </tr>
                <tr>
                    <td
                    class="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light">
                    <div>Địa chỉ :</div>
                    </td>
                    <td v-if="!isEditing" class="py-2 px-4 flex justify-between">
                        <div>{{ detail?.buyerAddress ? detail.buyerAddress : 'N/A' }}</div>
                        <div class="w-10 h-10 rounded-[50%] bg-gray-200 p-1">
                            <Icon
                                icon="iconamoon:edit-duotone"
                                class="text-[26px] text-blue-500 hover:cursor-pointer hover:text-blue-600"
                                @click="isEditing = true" />
                        </div>
                    </td>
                    <div v-else class="w-full py-2 px-4">
                        <input
                        v-model="curAddress"
                        type="text"
                        class="bg-white w-full focus:bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block py-1 w-[63%]" />
                        <div class="flex flex-col w-[full] gap-3 mt-3">
                        <div class="flex flex-col items-left gap-1">
                            <div>Tỉnh / Thành phố:</div>
                            <Dropdown v-model="selectedProvince" :data="provinces" class="!w-[300px]" />
                        </div>
                        <div class="flex flex-col items-left gap-1">
                            <div>Quận / Huyện:</div>
                            <Dropdown v-model="selectedDistrict" :data="districts" class="!w-[300px]" />
                        </div>
                        <div class="flex flex-col items-left gap-1">
                            <div>Phường / Xã:</div>
                            <Dropdown v-model="selectedWard" :data="wards" class="!w-[300px]" />
                        </div>
                        </div>
                    </div>
                </tr>
                <tr>
                    <td
                    class="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">
                    Số điện thoại :
                    </td>
                    <td v-if="!isEditing" class="py-2 px-4 border-b border-grey-light">{{ detail?.buyerPhoneNumber ? detail.buyerPhoneNumber : 'N/A' }}</td>
                    <td class="py-2 px-4 border-b" v-else>
                        <input
                        v-model="curPhone"
                        type="text"
                        class="bg-white w-full focus:bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block py-1 w-[63%]" />
                    </td>
                </tr>
                <tr>
                    <td
                    class="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">
                    Tạo lúc :
                </td>
                <td class="py-2 px-4 border-b border-grey-light">{{ detail?.createAt ? moment.utc(detail?.createAt).format("DD/MM/YYYY HH:mm:ss") : 'N/A' }}</td>
                </tr>
                <tr>
                <td
                    class="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">
                    Cập nhật lúc :
                </td>
                <td class="py-2 px-4 border-b border-grey-light">{{ detail?.lastUpdatedAt ? moment.utc(detail?.lastUpdatedAt).format("DD/MM/YYYY HH:mm:ss") : 'N/A' }}</td>
                </tr>
                </tbody>
            </table>
            </div>
            <div class="mx-auto container align-middle mt-8">
            <div class="text-xl font-bold ml-5 underline mb-4">Trạng thái đơn hàng</div>
            <div class="ml-8">
                <OrderTimeline :curStatus="status" />
            </div>
            </div>
        </div>
        </div>
        <template #button>
        <div>
            <Button :type="constant.buttonTypes.OUTLINE" @on-click="emit('modal-declined')">
            Đóng
            </Button>
        </div>
        <div>
            <Button :disabled="isUpdating" @on-click="onUpdateDetailClick">
                <div class="flex items-center">
                    <div>Cập nhật thông tin đơn hàng</div>
                </div>
            </Button>
        </div>
        <div>
            <Button :disabled="isUpdating || status === OrderStatus.CONFIRM_DELIVERY.value || status === OrderStatus.DONE.value" @on-click="onUpdateStatusClick">
                <div class="flex items-center">
                    <div>Cập nhật trạng thái đơn hàng</div>
                </div>
            </Button>
        </div>
        </template>
    </Modal>
</template>