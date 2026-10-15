<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const title = ref('');
const description = ref('');
const loading = ref(false);

const taskId = route.params.id;

const fetchTask = async () => {
  if (!taskId) return;

  loading.value = true;

  try {
    const res = await fetch(
      `http://localhost:3000/api/tasks/${taskId}`
    );

    if (!res.ok) {
      throw new Error('Failed to retrieve task');
    }

    const task = await res.json();

    title.value = task.title;
    description.value = task.description ?? '';
  } catch (error) {
    console.error('Error fetching task:', error);
  } finally {
    loading.value = false;
  }
};

const formTask = async () => {
  if (!title.value.trim()) return;

  const isEditing = Boolean(taskId);

  try {
    const res = await fetch(
      isEditing
        ? `http://localhost:3000/api/tasks/${taskId}`
        : 'http://localhost:3000/api/tasks',
      {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: title.value,
          description: description.value
        })
      }
    );

    if (!res.ok) {
      throw new Error('Failed to save task');
    }

    router.push('/tasks');
  } catch (error) {
    console.error('Error saving task:', error);
  }
};

onMounted(fetchTask);
</script>

<template>
  <form @submit.prevent="formTask">
    <h2>{{ taskId ? 'Edit Task' : 'Create Task' }}</h2>

    <p>Title</p>
    <input
      v-model="title"
      placeholder=" title"
      required
      :disabled="loading"
    />

    <p>Description</p>
    <textarea
      v-model="description"
      placeholder=" description"
      :disabled="loading"
    />

    <button type="submit" :disabled="loading">
      {{ taskId ? 'Update' : 'Add' }}
    </button>
  </form>
</template>