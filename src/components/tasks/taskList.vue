<script setup>
import { ref, onMounted, computed } from "vue";

const tasks = ref([]);
const loading = ref(true);
const error = ref(null);
const searchQuery = ref("");

const fetchTasks = async () => {
  try {
    const response = await fetch(
      "http://localhost:3000/api/tasks"
    );

    if (!response.ok) {
      throw new Error("Failed to fetch tasks");
    }

    tasks.value = await response.json();
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};


const filteredTasks = computed(() => {
  return tasks.value.filter((task) =>
    task.title
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase().trim())
  );
});



const editTask = async (id) => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/tasks/${id}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update task");
    }

    tasks.value = tasks.value.filter(
      (task) => task.id !== id
    );
  } catch (err) {
    error.value = err.message;
  }
};

const deleteTask = async (id) => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/tasks/${id}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete task");
    }

    tasks.value = tasks.value.filter(
      (task) => task.id !== id
    );
  } catch (err) {
    error.value = err.message;
  }
};




onMounted(() => {
  fetchTasks();
});
</script>

<template>
  <div>
    <h1>Task List</h1>

    <router-link to="/createTask">
      Add Task
    </router-link>

    <p v-if="loading">Loading tasks...</p>
    <p v-else-if="error">{{ error }}</p>

    <div v-else>
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search tasks by title..."
      />

      <ul v-if="filteredTasks.length > 0">
        <li
          v-for="task in filteredTasks"
          :key="task.id"
        >
          {{ task.title }}


        <button @click="editTask(task._id)">
            Update 
        </button>



          <button @click="deleteTask(task._id)">
            Delete 
          </button>

          
          
        </li>
      </ul>

      <p v-else>
        No tasks found.
      </p>
    </div>
  </div>
</template>