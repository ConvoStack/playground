import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_ENDPOINT, // Set your desired base URL here
});

export default axiosInstance;