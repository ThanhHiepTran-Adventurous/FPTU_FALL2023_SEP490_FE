<script setup>
import { onMounted, ref, watch } from 'vue';
import SearchInput from '../common-components/SearchInput.vue';
import auctionService from '@/services/auction.service';
import Modal from '../common-components/Modal.vue';
import formatCurrency from '@/utils/currency-output-formatter';
import moment from 'moment';
import ItemSold from '../common-components/item-box/ItemSold.vue';
import imageHelper from '@/utils/image-helper';
import { AuctionModelType, ProductStatus } from '@/common/contract';
import { Icon } from '@iconify/vue'
import Dropdown from '../common-components/Dropdown.vue';
import Button from "@/components/common-components/Button.vue"
import constant from '@/common/constant';
import OrderService from '@/services/order.service';

const auctions = ref([])
const auctionsFiltered = ref([])

const isModalVisible = ref(false)
const detail = ref(null)

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

const fetchAuctions = async () => {
  const query = "status:PAID"
  const response = await auctionService.getAuctionBySeller(query)
  auctions.value = response.data
  filterData()
}
const filterData = () => {
  auctionsFiltered.value = auctions.value.filter(
    v => v.modelType === selected.value.value && v.product.status !== 'PAID',
  )
}

const calculateIsInvalidSold = auction => {
  return auction?.product.status === ProductStatus.NOT_REACH_NUM_AUCTIONEER.value
}

const activateInfoAuction = (auction) => {
  isModalVisible.value = true
  detail.value = auction
}

function closeModal() {
  isModalVisible.value = false;
}

function handleConfirm() {
  closeModal();
}

const handlePayment = () => {
  //payment here
}

const fetchOrders = async () => {
  const response = await OrderService.getAllOrders('', 1, 1000, '')
  console.log(response)
}

onMounted(() => {
  fetchAuctions()
  fetchOrders()
})

</script>

<template>
  <div class="container my-[20px] py-2 mx-auto bg-white rounded-md min-h-[80vh]">
    <div class="mb-4 mx-5 mt-4">
      <div class="mt-3 flex items-center">
        <Dropdown v-model="selected" :data="options" class="!w-[300px]" />
        <div class="w-full">
          <SearchInput placeholder="       Search a product" addOnInputClass="w-full" />
        </div>
      </div>
    </div>
    <div class="flex flex-wrap items-center mt-10 mx-5 gap-3 py-10">
      <ItemSold
          v-for="item in auctionsFiltered" :key="item.id"
          @click="activateInfoAuction(item)"
          :product-name="item.product.name"
          :price="item.highestPrice"
          :mainImage="imageHelper.getPrimaryImageFromList(item.product.imageUrls)"
          :secondaryImage="imageHelper.getSecondaryImageFromList(item.product.imageUrls)"
          :auction-type="item.modelType"
          :is-invalid-sold="calculateIsInvalidSold(item)"
        />
    </div>
    <div>
    <Modal :hidden="!isModalVisible" :widthClass="'w-[900px]'" :hasOverFlowVertical=true :hasButton=true
      title="Chi tiết"
      @decline-modal="closeModal" @confirm-modal="handleConfirm">
      <div class="flex-1 bg-gray rounded-lg mx-1 my-1">
      <div class="relative mx-2">
        <div class="mx-auto container align-middle">
          <div class="flex w-full justify-around p-2 rounded-xl border-[1px] border-solid border-blue-300 w-full min-h-[100px] my-3">
            <div class="shadow rounded-lg py-3 px-5 bg-white">
              <div class="flex flex-row justify-between items-center">
                <div>
                  <h6
                    class="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">
                    GIÁ ĐẠT ĐƯỢC </h6>
                  <h4 class="py-2 mt-3 px-4 text-teal-500 text-center">{{ formatCurrency(detail?.highestPrice) }}</h4>
                </div>
              </div>
            </div>
            <div class="rounded-lg py-3 px-5 bg-white shadow">
              <div class="flex flex-row justify-center items-center">
                <div>
                  <h6 class="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">
                    Lượt đấu giá
                  </h6>
                  <div class="flex items-center justify-center">
                    <h4 class=" py-2 mr-1">{{ detail?.numberOfBids }}</h4>
                    <Icon icon="mdi:payment-clock" class="text-[28px] ml-2"/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="relative mt-5 mb-2 px-2">
        <div class="mx-auto container align-middle">
          <table class="w-full table-auto text-sm">
            <tbody>
              <tr>
                <td
                  class="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">
                  Tên Sản Phẩm :
                </td>
                <td class="py-2 px-4 border-b border-grey-light">{{ detail?.product.name }}</td>
              </tr>
              <tr>
                <td
                  class="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">
                  Giá khởi điểm :
                </td>
                <td class="py-2 px-4 border-b border-grey-light">{{ formatCurrency(detail?.startPrice) }}</td>
              </tr>
              <tr>
                <td
                  class="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">
                  giá mua ngay :
                </td>
                <td class="py-2 px-4 border-b border-grey-light">{{ formatCurrency(detail?.buyNowPrice) }}</td>
              </tr>
              <tr>
                <td
                  class="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">
                  bước nhảy tối thiểu :
                </td>
                <td class="py-2 px-4 border-b border-grey-light">{{ formatCurrency(detail?.jump) }}</td>
              </tr>
              <tr>
                <td
                  class="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">
                  thời gian kết thúc :
                </td>
                <td class="py-2 px-4 border-b border-grey-light">{{ detail?.endDate ? moment(detail?.endDate).format("DD/MM/YYYY HH:mm:ss") : 'N/A' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="p-2 rounded-xl w-full">
        <div class="text-red-500 text-lg">
          Để biết thông tin và tiến hành trao đổi với người thắng cuộc, vui lòng thanh toán phí cho phiên đấu giá.
        </div>
      </div>
    </div>
    <template v-slot:button>
      <div>
        <Button :type="constant.buttonTypes.OUTLINE" @on-click="closeModal">
          Hủy
        </Button>
      </div>
      <div>
        <Button @on-click="handlePayment">
          <div class="flex items-center">
            <Icon icon="streamline:money-wallet-money-payment-finance-wallet" class="text-[18px] mr-2" />
            <div>Thanh toán</div>
          </div>
        </Button>
      </div>
    </template>
    </Modal>
  </div>
  </div>
</template>
@/utils/currency-output-formatter