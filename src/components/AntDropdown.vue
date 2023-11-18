<script setup>
import { Dropdown, Button, MenuItem, Menu } from 'ant-design-vue'
import moment from 'moment'
import { NotiReadEnum } from '@/common/contract'

const props = defineProps({
    menuData : {
        type: Array,
        default: [{
            title: "Loading...",
            body: ''
        }]
    }
})

</script>
  
<template>
    <Dropdown placement="bottomRight" trigger="click">
        <slot></slot>

        <template #overlay>
            <Menu class="max-h-[90vh] overflow-auto">
                <div v-if="!menuData || menuData.length === 0" class="p-2">Hiện không có thông báo nào</div>
                <Menu-item v-for="(item, indx) in menuData" :key="item">
                    <div
                        class="w-[600px] p-1 rounded-md"
                        :class="{
                            'pt-2' : indx > 0,
                            '!bg-green-100' : item.isRead !== NotiReadEnum.READ
                        }">
                        <div class="font-bold">{{ item.title }}</div>
                        <div class="mt-1">{{ item.body }}</div>
                        <div class="w-full flex justify-end italic">{{ item.createAt ? moment.utc(item.createAt).format('DD/MM/YYYY HH:mm:ss') : '' }}</div>
                    </div>
                    <div class="border-t-[1px] mt-2.5"></div>
                </Menu-item>
            </Menu>
        </template>
    </Dropdown>
</template>