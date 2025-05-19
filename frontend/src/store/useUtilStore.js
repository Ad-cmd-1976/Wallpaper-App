import { create } from "zustand";

export const useUtilStore=create((set)=>({
    display:false,
    setdisplay:(value)=>{set({display:value});},
}))