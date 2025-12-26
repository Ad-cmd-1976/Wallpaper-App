import { useState } from 'react'
import { Link } from 'react-router-dom';
import { Lock, User, Mail, Loader } from 'lucide-react';
import {useThemeStore} from '../store/useThemeStore.js'
import { useAuthStore } from '../store/useAuthStore.js'
import { motion } from 'framer-motion';
import { FcGoogle } from 'react-icons/fc';

const SignupPage = () => {
  const {theme}=useThemeStore();
  const { signup, isloading}=useAuthStore();

  const [signInfo, setsignInfo] = useState({
    name:"",
    email:"",
    password:"",
    confirmPassword:""
  })

  const handleSubmit=async (e)=>{
    e.preventDefault();
    signup(signInfo);
  }

  const handleGoogleLogin=async ()=>{
    window.location.href=`http://localhost:8080/api/auth/google`;
  }

  return (
    <div 
    className={`flex justify-center gap-8 pt-7 sm:pt-11 min-h-screen min-w-full mx-auto ${theme?"bg-white text-gray-400":"bg-black text-white"} `}
    >
      <div className='flex gap-10 flex-col items-center w-full'>
        <div className='flex flex-col gap-4 justify-center items-center w-full'>
          <motion.p
          initial={{opacity:0,y:-20}}
          animate={{opacity:1,y:0}}
          transition={{duration:0.5,delay:0.25}} 
          className='text-xl font-bold'
          >Sign Up</motion.p>
          <motion.form 
          initial={{opacity:0,y:20}}
          animate={{opacity:1,y:0}}
          transition={{duration:0.5,delay:0.25}}
          onSubmit={handleSubmit} 
          className="flex flex-col gap-4"
          >

            <div>
              <label htmlFor="name" className='pl-2 text-md'>Name</label>
              <div className='relative'>
                <User className='size-6 absolute top-1 left-2 pointer-events-none text-gray-400'/>
                <input 
                onChange={(e)=>setsignInfo({...signInfo,name:e.target.value})}
                type="text" 
                name="name" 
                id="name" 
                value={signInfo.name}
                className={`border-2 w-80 sm:w-96 p-1 pl-10 rounded-lg focus:outline-none focus:ring-gray-400 ${theme?"text-gray-400":"text-black"}`}
                />
              </div>
          </div>

          <div>
            <label htmlFor="email" className='pl-2 text-md'>Email</label>
            <div className='relative'>
              <Mail className='size-6 absolute top-1 left-2 pointer-events-none text-gray-400'/>
              <input 
              onChange={(e)=>setsignInfo({...signInfo,email:e.target.value})}
              type="text" 
              name="email" 
              id="email" 
              value={signInfo.email}
              className={`border-2 w-80 sm:w-96 p-1 pl-10 rounded-lg focus:outline-none focus:ring-gray-400 ${theme?"text-gray-400":"text-black"}`}
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className='pl-2 text-md'>Password</label>
            <div className='relative'>
              <Lock className='size-6 absolute top-1 left-2 pointer-events-none text-gray-400'/>
              <input 
              onChange={(e)=>setsignInfo({...signInfo,password:e.target.value})}
              type="password" 
              name="password" 
              id="password" 
              value={signInfo.password}
              className={`border-2 w-80 sm:w-96 p-1 pl-10 rounded-lg focus:outline-none focus:ring-gray-400 ${theme?"text-gray-400":"text-black"}`}
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className='pl-2 text-md'>Confirm Password</label>
            <div className='relative'>
              <Lock className='size-6 absolute top-1 left-2 pointer-events-none text-gray-400'/>
              <input 
              onChange={(e)=>setsignInfo({...signInfo,confirmPassword:e.target.value})}
              type="password" 
              name="confirmPassword" 
              id="confirmPassword" 
              value={signInfo.confirmPassword}
              className={`border-2 w-80 sm:w-96 p-1 pl-10 rounded-lg focus:outline-none focus:ring-gray-400 ${theme?"text-gray-400":"text-black"}`}
              />
            </div>
          </div>
            

          <div className='flex flex-col justify-center items-center gap-5 mt-7'>
            <div>
              <button 
              type="submit"
              className='bg-blue-600 px-auto flex justify-center hover:bg-blue-500 hover:scale-105 transition-all ease-in-out rounded-lg w-80 sm:w-96 py-1'
              disabled={isloading}
              >
                { isloading?
                  <>
                    <Loader className='animate-spin size-6 mr-2'/>
                    Loading...
                  </>
                :
                <span>Sign Up</span>
                }
              </button>
            </div>

            <div className="flex items-center w-80 sm:w-96">
                <hr className="flex-grow border-gray-300" />
                <span className="px-2 text-sm">or</span>
                <hr className="flex-grow border-gray-300" />
            </div>

            <button
              onClick={handleGoogleLogin}
              type="button"
              className="flex items-center justify-center gap-2 border-2 border-gray-300 hover:bg-gray-100 transition-all ease-in-out rounded-lg w-80 sm:w-96 py-2 bg-white text-black font-medium shadow-md"
            >
              <FcGoogle className="size-5" />
              Continue with Google
            </button>

            <span className='text-center'>
              Don't have an account? {" "}
              <Link to='/login' className='text-blue-600 hover:underline hover:text-blue-500'>Login</Link>
            </span>
          </div>
        </motion.form>
      </div>
    </div>
  </div>
  )
}

export default SignupPage