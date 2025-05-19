import React,{useState} from 'react'
import { useThemeStore } from '../store/useThemeStore'
import { useUtilStore } from '../store/useUtilStore';

const Sidebar = () => {
    const {theme}=useThemeStore();
    const {display}=useUtilStore();
  const [side, setside] = useState(1);
  return (
    <div id='sidebar' className={`${theme ? "text-gray-400 border-gray-400 bg-gray-50" : "bg-black text-white border-white"} absolute top-16 left-3 w-[30vw] min-h-fit ${display?'flex':'hidden'} p-4 justify-around  border-2 rounded-xl gap-1 transition-all`}>
        <div id='company'>
            <span className='font-bold'>Company</span>
            <div id='company-section' className='flex flex-col gap-y-2'>
                <a href="#" className={theme ? 'decoration-gray-400' : 'decoration-white'}>About</a>
                <a href="#" className={theme ? 'decoration-gray-400' : 'decoration-white'}>History</a>
                <a href="#" className={theme ? 'decoration-gray-400' : 'decoration-white'}>Join the team</a>
                <a href="#" className={theme ? 'decoration-gray-400' : 'decoration-white'}>Blog</a>
                <a href="#" className={theme ? 'decoration-gray-400' : 'decoration-white'}>Press</a>
                <a href="#" className={theme ? 'decoration-gray-400' : 'decoration-white'}>Contact Us</a>
                <a href="#" className={theme ? 'decoration-gray-400' : 'decoration-white'}>Help center</a>
            </div>
        </div>
        <div id='community'>
            <span className='font-bold'>Community</span>
            <div id='company-section' className='flex flex-col gap-y-2'>
                <a href="#" className={theme ? 'decoration-gray-400' : 'decoration-white'}>Become a contributor</a>
                <a href="#" className={theme ? 'decoration-gray-400' : 'decoration-white'}>Collections</a>
                <a href="#" className={theme ? 'decoration-gray-400' : 'decoration-white'}>Trends</a>
                <a href="#" className={theme ? 'decoration-gray-400' : 'decoration-white'}>Stats</a>
                <a href="#" className={theme ? 'decoration-gray-400' : 'decoration-white'}>Topics</a>
            </div>
        </div>
        <div id='explore'>
            <span className='font-bold'>Explore</span>
            <div id='company-section' className='flex flex-col gap-y-2'>
                <a href="#" className={theme ? 'decoration-gray-400' : 'decoration-white'}>Today</a>
                <a href="#" className={theme ? 'decoration-gray-400' : 'decoration-white'}>Images</a>
                <a href="#" className={theme ? 'decoration-gray-400' : 'decoration-white'}>Background</a>
                <a href="#" className={theme ? 'decoration-gray-400' : 'decoration-white'}>Wallapepers</a>
            </div>
        </div>
    </div>
  )
}

export default Sidebar