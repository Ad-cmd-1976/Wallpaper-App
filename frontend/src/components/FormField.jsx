import { useThemeStore } from "../store/useThemeStore.js"

const FormField = ({id,content,value,onchange,type="text",name}) => {
   const { theme }=useThemeStore();
  return (
    <div>
        <label htmlFor="email" className='pl-2 text-md'>Email</label>
        <div className='relative'>
            <Mail className='size-6 absolute top-1 left-2 pointer-events-none text-gray-400'/>
            <input 
            onChange={onchange}
            type="text" 
            name="email" 
            id="email" 
            value={value}
            className={`border-2 w-80 sm:w-96 p-1 pl-10 rounded-lg focus:outline-none focus:ring-gray-400 ${theme?"text-gray-400":"text-black"}`}
            />
        </div>
    </div>
  )
}

export default FormField