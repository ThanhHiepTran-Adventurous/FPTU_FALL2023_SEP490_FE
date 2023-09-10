<script setup>
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import { Icon } from '@iconify/vue';
import { Dropdown, ListGroup, ListGroupItem } from 'flowbite-vue'
import Button from "@/components/common-components/Button.vue"
import constant from "@/common/constant"
import SearchInput from '@/components/common-components/SearchInput.vue'

const cartItem = ref(true)
const mobileMenu = ref(false)

const isAuth = ref(false)

</script>
<template>
    <!-- component -->
    <!-- Header -->
    <div class="fixed w-full top-0 z-10">
        <div class="bg-blue-700">
            <nav class="container px-6 py-2 mx-auto flex flex-col gap-3 md:gap-0 md:flex-row md:justify-between md:items-center text-white">
                <div class="flex items-center justify-between">
                    <router-link to="/" class="text-xl font-bold text-white md:text-2xl hover:text-blue-400">
                        <img src="https://firebasestorage.googleapis.com/v0/b/bidbay-project.appspot.com/o/svg-formatter-beautifier-1.png?alt=media&token=3f69cb28-1feb-4d06-93bb-a25ee66ec880"
                            alt="logo"
                            class="w-[100px] h-[28px]"
                        />
                    </router-link>
                </div>

                <SearchInput placeholder="       Search a product" addOnInputClass="w-full md:w-[400px]" />

                <!-- Mobile Menu open: "block", Menu closed: "hidden" -->
                <ul v-if="isAuth" class="flex flex-row gap-8 items-center">
                    <RouterLink to="/cart" class="flex text-white hover:!text-gray-400">
                        <Icon icon="material-symbols:shopping-cart" class="text-[28px]" />
                        <span class="flex absolute -mt-1 ml-4">
                            <span
                                class=" animate-ping absolute inline-flex h-3 w-3 rounded-full bg-pink-400 opacity-75"></span>
                            <span class=" relative inline-flex rounded-full h-3 w-3 bg-pink-500">

                            </span>
                        </span>
                    </RouterLink>
                    <RouterLink to="/" class="flex text-white hover:!text-gray-400">
                        <Icon icon="wpf:like" class="text-[28px]" />
                    </RouterLink>
                    <!-- dropdown account -->
                    <Dropdown placement="bottom" text="bottom">
                        <template #trigger>
                            <Icon icon="codicon:account" class="text-[28px] hover:cursor-pointer hover:text-gray-400" />
                        </template>
                        <ListGroup>
                            <ListGroupItem>
                                <template #prefix>
                                    <Icon icon="tabler:edit" class="text-[28px]" />
                                </template>
                                Edit
                            </ListGroupItem>
                            <ListGroupItem>
                                <template #prefix>
                                    <Icon icon="tabler:logout" class="text-[28px]" />
                                </template>
                                Logout
                            </ListGroupItem>
                        </ListGroup>
                    </Dropdown>
                </ul>
                <div v-else class="flex gap-3">
                    <router-link to="/register">
                        <Button :type="constant.buttonTypes.OUTLINE" @on-click="$emit('decline-modal')">
                            Đăng kí
                        </Button>
                    </router-link>
                    <Button :type="constant.buttonTypes.OUTLINE" @on-click="$emit('decline-modal')">
                        Đăng nhập
                    </Button>
                </div>
            </nav>
        </div>
    </div>
</template>