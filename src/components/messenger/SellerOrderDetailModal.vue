<script setup>
import Modal from '../common-components/Modal.vue';
</script>
<template>
    <Modal :hidden="!isModalVisible" :widthClass="'w-[900px]'" :hasOverFlowVertical=true :hasButton=true
        title="Chi tiết"
        @decline-modal="closeModal" @confirm-modal="handleConfirm">
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
                <OrderTimeline :curStatus="detail?.statusOrder" />
            </div>
            </div>
        </div>
        </div>
        <template #button>
        <div>
            <Button :type="constant.buttonTypes.OUTLINE" @on-click="closeModal">
            Đóng
            </Button>
        </div>
        <div>
          <Button :disabled="isUpdating || detail?.statusOrder !== OrderStatus.CONFIRM_DELIVERY.value" @on-click="updateOrderStatus">
            <div class="flex items-center">
              <div>Đã nhận hàng</div>
            </div>
          </Button>
        </div>
        </template>
        </Modal>
</template>