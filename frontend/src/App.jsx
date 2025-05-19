import {useEffect, useState} from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { Loader } from 'lucide-react'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import SignupPage from './pages/SignupPage.jsx'
import RefreshHandler from './RefreshHandler'
import Sidebar from './components/Sidebar'
import { useAuthStore } from './store/useAuthStore.js'
import './App.css'

function App() {
  const { user, checkAuth, checkingAuth }=useAuthStore();

  useEffect(()=>{
    checkAuth();
  },[checkAuth])

  if(checkingAuth && !user){
    return (
      <div className='flex justify-center items-center h-screen'>
        <Loader className='size-10 animate-spin'/>
      </div>
    )
  }

  return (
    <div>
      <Navbar/>
      <Sidebar/>
      <RefreshHandler/>
      <Routes>
        <Route path='/' element={<HomePage/>}></Route>
        <Route path='/login' element={!user?<LoginPage/>:<Navigate to='/' />}></Route>
        <Route path='/signup' element={!user?<SignupPage/>:<Navigate to='/' />}></Route>
      </Routes>
      <Toaster />
    </div>
  )
}

export default App
