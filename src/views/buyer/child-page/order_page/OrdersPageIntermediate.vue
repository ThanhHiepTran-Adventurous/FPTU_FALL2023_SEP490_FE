<script setup>
import { onMounted, ref, watch } from 'vue'
import SearchInput from '@/components/common-components/SearchInput.vue'
import Modal from '@/components/common-components/Modal.vue'
import formatCurrency from '@/utils/currency-output-formatter'
import moment from 'moment'
import imageHelper from '@/utils/image-helper'
import { AuctionModelType, OrderStatus, ShipRequestType } from '@/common/contract'
import { Icon } from '@iconify/vue'
import Button from '@/components/common-components/Button.vue'
import constant, { buyerTabs } from '@/common/constant'
import OrderService from '@/services/order.service'
import ItemOrder from '@/components/common-components/item-box/ItemOrder.vue'
import Breadcrumb from '@/layouts/Breadcrumb.vue'
import SideBarLayout from '../../../../layouts/BuyerSideBarLayout.vue'
import TwoOptionsTab from '@/components/TwoOptionsTab.vue'
import ReportModal from '@/components/ReportModal.vue'
import toastOption from '@/utils/toast-option'
import ReportService from '@/services/report.service'
import Dropdown from '@/components/common-components/Dropdown.vue'
import ShippingStatusIntermediate from '@/components/ShippingStatusIntermediate.vue'
import shiprequestService from '@/services/shiprequest.service'

const orders = ref([])
const ordersFiltered = ref([])

const detail = ref(null)

const isModalVisible = ref(false)
const breadcrumbItems = [
  {
    text: 'Trang chủ',
    to: '/',
    disabled: false,
  },
  {
    text: 'Đã mua',
    to: '/orders/intermediate',
    disabled: true,
  },
]

// Filter
const options = ref([
  {
    label: 'Đã có yêu cầu giao hàng',
    value: true,
  },
  {
    label: 'Chưa có yêu cầu giao hàng',
    value: false,
  },
])

const selected = ref({
  label: 'Đã có yêu cầu giao hàng',
  value: true,
})
watch(selected, newVal => {
  filterData()
})

const isReportModalOpen = ref(false)
const openReportModal = () => {
  isReportModalOpen.value = true
}
const closeReportModal = () => {
  isReportModalOpen.value = false
}
const filterData = () => {
  ordersFiltered.value = orders.value
    .filter(v => v.modelTypeAuctionOfOrder === AuctionModelType.intermediate && v.hasShipRequest === selected.value.value)
    .sort((a, b) => {
      return new Date(b.createAt).getTime() - new Date(a.createAt).getTime()
    })
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
  orders.value = response.data ? response.data.map(f => {
    if(!f.shipRequestList){
      return f
    }
    if(f.shipRequestList.length === 1){
      f.sellerShipRequest = f.shipRequestList[0]
    }
    if(f.shipRequestList.length === 2){
      f.sellerShipRequest = f.shipRequestList.filter(data => data.type === ShipRequestType.SELLER_SHIP)[0]
      f.buyerShipRequest = f.shipRequestList.filter(data => data.type === ShipRequestType.BUYER_RETURN)[0]
    }
    return f
  }) : []
  filterData()
}
const onReportModalDecline = () => {
  closeReportModal()
}
const onReportModalConfirm = async (listImg, text) => {
  if (!text || !text.trim()) {
    toastOption.toastError('Bạn phải nhập nội dung tố cáo!')
  }
  // closeReportModal()
  if (!Array.isArray(listImg)) {
    toastOption.toastError('Invalid image list')
    return
  }
  // Prepare data
  const formData = new FormData()
  const jsonData = {
    content: text,
  }

  for (const imgData of listImg) {
    formData.append('reportImages', imgData)
  }
  formData.append('createReportRequest', new Blob([JSON.stringify(jsonData)], { type: 'application/json' }))

  try {
    closeModal()
    await ReportService.buyerReportSellerOpt2(detail.value.id, formData)
    toastOption.toastSuccess('Tố cáo thành công')
    fetchOrders()
  } catch (error) {
    if(error.response.data.message.includes('already reported')){
      toastOption.toastError('Bạn đã gửi yêu cầu cho đơn hàng này rồi, vui lòng không gửi lại yêu cầu.')
      return
    }
    toastOption.toastError('Tố cáo thất bại')
    console.error('Error creating ship request:', error)
  }
}
const onConfirmOrder = async (shipRequestId) => {
  try {
    closeModal()
    await shiprequestService.buyerConfirmShipRequestDone(shipRequestId)
    toastOption.toastSuccess('Chấp nhận đơn hàng thành công')
    fetchOrders()
  } catch (error) {
    toastOption.toastError('Có lỗi khi xử lý, vui lòng thử lại sau.')
    console.log(error)
  }
}

onMounted(() => {
  fetchOrders()
})
</script>

