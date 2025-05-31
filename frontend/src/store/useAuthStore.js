import {create} from 'zustand';
import { toast } from 'react-hot-toast';
import axios from '../lib/axios.js'

export const useAuthStore=create((set,get)=>({
    user:null,
    isloading:false,
    checkingAuth:false,

    signup:async({ name, email, password, confirmPassword})=>{
        set({ isloading:true });

        if(password != confirmPassword){
            set({ isloading:false });
            return toast.error("Password not matched!");
        }
        try{
            const res=await axios.post('/auth/signup',{ name, email, password });
            set({ user:res.data });
            toast.success("Signup Successfull!");
        }
        catch(error){
            toast.error(error.response?.data?.message || "Failed to signup");
        }
        finally{
            set({ isloading:false });
        }
    },

    login:async ({ email, password })=>{
        set({ isloading:true });
        try{
            const res=await axios.post('/auth/login',{email:email,password:password});
            set({ user:res.data });
            toast.success("Logged In Successfully!");
        }
        catch(error){
            toast.error(error.response.data.message || "Failed to login");
        }
        finally{
            set({ isloading:false });
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