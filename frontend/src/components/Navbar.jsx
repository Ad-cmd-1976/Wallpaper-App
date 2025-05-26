import { useState } from "react";
import Line from "../assets/line";
import { Link } from "react-router-dom";
import { toast } from 'react-hot-toast';
import { useThemeStore } from "../store/useThemeStore.js";
import { useAuthStore } from "../store/useAuthStore.js";
import { useUtilStore } from "../store/useUtilStore.js";
import { useImageStore } from "../store/useImageStore.js";
import { Menu, Sun, Moon, Search, LogOut, LogIn } from 'lucide-react';

const Navbar = () => {
  const [searchVal, setsearchVal] = useState("");
  const { user, logout }=useAuthStore();
  const { theme, setTheme }=useThemeStore();
  const { display, setdisplay }=useUtilStore();
  const { setimageList, nextCursor, setnextCursor, searchImages}=useImageStore();

  const changeTheme = (theme) => {
    setTheme(!theme);
  };

  const changeDisplay=()=>{
    setdisplay(!display);
  };

  const handleLogout=async ()=>{
    logout();
  };

  const handleSubmit=async (e)=>{
    e.preventDefault();
    try{
      const response=await searchImages(searchVal,nextCursor);
      setimageList(response.resources);
      setnextCursor(response.next_cursor);
    }
    catch(error){
      toast.error(error.response.data.message || "Failed to load images!");
    }
  }
  
  return (
    <div
      className={`${
        theme ? "text-gray-300" : "bg-black text-white"
      } border-2 border-green-500 w-full`}
    >
      <div className="flex flex-wrap justify-between p-4">
        <div className="flex items-center gap-3">
          <div onClick={changeDisplay} className="pt-1">
            <Menu className="size-6 sm:size-7"/>
          </div>
          <Link to='/' className="text-xl sm:text-2xl lg:text-3xl flex items-center font-bold text-blue-700">
            Freepixz
          </Link>
        </div>


        <div className="flex flex-wrap items-center pt-1 gap-2 sm:gap-4">
          <div className="text-sm sm:text-lg">
            <Link
              href="/plus"
              className={`${theme ? 'decoration-gray-400' : 'decoration-white'} font-bold bg-gradient-to-r from-pink-500 via-yellow-500 to-cyan-500 bg-[length:200%_auto] animate-gradient bg-clip-text text-transparent text-md lg:text-lg`}
            >
              Get FreePixz+
            </Link>
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
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-2 w-full px-4 pb-4">
        <div className={`flex items-center bg-white rounded-2xl w-full sm:w-[75%] px-2 py-1 border-2 ${theme?"border-gray-300": "border-white"}`}>
          <Search color={theme ? "gray" : "black"} />
          <input
            onChange={(e) => setsearchVal(e.target.value)}
            className="w-full bg-white text-gray-400 outline-none ml-2 text-sm"
            value={searchVal}
            type="search"
            placeholder="Search Photos and Wallpapers"
          />
        </div>
        <div className="w-full sm:w-auto">
          <button
            className="bg-blue-700 w-full sm:w-auto px-3 py-1 rounded-xl hover:bg-blue-600"
            type="submit"
          >
            Search
          </button>
        </div>
      </form>
    </div>
  );
};

export default Navbar;
