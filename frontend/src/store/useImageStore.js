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

    downloadImage:async (publicId)=>{
        try{
            const response=await axios.get(`/images/download/${publicId}`,{
                responseType:'blob',
            });
            const url=window.URL.createObjectURL(new Blob([response.data]));
            const link=document.createElement('a');
            link.href=url;
            link.setAttribute('download', `${publicId}.jpg`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        }
        catch(error){
            if(error.response && error.response.data instanceof Blob){
                const reader=new FileReader();
                reader.onload=()=>{
                    try{
                        const json=JSON.parse(reader.result);
                        toast.error(json.message || "Download Failed json error");
                    }
                    catch(e){
                        toast.error("non-json error");
                    }
                }
                reader.readAsText(error.response.data);
            }
            else toast.error(error.message || "Download Failed!");
            console.log("Error in downloadImage function", error.message);
        }
    },

    uploadImage:async (imageData)=>{
        set({ isLoading:true });
        try{
            const res=await axios.post('/images/upload', imageData);
            toast.success(res.data.message);
        }
        catch(error){
            console.log("Error in uploadImage function of useImageStore",error.message);
        }
        finally{
            set({ isLoading:false });
        }
    }
}))