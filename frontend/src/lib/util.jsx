const API_URL=import.meta.env.VITE_URL;

export const getImages=async (next_cursor)=>{
    const params=new URLSearchParams();
    if(next_cursor){
        params.append('next_cursor',next_cursor);
    }
    const response=await fetch(`${API_URL}/photos?${params}`);
    const result=response.json();
    return result;
}
export const searchImages=async (searchVal,nextCursor)=>{
    const params=new URLSearchParams();
    params.append('expression',searchVal);
    if(nextCursor){
        params.append('next_cursor',nextCursor)
    }
    try{
        const response=await fetch(`${API_URL}/search?${params}`);
        const result=await response.json();
        return result;
    }catch(err){
        console.log(err);
    }
}