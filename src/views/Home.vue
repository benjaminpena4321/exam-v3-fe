<template>
  <div>
    <h1>MEVN Exam</h1>

    <p v-if="loading">
      Loading...
    </p>

    <p v-else-if="error">
      {{ error }}
    </p>

    <h2 v-else>
      {{ message }}
      <form @submit.prevent="handleSubmit">
        <div>
          <label for="title">Title:</label>
          <input 
            id="title" 
            type="text" 
            v-model="taskData.title" 
            required 
          />
        </div>

        <div>
          <label for="description">Description:</label>
          <input 
            id="description" 
            type="description" 
            v-model="taskData.description" 
            required 
          />
        </div>

        <div>
          <label for="status">status:</label>
          <input 
            id="status" 
            type="status" 
            v-model="taskData.status" 
            required 
          />
        </div>

        <!-- Ensure your button type is "submit" -->
        <button type="submit">Submit Form</button>
      </form>
    </h2>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from "../services/api";
import axios from 'axios';

// 1. Define component name (Optional in Vue 3, as it infers from the filename)
defineOptions({ name: 'Home' });
const taskData = ref({
    title: '',
    description: '',
    status: ''
})

// 2. Define reactive state using ref()
const message = ref('');
const loading = ref(true);
const error = ref('');
const isEditing = ref(false);
const API_URL = api.get('/tasks');
const currentItemId = ref(null);

// 3. Use the onMounted lifecycle hook
onMounted(async () => {
  try {
    const response = await api.get("/tasks");
    
    // Remember to use .value when updating refs in <script setup>
    message.value = response.data; 
  } catch (err) {
    console.error(err);
    error.value = "Unable to fetch message from the backend.";
  } finally {
    loading.value = false;
  }
});

const handleSubmit = async () => {
  try {
    if (isEditing.value) {
      // UPDATE operation
      const response = await axios.put(`${API_URL}/${currentItemId.value}`, {
        title: taskData.value.title,
        description: taskData.value.description,
        status: taskData.value.status

      });
      // Update local state directly to avoid unnecessary network request
      const index = taskData.value.findIndex(item => item.id === currentItemId.value);
      if (index !== -1) taskData.value[index] = response.data;
    } else {
      // CREATE operation
      const response = await api.get("/tasks", { 
        title: taskData.value.title,
        description: taskData.value.description,
        status: taskData.value.status
      });
      taskData.push(response.data);
    }
    resetForm();
  } catch (error) {
    console.error('Error saving item:', error);
  }
};
</script>
