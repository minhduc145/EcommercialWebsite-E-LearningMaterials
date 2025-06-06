import '@/app/assets/css/products/products.css'
import '@/app/assets/js/globals.js'
import Image from 'next/image'
import FeaturedCarousel from './components/features-carousel'
import NewestCourseCarousel from './components/newest'
import TotalCourses from './components/total'

export default function Courses() {

  return (
    <div className='min-h-dvh'>
      <div className="banner m-0 p-0 inset-x-0 top-0 w-full h-80 bg-[#001d74] rounded-bl-3xl rounded-br-3xl bg-left flex">
        <div className='m-auto text-white'>
          <h1 className="text-white text-xl md:text-2xl font-normal drop-shadow-sm">
            Chào mừng bạn đến với
          </h1>
          <h2 className="text-6xl md:text-7xl font-extrabold bg-gradient-to-r from-sky-400 to-indigo-600 bg-clip-text text-transparent drop-shadow-xl uppercase tracking-wide">
            e-Edu
          </h2>
        </div>
        <Image className='m-auto max-w-100 h-auto w-[80%] hidden lg:block' width={500} height={500} src='/global_imgs/dummy-slide-min.png' alt="" />
      </div>
      <br />
      <main>
        <div className="container mx-auto px-4">

          <div className='mb-10'>
            <FeaturedCarousel />
          </div>
          <div className='mb-10'>
            <NewestCourseCarousel />
          </div>
          <div>
            <TotalCourses />
          </div>
        </div>
      </main>
    </div>
  )
}
