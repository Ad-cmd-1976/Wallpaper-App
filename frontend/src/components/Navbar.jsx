import Line from "../assets/line";
import { Link } from "react-router-dom";
import { useThemeStore } from "../store/useThemeStore.js";
import { useAuthStore } from "../store/useAuthStore.js";
import { useUtilStore } from "../store/useUtilStore.js";
import { Sun, Moon, LogOut, LogIn, Lock } from 'lucide-react';
import { usePurchaseStore } from "../store/usePurchaseStore.js";

const Navbar = () => {
  const { user, logout }=useAuthStore();
  const { theme, setTheme }=useThemeStore();
  const { buyPlus }=usePurchaseStore();
  const { display, setdisplay }=useUtilStore();

  const changeTheme = (theme) => {
    setTheme(!theme);
  };

  const handleLogout=async ()=>{
    logout();
  };
  
  return (
    <div
      className={`${
        theme ? "text-gray-300" : "bg-black text-white"
      } border-2 border-green-500 w-full`}
    >
      <div className="flex flex-wrap justify-between p-4">
        <div className="flex items-center">
          <Link to='/' className="text-xl sm:text-2xl lg:text-3xl flex items-center font-bold text-blue-700">
            Freepixz
          </Link>
        </div>


        <div className="flex flex-wrap items-center pt-1 gap-2 sm:gap-4">
          <div className="text-sm sm:text-lg">
            <button
              onClick={()=>buyPlus()}
              className={`${theme ? 'decoration-gray-400' : 'decoration-white'} font-bold bg-gradient-to-r from-pink-500 via-yellow-500 to-cyan-500 bg-[length:200%_auto] animate-gradient bg-clip-text text-transparent text-md lg:text-lg`}
            >
              Get FreePixz+
            </button>
          </div>

          <div onClick={() => changeTheme(theme)} className="cursor-pointer">
            {theme?<Moon/>:<Sun/>}
          </div>

          <div>
            <Line/>
          </div>

          <div>
            { user ? (
              <button onClick={handleLogout} className="bg-blue-700 px-2 rounded-xl py-1 hover:bg-blue-600 flex justify-center items-center">
                <LogOut className="size-4 sm:size-5"/>
                <span className="hidden sm:inline text-white">Logout</span>
              </button>
            ):(
              <Link to='/login' className="bg-blue-700 px-2 rounded-xl py-1 hover:bg-blue-600 flex justify-center items-center gap-1">
                <LogIn className="size-4 sm:size-5" />
                <span className="hidden sm:inline">Log In</span>
              </Link>
            )}
          </div>
          { user?.role==="admin" && (
              <Link to='/admin-dashboard' className="bg-blue-700 px-2 rounded-xl py-1 hover:bg-blue-600 flex justify-center items-center gap-1">
                <Lock className="size-4 sm:size-5" />
                <span className="hidden sm:inline">Admin</span>
              </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