<template>
  <div class="w-full">
    <div class="pt-2 pb-2 container mx-auto">
      <Breadcrumb :items="breadcrumbItems" />
    </div>
    <SideBarLayout :cur-tab="buyerTabs.order.value">
      <div class="bg-white container mx-auto rounded min-h-[80vh] w-full">
        <!-- Header -->
        <div class="pt-3 px-3 pb-1 flex items-center justify-between">
          <div class="font-bold text-2xl text-black text-blue-800">Lịch sử đơn hàng</div>
          <div>
            <TwoOptionsTab
              immediate-option-nav="/orders/immediate"
              intermediate-option-nav="/orders/intermediate"
              :cur-tab="AuctionModelType.intermediate" />
          </div>
        </div>

        <!-- Filter -->
        <div class="mb-2 mx-3 pt-3">
          <div class="flex items-center gap-3">
            <Dropdown v-model="selected" :data="options" class="!w-[300px]" />
            <div class="w-full">
              <SearchInput placeholder="       Search a product" addOnInputClass="w-full" />
            </div>
          </div>
        </div>
        <div class="flex flex-wrap items-center mx-5 gap-3 py-6">
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
            :statusShipRequest="item.sellerShipRequest?.status"
            :is-completed="item.statusOrder === OrderStatus.DONE.value"
            :statusReturnRequest="item.buyerShipRequest?.status"
            :chatGroupId="item.chatGroupDTOs.id"
            :created-at="item?.createAt ? moment.utc(item?.createAt).format('DD/MM/YYYY HH:mm:ss') : 'N/A'" />
        </div>
      </div>
    </SideBarLayout>
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
            <div class="flex items-center gap-3 mb-2">
              <div class="text-xl font-bold ml-5 underline mr-3">Thông tin đơn hàng</div>
              <div
                v-if="detail?.statusOrder === OrderStatus.DONE.value"
                class="bg-green-100 text-green-800 border-[1px] border-green-500 text-[20px] font-medium inline-flex items-center gap-2 px-2.5 py-0.5 rounded ">
                <Icon icon="clarity:success-standard-solid" />
                <div>Đã hoàn tất</div>
              </div>
            </div>
            <table class="w-full table-auto text-lg">
              <tbody>
                <tr>
                  <td
                    class="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">
                    Tên Sản Phẩm:
                  </td>
                  <td class="py-2 px-4 border-b border-grey-light">{{ detail?.productResponse.name }}</td>
                </tr>
                <tr>
                  <td
                    class="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">
                    Giá tiền:
                  </td>
                  <td class="py-2 px-4 border-b border-grey-light">{{ formatCurrency(detail?.price) }}</td>
                </tr>
                <tr>
                  <td
                    class="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">
                    Địa chỉ:
                  </td>
                  <td class="py-2 px-4 border-b border-grey-light">{{ detail?.buyerAddress }}</td>
                </tr>
                <tr>
                  <td
                    class="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">
                    Số điện thoại:
                  </td>
                  <td class="py-2 px-4 border-b border-grey-light">
                    {{ detail?.buyerPhoneNumber }}
                  </td>
                </tr>
                <tr>
                  <td
                    class="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">
                    Tạo lúc:
                  </td>
                  <td class="py-2 px-4 border-b border-grey-light">
                    {{ detail?.createAt ? moment.utc(detail?.createAt).format('DD/MM/YYYY HH:mm:ss') : 'N/A' }}
                  </td>
                </tr>
                <tr>
                  <td
                    class="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">
                    Cập nhật lúc:
                  </td>
                  <td class="py-2 px-4 border-b border-grey-light">
                    {{
                      detail?.lastUpdatedAt ? moment.utc(detail?.lastUpdatedAt).format('DD/MM/YYYY HH:mm:ss') : 'N/A'
                    }}
                  </td>
                </tr>
                <tr v-if="detail?.sellerShipRequest">
                  <td
                    class="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">
                    Trạng thái giao hàng:
                  </td>
                  <td class="py-2 px-4 border-b border-grey-light">
                    <ShippingStatusIntermediate :status="detail?.sellerShipRequest.status"/>
                  </td>
                </tr>
                <tr v-if="detail?.buyerShipRequest">
                  <td
                    class="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">
                    Trạng thái trả hàng:
                  </td>
                  <td class="py-2 px-4 border-b border-grey-light">
                    <ShippingStatusIntermediate :status="detail?.buyerShipRequest.status"/>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <template #button>
        <div>
          <Button :type="constant.buttonTypes.OUTLINE" @on-click="closeModal"> Đóng </Button>
        </div>
        <div>
          <Button :disabled="detail?.statusOrder !== OrderStatus.NEW.value" @on-click="openReportModal">
            <div class="flex items-center">
              <div>Yêu cầu trả hàng</div>
            </div>
          </Button>
        </div>
        <div>
          <Button :disabled="detail?.statusOrder !== OrderStatus.NEW.value" @on-click="onConfirmOrder(detail?.sellerShipRequest.id)">
            <div class="flex items-center">
              <div>Chấp nhận đơn hàng</div>
            </div>
          </Button>
        </div>
        <ReportModal :hidden="!isReportModalOpen" @confirm="onReportModalConfirm" @decline="onReportModalDecline" />

        <div></div>
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
