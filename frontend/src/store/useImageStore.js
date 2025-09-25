import {create} from 'zustand';
import { toast } from 'react-hot-toast';
import axios from '../lib/axios.js';


export const useImageStore=create((set, get)=>({
    imageList:[],
    isLoading:false,
    page:1,
    limit:10,
    searchVal:'',
    hasMore: true,
    setsearchVal:(val)=>set({ searchVal:val }),

    resetToHome:async ()=>{
        set({ searchVal:'', imageList:[], page:1 });
        await get().getImages(1);
    },

    getImages:async (page=1)=>{
        const { searchVal }=get();
        if(searchVal) return await get().searchImages(searchVal,page);

        set({ isLoading:true });
        try{
            const params=new URLSearchParams();
            params.append("page", page);
            params.append("limit", get().limit);
            const response=await axios.get('/images/getImages', { params:params });

            const newImages=response.data.images;

            set((state)=>({
                imageList: page===1 ? newImages : [...state.imageList,...newImages],
                page,
                hasMore: newImages.length>0
            }))
        }
        catch(error){
            toast.error(error.response?.data?.message || "Failed to fetch images!");
        }
        finally{
            set({ isLoading:false });
        }
    },

    searchImages:async (searchVal,page=1,limit=10)=>{
        set({ isLoading:true });
        try{
            const params=new URLSearchParams();
            params.append('q',searchVal);
            params.append('page', page);
            params.append('limit', limit);
            const response=await axios.get('/images/search',{ params:params });

            set((state)=>({
                imageList: page===1 ? response.data.resources : [...state.imageList,...response.data.resources],
                searchVal:searchVal
            }))
        }
        catch(error){
            toast.error(error.response.data.message || "Failed to fetch images!");
        }
        finally{
            set({ isLoading:false });
        }
    },

    downloadImage:async (publicId)=>{
        set({})
        try{
            const params=new URLSearchParams();
            params.append("publicId", publicId);
            const response=await axios.get(`/images/download`,{
                responseType:'blob',
                params:params,
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
            
            if(imageData.isPremium){
                try{
                    const formData=new FormData();
                    formData.append('file', image);
                    formData.append('title', imageData.title);
                    formData.append('tags', imageData.tags.split(",").map(tag => tag.trim()).filter(Boolean));
                    formData.append('price', imageData.price);
                    formData.append('discountPercentage', imageData.discountPercentage);
                    formData.append('isPremium', imageData.isPremium);
                    
                    const res=await axios.post('/images/plus-upload', formData, { withCredentials:true });
                    toast.success(res.data.message);
                }
                catch(error){
                    console.log("Error in uploading plus image", error);
                }
            }
            else{
                try{
                    let updatedData={};
                    try{
                        const res=await axios.post('/images/pre-sign', {
                            fileName: image.name,
                            fileType: image.type
                        }, { withCredentials: true});

                        const { uploadUrl, fileUrl, publicId }=res.data;
                        await axios.put(uploadUrl, image, { headers:{ "Content-Type" : image.type } });

                        updatedData={
                            ...imageData,
                            imageUrl:fileUrl,
                            previewUrl:fileUrl,
                            publicId: publicId,
                            tags:imageData.tags.split(",").map(tag => tag.trim()).filter(Boolean)
                        }
                    }
                    catch(error){
                        console.error("Aws upload failed:", error);
                    }
                    const res=await axios.post('/images/upload', updatedData, { withCredentials:true });
                    toast.success(res.data.message);
                }
                catch(error){
                    console.log("Error in uploadImage function from useImageStore", error);
                }
            }
        }
        catch(error){
            console.log("Error in uploadImage function of useImageStore", error);
        }   
        finally{
            set({ isLoading:false });
        }
    }
}))