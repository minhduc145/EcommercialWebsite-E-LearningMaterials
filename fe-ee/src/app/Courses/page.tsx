'use client'
import '@/app/assets/css/products/products.css'
import '@/app/assets/js/globals.js'
import { CourseModel } from "../../models/CourseModel"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import getAllCourses, { getFeaturesSummary } from '../api/api-courses';

export default function Courses() {

  return (
    <div className=' min-h-dvh'>
      <div className="banner m-0 p-0 inset-x-0 top-0 w-full h-96 bg-[#001d74] rounded-bl-3xl rounded-br-3xl bg-left">
        <div className="grid w-full h-80 grid-cols-1 inset-x-0 lg:grid-cols-2">
          <div className='m-auto text-white'>
            <p className='text-3xl'>Chào mừng bạn đến với</p>
            <p className='text-5xl mt-3'>e-Edu</p>
          </div>
          <div className="s2-col">
            <img className='m-auto' width='570' src='/global_imgs/dummy-slide-min.png' alt="" />
          </div>
        </div>
      </div>
      <br />
      <main>
        <div className="container mx-auto px-4">
          
          <div>
            <FeaturedCarousel />
          </div>
        
        </div>
      </main>
    </div>
  )
}

import { cn } from "@/lib/utils"
import { StarRating } from '@/components/ui/star-rating'
import { CourseBasicDTO } from '@/models/CourseBasicDTO'
import Link from 'next/link'

function FeaturedCarousel() {
  const [features, setFeatures] = useState<CourseBasicDTO[]>([])
  const [api, setApi] = useState<any>()
  const [current, setCurrent] = useState(0)
  const [isMouseOn, setIsMouseOn] = useState(false)

  useEffect(()=>{
    getFeaturesSummary().then(res=>{
      if(res?.data){
        setFeatures(res.data)
      }
    }).catch()
  },[])

  // Set up autoplay
  useEffect(() => {
    if (!api ) return

    const interval = setInterval(() => {
      !isMouseOn && api.scrollNext()
    }, 5000)

    return () => clearInterval(interval)
  }, [api, isMouseOn])

  // Update current index when carousel changes
  useEffect(() => {
    if (!api) return

    const onChange = () => {
      setCurrent(api.selectedScrollSnap())
    }

    api.on("select", onChange)
    return () => api.off("select", onChange)
  }, [api])

  return (
    <div className="w-full px-2 ">
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold px-2 sm:px-4 md:px-6 py-3 md:py-4">
        CÁC HỌC LIỆU NỔI BẬT
      </h2>

      <Carousel setApi={setApi} className="w-full mx-auto" onMouseEnter={()=>setIsMouseOn(true)} onMouseLeave={()=>setIsMouseOn(false)} opts={{loop:true}}>
        <CarouselContent>
          {features.map((slide, index) => (
            <CarouselItem key={index}>
              <div
                className="aspect-[4/3] sm:aspect-[16/9] md:aspect-[16/7] lg:aspect-[16/5] rounded-lg overflow-hidden relative"
                style={{
                  backgroundImage: `url(${slide.thumbnail_url})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent sm:from-black/70 sm:to-transparent"></div>

                <div className="relative h-full flex items-center">
                  <div className="w-full md:w-[85%] lg:w-[70%] p-3 sm:p-5 md:p-8 lg:p-10 md:mx-10 space-y-2 sm:space-y-3 md:space-y-4 z-10 text-white">
                    <div className="bg-green-500 w-fit font-bold italic text-white text-xs sm:text-sm md:text-base px-2 sm:px-3 md:px-4 py-0.5 md:py-1 rounded-full">
                       {slide.price ?(slide.price).toLocaleString("vi-VN")+' ₫':'Miễn phí'}
                      </div>

                    <h3 className="text-xl sm:text-2xl md:text-4xl font-bold leading-tight break-words line-clamp-2">
                      {slide.title}
                    </h3>
                    <p className="text-sm sm:text-base md:text-xl break-words line-clamp-2 italic">{slide.category_name}</p>

                    <div className="flex items-center gap-1 sm:gap-2">
                      <StarRating rating={slide.average_rating} />
                      <span className="text-xs sm:text-sm opacity-90">({slide.comment_count} đánh giá)</span>
                    </div>

                    <Link href={`/Courses/${slide.id}`} className="w-fit mt-2 sm:mt-3 md:mt-4 text-xs sm:text-sm md:text-base rounded-full bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-1 sm:py-2 h-sm">
                      Xem chi tiết
                    </Link>
                  </div>

                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Responsive navigation buttons */}
        <CarouselPrevious className="left-1 sm:left-2 md:left-4 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gray-400/40 hover:bg-gray-400/60 text-white border-none" />
        <CarouselNext className="right-1 sm:right-2 md:right-4 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gray-400/40 hover:bg-gray-400/60 text-white border-none" />

        {/* Dots indicator */}
        <div className="absolute hidden md:inline-block bottom-2 sm:bottom-3 md:bottom-4 left-1/2 -translate-x-1/2 flex space-x-1 sm:space-x-2 z-20">
          {features.map((_, index) => (
            <button
              key={index}
              className={cn(
                "w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 rounded-full transition-all",
                index === current ? "bg-white scale-125" : "bg-white/50 hover:bg-white/70",
              )}
              onClick={() => api?.scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </Carousel>
    </div>
  )
}
