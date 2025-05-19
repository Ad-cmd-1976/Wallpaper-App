import {create} from 'zustand'

export const useImageStore=create((set)=>({
    imageList:[],
    nextCursor:null,



    setnextCursor:(next_cursor)=>set({nextCursor:next_cursor}),
    setimageList:(images)=>set({imageList:images}),
}))