<script setup>
import Nav from "@/components/messenger/Nav.vue";
import { Icon } from "@iconify/vue"
import { defaultRoute } from "@/common/constant";
import { computed, onBeforeMount, onBeforeUnmount, onMounted, ref, nextTick } from "vue";
import { Role } from "@/common/contract";
import { useUserStore } from "@/stores/user.store";
import { useRoute } from "vue-router";
import { Client } from '@stomp/stompjs';
import urlConstant from "@/common/urlConstant";
import MessageBubble from "@/components/messenger/MessageBubble.vue";
import ChatService from "@/services/chat.service"

const userStore = useUserStore()
const route = useRoute()

let stompClient = undefined
let groupId = undefined
let subscription = undefined

const messagesData = ref([])
const messageDtos = ref([])
const textMessage = ref('')

const backLink = computed(() => {
  const role = userStore.getRoleAndGetFromLocalStorageIfNotExist()
    if(role === Role.admin.value){
      return defaultRoute.admin
    }
    if(role === Role.seller.value){
      return defaultRoute.seller
    }
    return defaultRoute.buyer
})
const scrollMessageBoxToBottom = async () => {
  await nextTick()
  const message = document.getElementById("messageBox")
  message.scrollTop=message.scrollHeight
}

// chat functions
const sendMessage = () => {
  const messageData = textMessage.value
  textMessage.value = ''
  if(messageData){
    const payload = {
      fromUserId: userStore.getUserIdAndGetFromLocalStorageIfNotExist(),
      contentMessage: messageData
    }
    stompClient.publish({
      destination: `/app/chat/${groupId}`,
      body: JSON.stringify(payload)
    })
  }
}

// init functions
const fetchAllMessages = async () => {
  groupId = route.params["groupId"]
  const response = await ChatService.getAllChatMessage(groupId)
  messagesData.value = response.data
}
const initMessageDtos = async () => {
  await fetchAllMessages()
  messageDtos.value = messagesData.value.map(messData => {
    return {
      isFromSelf: messData.fromUser.id === userStore.getUserIdAndGetFromLocalStorageIfNotExist(),
      message: messData.messageContent,
      createAt: messData.createAt
    }
  })
  // setTimeout(() => {
  //   scrollMessageBoxToBottom()
  // }, 500)
  scrollMessageBoxToBottom()
}
const initStompClient = () => {
  stompClient = new Client({
    brokerURL: urlConstant.ws.base,
    connectHeaders: {
      'X-Authorization': urlConstant.ws.authToken
    },
    reconnectDelay: 100,
  })
  stompClient.onConnect = () => {
    console.log("connected")
    subscription = stompClient.subscribe(`/topic/messages/group/${groupId}`, (payload) => {
      const response = JSON.parse(payload.body)
      const messageDtoAppend = {
        isFromSelf: response.fromUserId === userStore.getUserIdAndGetFromLocalStorageIfNotExist(),
        message: response.contentMessage,
        createAt: new Date().toString()
      }
      messageDtos.value.push(messageDtoAppend)
      scrollMessageBoxToBottom()
    })
  }
  stompClient.onStompError = () => {
    console.log("Error")
  }
  stompClient.activate()
  
}

// Hook
onMounted(() => {
  initMessageDtos()
  initStompClient()
})
onBeforeUnmount(() => {
  subscription?.unsubscribe()
  stompClient?.deactivate()
})
</script>

<template>
  <div class="flex h-screen antialiased text-gray-800">
    <div class="flex flex-row justify-between h-full w-full overflow-x-hidden">
      <div class="flex flex-col justify-between py-8 px-6 w-96 bg-white flex-shrink-0">
        <div><Nav></Nav></div>
        <router-link :to="backLink" class="flex items-center justify-center text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">
          <div><Icon icon="simple-line-icons:logout" class="text-[20px] mr-3"/></div>
          <div>Thoát</div>
        </router-link>
      </div>
      <div class="flex flex-col flex-auto h-full p-6">
        <div class="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-100 h-full p-4">
    <div class="flex flex-col h-full overflow-x-auto mb-4">
      <div class="flex flex-col h-full">
        <div class="grid grid-cols-12 gap-y-2 overflow-auto max-h-[90vh] scroll-smooth" id="messageBox">
          <MessageBubble
            v-for="mess in messageDtos" :key="mess.createAt"
            :isSender="!mess.isFromSelf"
            :message="mess.message"
            :createAt="mess.createAt" />
        </div>
      </div>
    </div>
    <div class="flex flex-row items-center h-16 rounded-xl bg-white w-full px-4">
      <div class="flex-grow">
        <div class="relative w-full">
          <input v-model="textMessage" @keypress.enter="sendMessage" type="text" class="flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10" />
        </div>
      </div>
      <div class="ml-4">
        <button
          @click="() => sendMessage()"
          class="flex items-center justify-center bg-blue-500 hover:bg-blue-600 rounded-[50%] p-2 text-white flex-shrink-0">
          <span class="ml-1">
            <svg class="w-4 h-4 transform rotate-45 -mt-px" fill="none" stroke="currentColor" viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8">
              </path>
            </svg>
          </span>
        </button>
      </div>
    </div>
  </div>
  </div>
</div>
</div>
</template>