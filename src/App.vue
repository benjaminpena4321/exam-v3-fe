<script setup>
  import { onMounted } from 'vue';
  import MessageForm from './components/Message.Form.vue';

</script>

<template>
  <div class="main-container">
    <p>Message Form Builder</p>

    <MessageForm/>


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