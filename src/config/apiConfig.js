import axios from "axios";

const apiConfig = axios.create({
  baseURL: import.meta.env.VITE_API_URL, 
  headers: {
    'Content-Type': 'application/json'
  }
});

export default apiConfig;