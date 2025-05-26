import {useEffect} from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import LoadingSpinner from './components/LoadingSpinner.jsx';
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import SignupPage from './pages/SignupPage.jsx'
import Sidebar from './components/Sidebar'
import { useAuthStore } from './store/useAuthStore.js'
import './App.css'

function App() {
  const { user, checkAuth, checkingAuth }=useAuthStore();

  useEffect(()=>{
    checkAuth();
  },[checkAuth])

  if(checkingAuth && !user) return (<LoadingSpinner/>)

  return (
    <div>
      <Navbar/>
      <Sidebar/>
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
