<script setup>
import { onMounted, ref } from 'vue';
import SearchInput from '../common-components/SearchInput.vue';
import auctionService from '@/services/auction.service';
import Modal from '../common-components/Modal.vue';
import formatCurrency from '@/utils/currency-formatter';
import moment from 'moment';
import ItemSold from '../common-components/item-box/ItemSold.vue';
import imageHelper from '@/utils/image-helper';
import { ProductStatus } from '@/common/contract';
import { Icon } from '@iconify/vue'

const auctions = ref([])
const isModalVisible = ref(false)
const detail = ref(null)

const fetchAuctions = async () => {
  const query = "status:COMPLETED"
  const response = await auctionService.getAuctionBySeller(query)
  auctions.value = response.data
}

const calculateIsInvalidSold = auction => {
  return auction?.product.status === ProductStatus.NO_AUCTIONEER.value
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

onMounted(() => {
  fetchAuctions()
})

</script>

<template>
  <div class="container my-[20px] py-2 mx-auto bg-white rounded-md h-[80vh]">
    <div class="mb-4 flex items-center mx-5 mt-4">
      <div class="w-full ml-2">
        <SearchInput placeholder="       Search a product" addOnInputClass="w-full" />
      </div>
    </div>
    <div class="flex flex-wrap items-center mt-10 mx-5 gap-3">
      <ItemSold
          v-for="item in auctions" :key="item.id"
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
    <Modal :hidden="!isModalVisible" :widthClass="'w-[900px]'" :hasOverFlowVertical=true :hasButton=false
      title="Chi tiết"
      @decline-modal="closeModal" @confirm-modal="handleConfirm">
      <div class="flex-1 bg-gray rounded-lg mx-1 my-1">
      <div class="relative mx-2">
        <div class="mx-auto container align-middle">
          <div class="flex w-full justify-around mt-5">
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
      <div class="relative my-5 px-2">
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
    </div>
    </Modal>
  </div>
  </div>
</template>
