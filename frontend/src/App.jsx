import {useEffect} from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import LoadingSpinner from './components/LoadingSpinner.jsx';
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import SignupPage from './pages/SignupPage.jsx'
import AdminPage from './pages/AdminPage.jsx';
import PrivacyPolicy from './pages/PrivacyPolicy.jsx';
import { useAuthStore } from './store/useAuthStore.js'
import RefundPolicy from './pages/RefundPolicy.jsx';
import ShippingPolicy from './pages/ShippingPolicy.jsx';
import TermsAndConditions from './pages/TermsAndConditions.jsx';
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
      <Routes>
        <Route path='/' element={<HomePage/>}></Route>
        <Route path='/login' element={!user?<LoginPage/>:<Navigate to='/' />}></Route>
        <Route path='/signup' element={!user?<SignupPage/>:<Navigate to='/' />}></Route>
        <Route path='/admin-dashboard' element={user?.role==="admin" ? <AdminPage/> : <Navigate to='/'/>}></Route>
        <Route path='/privacy-policy' element={<PrivacyPolicy/>}></Route>
        <Route path='/refund-policy' element={<RefundPolicy/>}></Route>
        <Route path='/shipping-policy' element={<ShippingPolicy/>}></Route>
        <Route path='/terms-and-conditions' element={<TermsAndConditions/>}></Route>
      </Routes>
      <Toaster />
    </div>
  )
}

export default App
