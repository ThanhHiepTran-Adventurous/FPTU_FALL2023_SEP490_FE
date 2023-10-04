<script setup>
import Nav from "@/components/messenger/Nav.vue";
import Body from "@/components/messenger/Body.vue";
</script>

<template>
  <div class="flex h-screen antialiased text-gray-800">
    <div class="flex flex-row h-full w-full overflow-x-hidden">
      <div class="flex flex-col py-8 pl-6 pr-2 w-64 bg-white flex-shrink-0">
        <Nav></Nav>
      </div>
      <div class="flex flex-col flex-auto h-full p-6">
       <Body></Body>
      </div>
    </div>
  </div>
</template>