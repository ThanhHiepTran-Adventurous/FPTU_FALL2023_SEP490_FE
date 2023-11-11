<script setup>
import { onMounted, ref, watch } from 'vue'
import SearchInput from '@/components/common-components/SearchInput.vue'
import Modal from '@/components/common-components/Modal.vue'
import formatCurrency from '@/utils/currency-output-formatter'
import moment from 'moment'
import imageHelper from '@/utils/image-helper'
import { AuctionModelType, OrderStatus } from '@/common/contract'
import { Icon } from '@iconify/vue'
import Dropdown from '@/components/common-components/Dropdown.vue'
import Button from '@/components/common-components/Button.vue'
import constant, { buyerTabs } from '@/common/constant'
import OrderService from '@/services/order.service'
import ItemOrder from '@/components/common-components/item-box/ItemOrder.vue'
import OrderTimeline from '@/components/OrderTimeline.vue'
import Breadcrumb from '@/layouts/Breadcrumb.vue'
import BoughtNav from '../BoughtNav.vue'
import SideBarLayout from '../SideBarLayout.vue'

const orders = ref([])
const ordersFiltered = ref([])
const detail = ref(null)

const isModalVisible = ref(false)
const isUpdating = ref(false)
const breadcrumbItems = [
  {
    text: 'Trang chủ',
    to: '/',
    disabled: false,
  },
  {
    text: 'Đã mua',
    to: '/orders',
    disabled: true,
  },
]
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
watch(selected, newVal => {
  filterData()
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
  <div class="w-full">
    <div class="mt-3 mb-3 container mx-auto">
      <Breadcrumb :items="breadcrumbItems" />
    </div>
    <BoughtNav :cur-tab="buyerTabs.order.value" />
    <div class="bg-white container mx-auto rounded-md">
      <div class="mx-5 mt-4">
        <div class="pt-3 flex items-center gap-3">
          <Dropdown v-model="selected" :data="options" class="!w-[300px]" />
          <div class="w-full">
            <SearchInput placeholder="       Search a product" addOnInputClass="w-full" />
          </div>
        </div>
      </div>
      <div class="flex flex-wrap items-center mx-5 gap-3 py-10">
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
          :hasShipRequest="item.hasShipRequest"
          :created-at="item?.createAt ? moment.utc(item?.createAt).format('DD/MM/YYYY HH:mm:ss') : 'N/A'" />
      </div>
    </div>
    <Modal
      :hidden="!isModalVisible"
      :widthClass="'w-[900px]'"
      :hasOverFlowVertical="true"
      :hasButton="true"
      title="Chi tiết"
      @decline-modal="closeModal"
      @confirm-modal="handleConfirm">
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
                  <td class="py-2 px-4 border-b border-grey-light">{{ detail?.buyerAddress }}</td>
                </tr>
                <tr>
                  <td
                    class="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">
                    Số điện thoại :
                  </td>
                  <td class="py-2 px-4 border-b border-grey-light">
                    {{ detail?.buyerPhoneNumber }}
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
          <Button :type="constant.buttonTypes.OUTLINE" @on-click="closeModal"> Đóng </Button>
        </div>
        <div>
          <!-- <Button
            :disabled="isUpdating || detail?.statusOrder !== OrderStatus.CONFIRM_DELIVERY.value"
            @on-click="updateOrderStatus">
            <div class="flex items-center">
              <div>Đã nhận hàng</div>
            </div>
          </Button> -->
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
