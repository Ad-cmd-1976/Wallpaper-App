import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock, Mail, Loader } from 'lucide-react';
import { useThemeStore } from '../store/useThemeStore.js';
import { useAuthStore } from '../store/useAuthStore.js';
import { motion } from 'framer-motion';
import { FcGoogle } from 'react-icons/fc'; 

const LoginPage = () => {
  const { theme } = useThemeStore();
  const { login, isloading, forgetPassword } = useAuthStore();

  const [loginInfo, setloginInfo] = useState({
    email: "",
    password: ""
  });

  const handlelogin = async (e) => {
    e.preventDefault();
    login(loginInfo);
  };

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`; 
  };

  return (
    <div
      className={`flex justify-center gap-8 pt-7 sm:pt-11 min-h-screen min-w-full mx-auto ${
        theme ? "bg-white text-gray-400" : "bg-black text-white"
      } `}
    >
      <div className="flex gap-10 flex-col items-center w-full">
        <div className="flex flex-col gap-4 justify-center items-center w-full">
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="text-xl font-bold"
          >
            Login
          </motion.p>
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            onSubmit={handlelogin}
            className="flex flex-col gap-4"
          >
            <div>
              <label htmlFor="email" className="pl-2 text-md">
                Email
              </label>
              <div className="relative">
                <Mail className="size-6 absolute top-1 left-2 pointer-events-none text-gray-400" />
                <input
                  onChange={(e) =>
                    setloginInfo({ ...loginInfo, email: e.target.value })
                  }
                  type="text"
                  name="email"
                  id="email"
                  value={loginInfo.email}
                  className={`border-2 w-80 sm:w-96 p-1 pl-10 rounded-lg focus:outline-none focus:ring-gray-400 ${
                    theme ? "text-gray-400" : "text-black"
                  }`}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="pl-2 text-md flex justify-between">
                <span>Password</span>
                <span className='hover:underline cursor-pointer' onClick={()=> forgetPassword(loginInfo.email)}>Forgot your password?</span>
              </label>
              <div className="relative">
                <Lock className="size-6 absolute top-1 left-2 pointer-events-none text-gray-400" />
                <input
                  onChange={(e) =>
                    setloginInfo({ ...loginInfo, password: e.target.value })
                  }
                  type="password"
                  name="password"
                  id="password"
                  value={loginInfo.password}
                  className={`border-2 w-80 sm:w-96 p-1 pl-10 rounded-lg focus:outline-none focus:ring-gray-400 ${
                    theme ? "text-gray-400" : "text-black"
                  }`}
                />
              </div>
            </div>

            <div className="flex flex-col justify-center items-center gap-5 mt-7">
              <div>
                <button
                  type="submit"
                  className="bg-blue-600 flex justify-center items-center hover:bg-blue-500 hover:scale-105 transition-all ease-in-out rounded-lg w-80 sm:w-96 py-1"
                  disabled={isloading}
                >
                  {isloading ? (
                    <>
                      <Loader className="size-6 animate-spin mr-2" />
                      Loading...
                    </>
                  ) : (
                    <span>Login</span>
                  )}
                </button>
              </div>
              
              <div className="flex items-center w-80 sm:w-96">
                <hr className="flex-grow border-gray-300" />
                <span className="px-2 text-sm">or</span>
                <hr className="flex-grow border-gray-300" />
              </div>

              <button
                onClick={handleGoogleLogin}
                disabled={isloading}
                type="button"
                className="flex items-center justify-center gap-2 border-2 border-gray-300 hover:bg-gray-100 transition-all ease-in-out rounded-lg w-80 sm:w-96 py-2 bg-white text-black font-medium shadow-md"
              >
                <FcGoogle className="size-5" />
                Continue with Google
              </button>

              <span className="text-center" disabled={isloading}>
                Don&apos;t have an account?{" "}
                <Link
                  to="/signup"
                  className="text-blue-600 hover:underline hover:text-blue-500"
                >
                  Signup
                </Link>
              </span>
            </div>
          </motion.form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;