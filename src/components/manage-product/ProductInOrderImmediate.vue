<script setup>
import { onMounted, ref, watch } from 'vue'
import SearchInput from '../common-components/SearchInput.vue'
import auctionService from '@/services/auction.service'
import Modal from '../common-components/Modal.vue'
import formatCurrency from '@/utils/currency-output-formatter'
import moment from 'moment'
import ItemSold from '../common-components/item-box/ItemSold.vue'
import imageHelper from '@/utils/image-helper'
import { AuctionModelType, OrderStatus } from '@/common/contract'
import { Icon } from '@iconify/vue'
import Dropdown from '../common-components/Dropdown.vue'
import Button from '@/components/common-components/Button.vue'
import constant from '@/common/constant'
import OrderService from '@/services/order.service'
import ItemOrder from '../common-components/item-box/ItemOrder.vue'
import OrderTimeline from '../OrderTimeline.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const orders = ref([])
const ordersFiltered = ref([])
const detail = ref(null)

const isModalVisible = ref(false)
const isUpdating = ref(false)

// Filter
const options = ref([
  {
    label: 'Tự trao đổi',
    value: AuctionModelType.immediate,
  },
  {
    label: 'Trung gian qua hệ thống',
    value: AuctionModelType.intermediate,
  },
])

const selected = ref({
  label: 'Tự trao đổi',
  value: AuctionModelType.immediate,
})
watch(selected, (newVal, oldVal) => {
  if(newVal.value === AuctionModelType.intermediate){
    router.push("/manage/orders/intermediate")
  }
})
const filterData = () => {
  ordersFiltered.value = orders.value
    .filter(v => v.modelTypeAuctionOfOrder === selected.value.value)
    .sort((a, b) => {
      return new Date(b.createAt).getTime() - new Date(a.createAt).getTime()
    })
}

// Update status
const updateOrderStatus = async () => {
  isUpdating.value = true
  await OrderService.updateStatus(detail.value.statusOrder, detail.value.id)
  closeModal()
  fetchOrders()
  isUpdating.value = false
}

// Page operations
const activateInfoAuction = order => {
  detail.value = order
  isModalVisible.value = true
}
function closeModal() {
  isModalVisible.value = false
}
function handleConfirm() {
  closeModal()
}

const fetchOrders = async () => {
  const response = await OrderService.getAllOrders('', 1, 1000, '')
  orders.value = response.data ? response.data : []
  filterData()
}

onMounted(() => {
  fetchOrders()
})
</script>

<template>
  <div class="container my-[20px] py-2 mx-auto bg-white rounded-md min-h-[80vh]">
    <div class="mb-4 mx-5 mt-4">
      <div class="mt-3 flex items-center gap-3">
        <Dropdown v-model="selected" :data="options" class="!w-[300px]" />
        <div class="w-full">
          <SearchInput placeholder="       Search a product" addOnInputClass="w-full" />
        </div>
      </div>
    </div>
    <div class="flex flex-wrap items-center mt-10 mx-5 gap-3 py-10">
      <ItemOrder
        v-for="item in ordersFiltered"
        :key="item.id"
        @click="activateInfoAuction(item)"
        :product-name="item.productResponse.name"
        :price="item.price"
        :mainImage="imageHelper.getPrimaryImageFromList(item.productResponse.imageUrls)"
        :secondaryImage="imageHelper.getSecondaryImageFromList(item.productResponse.imageUrls)"
        :auction-type="item.modelTypeAuctionOfOrder"
        :orderId="item.id"
        :chatGroupId="item.chatGroupDTOs.id"
        :created-at="item?.createAt ? moment.utc(item?.createAt).format('DD/MM/YYYY HH:mm:ss') : 'N/A'" />
    </div>
    <Modal
      :hidden="!isModalVisible"
      :widthClass="'w-[900px]'"
      :hasOverFlowVertical="true"
      :hasButton="true"
      title="Chi tiết"
      @decline-modal="closeModal"
      @confirm-modal="handleConfirm">
      <div class="flex-1 bg-gray rounded-lg mx-1 my-1">
        <div class="relative mx-2">
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
                  <td class="py-2 px-4 border-b border-grey-light">
                    {{ detail?.phoneNumber ? detail.phoneNumber : 'N/A' }}
                  </td>
                </tr>
                <tr>
                  <td
                    class="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">
                    Tạo lúc :
                  </td>
                  <td class="py-2 px-4 border-b border-grey-light">
                    {{ detail?.createAt ? moment.utc(detail?.createAt).format('DD/MM/YYYY HH:mm:ss') : 'N/A' }}
                  </td>
                </tr>
                <tr>
                  <td
                    class="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">
                    Cập nhật lúc :
                  </td>
                  <td class="py-2 px-4 border-b border-grey-light">
                    {{
                      detail?.lastUpdatedAt ? moment.utc(detail?.lastUpdatedAt).format('DD/MM/YYYY HH:mm:ss') : 'N/A'
                    }}
                  </td>
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
          Hủy
        </Button>
      </div>
      <div v-if="detail?.modelTypeAuctionOfOrder === AuctionModelType.immediate">
        <Button :disabled="isUpdating || detail?.statusOrder === OrderStatus.CONFIRM_DELIVERY.value || detail?.statusOrder === OrderStatus.DONE.value" @on-click="updateOrderStatus">
          <div class="flex items-center">
            <div>Cập nhật trạng thái đơn hàng</div>
          </div>
        </Button>
      </div>
      <div v-else>
        <Button :disabled="isUpdating || detail?.statusOrder === OrderStatus.CONFIRM_DELIVERY.value || detail?.statusOrder === OrderStatus.DONE.value" @on-click="updateOrderStatus">
          <div class="flex items-center">
            <div>Yêu cầu rút tiền</div>
          </div>
        </Button>
      </div>
      <div>
          <Button v-if="detail?.modelTypeAuctionOfOrder !== AuctionModelType.immediate"
            :disabled="isUpdating || detail?.statusOrder === OrderStatus.CONFIRM_DELIVERY.value"
            >
            <div class="flex items-center">
              <div>Tạo yêu cầu giao hàng</div>
            </div>
          </Button>
        </div>
        <div v-if="detail?.modelTypeAuctionOfOrder === AuctionModelType.immediate">
          <router-link :to="`/messenger/${detail?.chatGroupDTOs.id}`">
            <Button>
              <div class="flex items-center">
                <Icon icon="uiw:message" class="text-[18px] mr-3" />
                <div>Nhắn tin</div>
              </div>
            </Button>
          </router-link>
        </div>
      </template>
    </Modal>
  </div>
</template>
