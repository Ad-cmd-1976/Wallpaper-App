import {useState, useEffect} from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from './store/useAuthStore';

const RefreshHandler = () => {
    const {setauthUser}=useAuthStore();

    const location=useLocation();
    const navigate=useNavigate();
    useEffect(() => {
      if(localStorage.getItem('token')){
        setauthUser(true);
        if(location.pathname==='/' || location.pathname==='/login' || location.pathname==='/signup'){
            navigate('/',{replace:false});
        }
      }
    }, [location,navigate,setauthUser])
    
  return (
    null
  )
}

export default RefreshHandler