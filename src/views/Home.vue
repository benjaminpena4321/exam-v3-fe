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
    </h2>
  </div>
</template>

<script>
import api from "../services/api";

export default {
  name: "Home",
  data() {
    return {
      message: "",
      loading: true,
      error: ""
    };
  },
  async mounted() {
    try {
      // This will fire to: current_webview_url/api/messages
      const response = await api.get("/messages");
      
      this.message = response.data.message;
    } catch (error) {
      console.error(error);
      this.error = "Unable to fetch message from the backend.";
    } finally {
      this.loading = false;
    }
  }
};
</script>