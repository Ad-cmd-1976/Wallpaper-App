import {create} from 'zustand';
import { toast } from 'react-hot-toast';
import axios from '../lib/axios.js';


export const useImageStore=create((set)=>({
    imageList:[],
    isLoading:false,
    nextCursor:null,
    setnextCursor:(next_cursor)=>set({nextCursor:next_cursor}),
    setimageList:(images)=>set({imageList:images}),

    getImages:async (next_cursor)=>{
        set({ isLoading:true });
        try{
            const params=new URLSearchParams();
            if(next_cursor){
                params.append('next_cursor',next_cursor);
            }
            const response=await axios.get('/images/getImages', { params:params });
            return response.data;
        }
        catch(error){
            toast.error(error.response?.data?.message || "Failed to fetch images!");
        }
        finally{
            set({ isLoading:false });
        }
    },

    searchImages:async (searchVal)=>{
        set({ isLoading:true });
        try{
            const params=new URLSearchParams();
            params.append('expression',searchVal);
            // if(nextCursor){
            //     params.append('next_cursor',nextCursor)
            // }
            const response=await axios.get('/images/search',{ params:params });
            return response.data;
        }
        catch(error){
            toast.error(error.response.data.message || "Failed to fetch images!");
        }
        finally{
            set({ isLoading:false });
        }
    },
}))