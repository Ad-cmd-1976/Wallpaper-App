import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Lock, Loader } from 'lucide-react';
import { useThemeStore } from '../store/useThemeStore.js';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/useAuthStore.js';

const ResetPassPage = () => {
  const { theme } = useThemeStore();
  const { resetPassword, isloading }=useAuthStore();
  const { token }=useParams();

  const [password, setPassword]=useState("");

  const handleReset=async (e)=>{
    e.preventDefault();
    resetPassword(token, password);
  }

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
            Reset Password
          </motion.p>
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            onSubmit={handleReset}
            className="flex flex-col gap-4"
          >
            <div>
              <label htmlFor="password" className="pl-2 text-md flex justify-between">
                New Password
              </label>
              <div className="relative">
                <Lock className="size-6 absolute top-1 left-2 pointer-events-none text-gray-400" />
                <input
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  type="password"
                  name="password"
                  id="password"
                  value={password}
                  className={`border-2 w-80 sm:w-96 p-1 pl-10 rounded-lg focus:outline-none focus:ring-gray-400 ${
                    theme ? "text-gray-400" : "text-black"
                  }`}
                />
              </div>
            </div>

            <div className="flex flex-col justify-center items-center gap-5 mt-7">
              <div>
                <button
                  onClick={handleReset}
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
                    <span>Proceed</span>
                  )}
                </button>
              </div>
            </div>
          </motion.form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassPage;