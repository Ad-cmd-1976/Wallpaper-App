import axios from 'axios';

const axiosInstance=axios.create({
    baseURL:import.meta.env.MODE==="development" ? "http://localhost:8080/api":"https://wallpaper-app-1.onrender.com/api",
    withCredentials:true
});

axiosInstance.interceptors.response.use(
    (response)=> response,
    async (error)=>{
        const originalRequest=error.config;

        if(error.response.status===403 && !originalRequest._retry){
            originalRequest=true;

            try{
                await axiosInstance.post('/refresh');
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