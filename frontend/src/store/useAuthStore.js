import {create} from 'zustand';
import { toast } from 'react-hot-toast';
import axios from '../lib/axios.js'

export const useAuthStore=create((set,get)=>({
    user:null,
    isLoading:false,
    checkingAuth:false,

    signup:async({ name, email, password, confirmPassword})=>{
        set({ isLoading:true });

        if(password != confirmPassword){
            set({ isLoading:false });
            return toast.error("Password not matched!");
        }
        try{
            const res=await axios.post('/auth/signup',{ name, email, password });
            set({ user:res.data, isLoading:false });
            toast.success("Signup Successfull!");
        }
        catch(error){
            toast.error(error.response?.data?.message || "Failed to signup");
        }
    },

    login:async ({ email, password })=>{
        set({ isLoading:true });
        try{
            const res=await axios.post('/auth/login',{email:email,password:password});
            set({ user:res.data });
            toast.success("Logged In Successfully!");
        }
        catch(error){
            toast.error(error.response.data.message || "Failed to login");
        }
        finally{
            set({ isLoding:false });
        }
    },

    logout:async ()=>{
        try{
            const res=await axios.post('/auth/logout');
            set({ user:null });
            toast.success(res.data.message);
        }
        catch(error){
            toast.error(error.res.data.message || "Failed to logout");
        }
    },

    checkAuth:async ()=>{
        set({ checkingAuth:true });
        try{
            const res=await axios.get('/auth/profile');
            set({ user:res.data });
        }
        catch(error){
            set({ user:null });
        }
        finally{
            set({ checkingAuth:false });
        }
    }
}))