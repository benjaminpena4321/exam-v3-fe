<template>
  <div>
    <h1>Task Manager</h1>

    <p v-if="loading">
      Loading...
    </p>

    <p v-else-if="error">
      {{ error }}
    </p>

    <h2 v-else>
      {{ message }}
    </h2>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from "../services/api";

// 1. Define component name (Optional in Vue 3, as it infers from the filename)
defineOptions({ name: 'Home' });

// 2. Define reactive state using ref()
const message = ref('');
const loading = ref(true);
const error = ref('');

// 3. Use the onMounted lifecycle hook
onMounted(async () => {
  try {
    const response = await api.get("/messages");
    
    // Remember to use .value when updating refs in <script setup>
    message.value = response.data.message; 
  } catch (err) {
    console.error(err);
    error.value = "Unable to fetch message from the backend.";
  } finally {
    loading.value = false;
  }
});
</script>
