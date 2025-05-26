import { Loader } from "lucide-react"
import { useThemeStore } from "../store/useThemeStore.js"

const LoadingSpinner = () => {
    const { theme }=useThemeStore()
  return (
    <div className={`${theme ? "text-gray-400" : "bg-black text-white"} flex justify-center items-center min-h-screen`}>
        <Loader className="animate-spin size-6"/>
    </div>
  )
}

export default LoadingSpinner