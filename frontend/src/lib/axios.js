import axios from 'axios';

const axiosInstance=axios.create({
    baseURL:import.meta.env.MODE==="development" ? "http://localhost:8080/api":"https://wallpaper-app-1.onrender.com/api",
    withCredentials:true
});

export default axiosInstance;