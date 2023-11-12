<script setup>
import SideBar from '../layouts/BuyerSideBarLayout.vue';
import TwoOptionsTab from '@/components/TwoOptionsTab.vue';
import AuctionCard from '@/components/AuctionCard.vue';
import ListImage from '@/components/ListEditableImage.vue';
</script>

<template>
    <SideBar />
    <TwoOptionsTab />
    <AuctionCard />
    <ListImage :img-src="['https://static.vecteezy.com/system/resources/previews/009/292/244/original/default-avatar-icon-of-social-media-user-vector.jpg', 'https://static.vecteezy.com/system/resources/previews/009/292/244/original/default-avatar-icon-of-social-media-user-vector.jpg', 'https://static.vecteezy.com/system/resources/previews/009/292/244/original/default-avatar-icon-of-social-media-user-vector.jpg']" />
</template>