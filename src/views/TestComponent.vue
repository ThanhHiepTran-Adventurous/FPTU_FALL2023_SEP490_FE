<script setup>
import SideBar from '../layouts/BuyerSideBarLayout.vue';
import TwoOptionsTab from '@/components/TwoOptionsTab.vue';
import AuctionCard from '@/components/AuctionCard.vue';
import ListImage from '@/components/ListEditableImage.vue';
import ShippingStatusIntermediate from '@/components/ShippingStatusIntermediate.vue';
import { StatusShipRequest } from '@/common/contract';
</script>

<template>
    <SideBar />
    <TwoOptionsTab />
    <AuctionCard />
    <ListImage :img-src="['https://static.vecteezy.com/system/resources/previews/009/292/244/original/default-avatar-icon-of-social-media-user-vector.jpg', 'https://static.vecteezy.com/system/resources/previews/009/292/244/original/default-avatar-icon-of-social-media-user-vector.jpg', 'https://static.vecteezy.com/system/resources/previews/009/292/244/original/default-avatar-icon-of-social-media-user-vector.jpg']" />
    <ShippingStatusIntermediate :status="StatusShipRequest.waitingForConfirmation.value" />
    <ShippingStatusIntermediate :status="StatusShipRequest.waitingForDelivery.value" />
    <ShippingStatusIntermediate :status="StatusShipRequest.onDelivery.value" />
    <ShippingStatusIntermediate :status="StatusShipRequest.delivered.value" />
    <ShippingStatusIntermediate :status="StatusShipRequest.cancelled.value" />
    <ShippingStatusIntermediate :status="StatusShipRequest.returns.value" />
</template>