import axios from "axios";

// Create Axios Instance
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL, // Replace with your backend base URL
    withCredentials: true,  // This allows cookies to be sent with requests 
    headers: {},
});


// Interceptors for adding Authorization token
axiosInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token"); // Get token from localStorage
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
);

export default axiosInstance;