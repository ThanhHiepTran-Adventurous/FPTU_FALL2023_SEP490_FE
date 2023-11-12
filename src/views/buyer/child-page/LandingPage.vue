<script setup>
    import BrandSection from '@/components/page-sections/landing-page/BrandSection.vue';
    import PosterSection from '@/components/page-sections/landing-page/PosterSection.vue';
    import OutstandingItem from '@/components/page-sections/landing-page/OutstandingItem.vue';
    import NewTopBar from '@/components/page-sections/NewTopBar.vue';
import { useUserStore } from '@/stores/user.store';
import { onBeforeMount } from 'vue';
import { Role } from '@/common/contract';
import { defaultRoute } from '@/common/constant';
import { useRouter } from 'vue-router';

    // redirect by role
    const userStore = useUserStore()
    const router = useRouter()

    onBeforeMount(() => {
        let routeDefault
        const role = userStore.getRoleAndGetFromLocalStorageIfNotExist()
        if (role === Role.admin.value) {
            routeDefault = defaultRoute.admin
        } else if (role === Role.seller.value) {
            routeDefault = defaultRoute.seller
        } else if (role === Role.staff.value) {
            routeDefault = defaultRoute.staff
        } else {
            routeDefault = defaultRoute.buyer
        }
        if(defaultRoute !== defaultRoute.buyer){
            router.push(routeDefault)
        }
    })
</script>
<template>
    <div>
        <div class="mb-[10px]">
            <NewTopBar />
        </div>
        <PosterSection />
        <BrandSection />
        <OutstandingItem />
    </div>
</template>