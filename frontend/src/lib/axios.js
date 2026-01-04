import axios from 'axios';

console.log(import.meta.env.MODE);
console.log(import.meta.env.VITE_API_BASE_URL);
const axiosInstance=axios.create({
    baseURL:import.meta.env.MODE==="development" ? "http://localhost:8080/api": import.meta.env.VITE_API_BASE_URL,
    withCredentials:true
});

axiosInstance.interceptors.response.use(
    (response)=> response,
    async (error)=>{
        const originalRequest=error.config;

        if(error.response && error.response.status===401 && !originalRequest._retry){
            originalRequest._retry=true;

            try{
                await axiosInstance.post('/auth/refresh');
                return axiosInstance(originalRequest);
            }
            catch(error){
                console.error("Refresh failed, logging out!");
            }
        }
        return Promise.reject(error);
    }
)

export default axiosInstance;