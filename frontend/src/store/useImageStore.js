import {create} from 'zustand';
import { toast } from 'react-hot-toast';

const API_URL=import.meta.env.VITE_URL;

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
            const response=await fetch(`${API_URL}/photos?${params}`);
            const result=response.json();
            return result;
        }
        catch(error){
            toast.error(error.response?.data?.message || "Failed to fetch images!");
        }
        finally{
            set({ isLoading:false });
        }
    },

    searchImages:async (searchVal,nextCursor)=>{
        const params=new URLSearchParams();
        params.append('expression',searchVal);
        if(nextCursor){
            params.append('next_cursor',nextCursor)
        }
        try{
            const response=await fetch(`${API_URL}/search?${params}`);
            const result=await response.json();
            return result;
        }catch(error){
            toast.error(error.response.data.message || "Failed to fetch images!");
        }
    },
}))