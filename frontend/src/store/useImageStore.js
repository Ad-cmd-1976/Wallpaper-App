import {create} from 'zustand';
import { toast } from 'react-hot-toast';
import axios from '../lib/axios.js';


export const useImageStore=create((set, get)=>({
    imageList:[],
    isLoading:false,
    page:1,
    limit:10,

    getImages:async (page=1)=>{
        set({ isLoading:true });
        try{
            const params=new URLSearchParams();
            params.append("page", page);
            params.append("limit", get().limit);
            const response=await axios.get('/images/getImages', { params:params });

            set((state)=>({
                imageList: page===1 ? response.data.images : [...state.imageList,...response.data.images],
                page
            }))
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

    uploadImage:async (image,imageData)=>{
        set({ isLoading:true });
        
        try {
            if(!image || !imageData.title) return toast.error("Image and title are required!");
            const formData = new FormData();
            formData.append("file", image);
            formData.append("upload_preset", "wallpaper_upload");
            formData.append("folder", "wallpapers");
            let updatedData={};
            try{
                const res = await axios.post(`https://api.cloudinary.com/v1_1/djtrvpcnf/image/upload`, formData, {
                    withCredentials:false
                });
                updatedData={
                    ...imageData,
                    imageUrl:res.data.secure_url,
                    publicId:res.data.public_id,
                    tags:imageData.tags.split(",").map(tag => tag.trim()).filter(Boolean)
                }
            }
            catch(error){
                console.error("Cloudinary upload failed:", error);
            }
            const res=await axios.post('/images/upload', updatedData);
            toast.success(res.data.message);
        } 
        catch (error) {
            console.log("Error in handle upload:", error);
        }
        finally{
            set({ isLoading:false });
        }
    }
}))