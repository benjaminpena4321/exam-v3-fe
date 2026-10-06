<script setup>
  import { onMounted } from 'vue';
  import MessageForm from './components/Message.Form.vue';
  import MessageList from './components/Message.List.vue';
  import { MessageController } from './controller/message.controller.js';

  const { 
    createMsg,
    getAllMsg,
    messageObj,
    error
  } = MessageController()

  onMounted(() => {
    getAllMsg()
  })
</script>



<template>
  <div class="main-container">
    <p>Message Form Builder</p>
    <span>
      <p v-if="error">{{ error }}</p>
    </span> 
    <MessageForm/>
    <MessageList :msgArray="getAllMsg"/>
  </div>
</template>

<style scoped>

.main-container{
  display: flex;
  justify-content: center; 
  margin: 0;
  padding: 20px;
  font-family: 'Courier New', Courier, monospace;
  background-color: #fff;

}

</style>