import {useEffect} from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import LoadingSpinner from './components/LoadingSpinner.jsx';
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import SignupPage from './pages/SignupPage.jsx'
import AdminPage from './pages/AdminPage.jsx';
import AuthSuccessPage from './pages/AuthSuccessPage.jsx';
import ResetPassPage from './pages/ResetPassPage.jsx';
import DownloadOverlay from './components/DownloadOverlay.jsx';
import { useAuthStore } from './store/useAuthStore.js'
import { useThemeStore } from './store/useThemeStore.js';
import { useImageStore } from './store/useImageStore.js';
import './App.css'

function App() {
  const { user, checkAuth, checkingAuth }=useAuthStore();
  const { isDownloading }=useImageStore();
  const { theme }=useThemeStore();

  useEffect(()=>{
    checkAuth();
  },[checkAuth])

  if(checkingAuth && !user) return (<LoadingSpinner/>)

  return (
    <div className={`${theme?"bg-white text-gray-400":"bg-black text-white"} min-h-full`}>
      {isDownloading && <DownloadOverlay/>}
      <Navbar/>
      <div className='pt-16 min-h-screen'>
        <Routes>
          <Route path='/' element={<HomePage/>}></Route>
          <Route path='/login' element={!user?<LoginPage/>:<Navigate to='/' />}></Route>
          <Route path='/signup' element={!user?<SignupPage/>:<Navigate to='/' />}></Route>
          <Route path='/admin-dashboard' element={user?.role==="admin" ? <AdminPage/> : <Navigate to='/'/>}></Route>
          <Route path='/auth/success' element={<AuthSuccessPage/>}></Route>
          <Route path='/reset-password/:token' element={<ResetPassPage/>}/>
        </Routes>
      </div>
      <Toaster />
    </div>
  )
}

export default App
