<script setup>
import constant from '@/common/constant';
import Modal from '../common-components/Modal.vue';
import { OrderStatus } from '@/common/contract';
import formatCurrency from '@/utils/currency-output-formatter';
import moment from 'moment';
import OrderTimeline from '../OrderTimeline.vue';
import Button from '../common-components/Button.vue';
import { ref, computed, watch, onMounted } from 'vue';

const props = defineProps(['detail', 'isUpdating', 'status'])
const emit = defineEmits(["modal-declined", "confirm-shipped"])

const statusOrder = ref(OrderStatus.CONFIRM_DELIVERY.value)
watch(() => props.detail, () => {
    statusOrder.value = props.detail?.statusOrder
}, {deep: true})

const onShippedClick = () => {
    if (confirm("Bạn có chắc chắn xác nhận đơn hàng đã giao tới bạn không?") == true){
        emit('confirm-shipped')
    }
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
                    class="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">
                    Địa chỉ :
                    </td>
                    <td class="py-2 px-4 border-b border-grey-light">{{ detail?.address ? detail.address : 'N/A' }}</td>
                </tr>
                <tr>
                    <td
                    class="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">
                    Số điện thoại :
                    </td>
                    <td class="py-2 px-4 border-b border-grey-light">{{ detail?.phoneNumber ? detail.phoneNumber : 'N/A' }}</td>
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
        <Button :disabled="isUpdating || status !== OrderStatus.CONFIRM_DELIVERY.value" @on-click="onShippedClick">
            <div class="flex items-center">
            <div>Đã nhận hàng</div>
            </div>
        </Button>
        </div>
        </template>
    </Modal>
</template>