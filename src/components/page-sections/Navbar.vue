<script setup>
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import { Icon } from '@iconify/vue';
import { Dropdown, ListGroup, ListGroupItem } from 'flowbite-vue'
import SearchInput from '@/components/common-components/SearchInput.vue'

const cartItem = ref(true)
const mobileMenu = ref(false)
</script>
<template>
    <!-- component -->
    <!-- Header -->
    <div class="fixed w-full top-0 z-10">
        <div class="bg-blue-700">
            <nav class="container px-6 py-2 mx-auto flex justify-between items-center text-white">
                <div class="flex items-center justify-between">
                    <router-link to="/" class="text-xl font-bold text-white md:text-2xl hover:text-blue-400">
                        Shoe Market
                    </router-link>
                </div>

                <SearchInput placeholder="       Search a product" addOnInputClass="w-[450px]" />

                <!-- Mobile Menu open: "block", Menu closed: "hidden" -->
                <ul class="flex flex-row gap-8 items-center">
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
            </nav>
        </div>
    </div>
</template>