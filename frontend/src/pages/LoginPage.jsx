import {useState} from 'react';
import { Link } from 'react-router-dom';
import {useThemeStore} from '../store/useThemeStore.js';
import { useAuthStore } from '../store/useAuthStore.js';
const LoginPage = () => {
  const {theme}=useThemeStore();

  const {login,isLoading}=useAuthStore();

  const [loginInfo, setloginInfo] = useState({
    email:"",
    password:""
  })

  const handleChange=(e)=>{
    const {name,value}=e.target;
    const cpyloginInfo={...loginInfo};
    cpyloginInfo[name]=value;
    setloginInfo(cpyloginInfo);
  }

  const handlelogin=async (e)=>{
    e.preventDefault();
    login(loginInfo);
  }
  
  return (
    <div 
    className={`flex flex-col gap-8 justify-center items-center min-h-screen min-w-full mx-auto ${theme?"bg-white text-black":"bg-black text-white"} `}
    >
      <h1 className='font-bold'>Login</h1>
      <form 
      onSubmit={handlelogin} 
      method="post"
      className='flex flex-col gap-5'
      >
        <div>
          <label htmlFor="email">Email</label>
          <div>
          <input 
          onChange={handleChange}
          type="text" 
          name="email" 
          id="email" 
          value={loginInfo.email}
          className='border-2 w-96 p-1 pl-2 rounded-md text-black'
          autoFocus
          />
          </div>
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <div>
          <input 
          onChange={handleChange}
          type="password" 
          name="password" 
          id="password" 
          value={loginInfo.password}
          className='border-2 w-96 p-1 pl-2 rounded-md text-black'
          autoFocus
          />
          </div>
        </div>

        <div>
          <button 
          type="submit"
          className='border-2 bg-blue-600 hover:bg-blue-500 rounded-md w-96 py-1'
          >
            Login
          </button>
        </div>

        <span className='text-center'>
          Don't have an account? {" "}
          <Link to='/signup' className='text-blue-600 hover:underline'>Signup</Link>
        </span>
      </form>
    </div>
  )
}

export default LoginPage