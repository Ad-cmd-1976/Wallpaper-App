import Lowerbar from '../components/Lowerbar'
import Landingpage from '../components/Landingpage'

const HomePage = () => {
    return (
        <>
        <div className='flex flex-col min-h-screen'>
            <Lowerbar/>
            <Landingpage/>
        </div>
        </>
  )
}

export default HomePage