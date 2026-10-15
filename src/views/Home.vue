<script setup>
import { onMounted, ref } from "vue";

const API_URL = "http://localhost:3000/api/tasks";

const tasks = ref([]);
const title = ref("");
const description = ref("");
const status = ref("pending");

const editingId = ref(null);
const loading = ref(false);
const error = ref("");

const fetchTasks = async () => {
  try {
    loading.value = true;
    error.value = "";

    const response = await fetch(API_URL);

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

const resetForm = () => {
  title.value = "";
  description.value = "";
  status.value = "pending";
  editingId.value = null;
};

const saveTask = async () => {
  if (!title.value.trim()) {
    error.value = "Title is required.";
    return;
  }

  try {
    error.value = "";

    const taskData = {
      title: title.value.trim(),
      description: description.value,
      status: status.value
    };

    const url = editingId.value
      ? `${API_URL}/${editingId.value}`
      : API_URL;

    const method = editingId.value ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(taskData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to save task");
    }

    await fetchTasks();
    resetForm();
  } catch (err) {
    error.value = err.message;
  }
};

const editTask = (task) => {
  editingId.value = task._id;
  title.value = task.title;
  description.value = task.description;
  status.value = task.status;
  error.value = "";
};

const deleteTask = async (id) => {
  if (!confirm("Are you sure you want to delete this task?")) {
    return;
  }

  try {
    error.value = "";

    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE"
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "Failed to delete task");
    }

    await fetchTasks();

    if (editingId.value === id) {
      resetForm();
    }
  } catch (err) {
    error.value = err.message;
  }
};

const toggleStatus = async (task) => {
  try {
    error.value = "";

    const newStatus =
      task.status === "completed" ? "pending" : "completed";

    const response = await fetch(`${API_URL}/${task._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        status: newStatus
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update task");
    }

    await fetchTasks();
  } catch (err) {
    error.value = err.message;
  }
};

onMounted(() => {
  fetchTasks();
});
</script>

<template>
  <main class="container">
    <h1>Task Management</h1>

    <form class="task-form" @submit.prevent="saveTask">
      <h2>{{ editingId ? "Edit Task" : "Add Task" }}</h2>

      <div class="form-group">
        <label for="title">Title</label>
        <input
          id="title"
          v-model="title"
          type="text"
          placeholder="Enter task title"
        />
      </div>

      <div class="form-group">
        <label for="description">Description</label>
        <textarea
          id="description"
          v-model="description"
          placeholder="Enter task description"
          rows="3"
        ></textarea>
      </div>

      <div class="form-group">
        <label for="status">Status</label>
        <select id="status" v-model="status">
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div class="form-actions">
        <button type="submit">
          {{ editingId ? "Update Task" : "Add Task" }}
        </button>

        <button
          v-if="editingId"
          type="button"
          class="secondary"
          @click="resetForm"
        >
          Cancel
        </button>
      </div>
    </form>

    <p v-if="error" class="error">
      {{ error }}
    </p>

    <section class="task-list">
      <h2>Tasks</h2>

      <p v-if="loading">Loading tasks...</p>

      <p v-else-if="tasks.length === 0">
        No tasks yet.
      </p>

      <article
        v-for="task in tasks"
        :key="task._id"
        class="task-card"
        :class="{ completed: task.status === 'completed' }"
      >
        <div>
          <h3>{{ task.title }}</h3>

          <p v-if="task.description">
            {{ task.description }}
          </p>

          <span class="status">
            {{ task.status }}
          </span>
        </div>

        <div class="task-actions">
          <button @click="toggleStatus(task)">
            {{
              task.status === "completed"
                ? "Mark Pending"
                : "Complete"
            }}
          </button>

          <button @click="editTask(task)">
            Edit
          </button>

          <button class="danger" @click="deleteTask(task._id)">
            Delete
          </button>
        </div>
      </article>
    </section>
  </main>
</template>

<style scoped>
.container {
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

h1 {
  text-align: center;
  margin-bottom: 30px;
}

.task-form {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input,
textarea,
select {
  width: 100%;
  box-sizing: border-box;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.form-actions {
  display: flex;
  gap: 10px;
}

button {
  padding: 8px 14px;
  border: none;
  border-radius: 5px;
  background: #42b883;
  color: white;
  cursor: pointer;
}

button:hover {
  opacity: 0.9;
}

button.secondary {
  background: #777;
}

button.danger {
  background: #dc3545;
}

.task-list {
  margin-top: 20px;
}

.task-card {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  padding: 15px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.task-card.completed {
  background: #f0fff4;
  opacity: 0.8;
}

.task-card.completed h3 {
  text-decoration: line-through;
}

.status {
  display: inline-block;
  margin-top: 8px;
  padding: 4px 8px;
  border-radius: 4px;
  background: #eee;
  font-size: 12px;
}

.task-actions {
  display: flex;
  align-items: center;
  gap: 5px;
}

.error {
  padding: 10px;
  background: #ffe5e5;
  color: #b00020;
  border-radius: 5px;
}
</style>
