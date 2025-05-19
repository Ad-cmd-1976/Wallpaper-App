import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import {useThemeStore} from '../store/useThemeStore.js'
import { useAuthStore } from '../store/useAuthStore.js'

const SignupPage = () => {
  const {theme}=useThemeStore();
  const { signup, isloading}=useAuthStore();

  const [signInfo, setsignInfo] = useState({
    name:"",
    email:"",
    password:"",
    confirmPassword:""
  })

  const navigate=useNavigate();
  const handleChange=(e)=>{
    const {name,value}=e.target;
    const cpysignInfo={...signInfo};
    cpysignInfo[name]=value;
    setsignInfo(cpysignInfo);
  }

  const handleSubmit=async (e)=>{
    e.preventDefault();
    signup(signInfo);
  }

  return (
    <div className={`flex flex-col gap-8 justify-center items-center min-h-screen min-w-full mx-auto  ${theme?"bg-white text-black":"bg-black text-white"}`}>
      <h1 className='font-bold'>Sign Up</h1>
      <form 
      onSubmit={handleSubmit} 
      className='flex flex-col gap-5'
      >
        <div>
          <label htmlFor="name">Name</label>
          <div>
          <input
            onChange={handleChange}
            className='border-2 w-96 p-1 pl-2 rounded-md text-black'
            type='text'
            id='name'
            name='name'
            value={signInfo.name}
          />
          </div>
        </div>
        <div>
          <label htmlFor="name">Email</label>
          <div>
          <input
            onChange={handleChange}
            className='border-2 w-96 p-1 pl-2 rounded-md text-black'
            type='text'
            id='email'
            name='email'
            value={signInfo.email}
          />
          </div>
        </div>
        <div>
          <label htmlFor="name">Password</label>
          <div>
          <input
            onChange={handleChange}
            className='border-2 w-96 p-1 pl-2 rounded-md text-black'
            type='password'
            id='password'
            name='password'
            value={signInfo.password}
          />
          </div>
        </div>

        <div>
          <label htmlFor="name">Confirm Password</label>
          <div>
          <input
            onChange={handleChange}
            className='border-2 w-96 p-1 pl-2 rounded-md text-black'
            type='password'
            id='confirmPassword'
            name='confirmPassword'
            value={signInfo.confirmPassword}
          />
          </div>
        </div>

        <div>
          <button
          className='border-2 bg-blue-600 hover:bg-blue-500 rounded-md w-96 py-1' 
          type="submit">
            Sign Up
          </button>
        </div>

        <span className='text-center'>
          Already have an account?{" "}
          <Link to='/login' className='text-blue-600 hover:underline'>
          Login
          </Link>
        </span>
      </form>
    </div>
  )
}

export default SignupPage