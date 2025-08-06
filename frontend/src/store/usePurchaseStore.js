import { create } from 'zustand';
import axios from '../lib/axios';

export const usePurchaseStore=create((set,get)=>({
    purchaseIds:[],
    getPurchaseIds:async ()=>{
        try{
            const response=await axios.get('/purchase/list');
            console.log(response);
            set({ purchaseIds:response.data.purchaseIds });
        }
        catch(error){
            console.log("Error in getPurchasedId fumction in usePurchase controller!",error);
        }
    }
}))