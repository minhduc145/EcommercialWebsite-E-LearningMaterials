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
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import getAllCourses from '../api/api-courses';
import MusicVideoCarousel from '@/components/music-video-carousel'

export default function Courses() {
  const [courses, setCourses] = useState<CourseModel[]>([])
  useEffect(() => {
    getAllCourses().then((response) => {
      console.log(response)
      setCourses(response?.data)
    }).catch((error) => {
      console.log(error)
    })
  }, [])

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
          <div className='featured-materials'>
            <ControlledCarousel list={courses} />

          </div>
          <div>
            <FeaturedCarousel />
          </div>
          {/* <div>
            <CarouselTemplate />
          </div> */}
        </div>
      </main>
    </div>
  )
}

interface ICourseListProps {
  list: CourseModel[]
}

function ControlledCarousel({ list }: ICourseListProps) {
  function processedThumbnailUrl(thumbnailUrl: string) {
    if (!thumbnailUrl) {
      return "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGR5e6phzjZV4iLJJNVPpnbPU_x52zj-mGPA&s?height=600&width=1200&text=No+Image"
    }
    if (thumbnailUrl.startsWith("http://") || thumbnailUrl.startsWith("https://")) {
      return thumbnailUrl
    }
    if (!thumbnailUrl.startsWith("/")) {
      return `/${thumbnailUrl}`
    }
    return thumbnailUrl
  }

  return (
    <div className='w-full '>
      <h2 className="text-xl font-bold px-6 ">CÁC HỌC LIỆU NỔI BẬT</h2>
      {list.length !== 0 ? (
        <Carousel className='w-full max-w-full mx-auto'>
          <CarouselContent>
            {list?.map((course) => (
              <CarouselItem className='w-full h-80 ' key={course.id}>
                <div className="relative flex h-full items-center justify-center rounded-lg overflow-hidden">
                  <Image
                    src={processedThumbnailUrl(course.thumbnailUrl)}
                    alt={course.title}
                    fill
                    className="object-cover"
                  />
                  <div className="p-3  px-10 absolute flex flex-col justify-between inset-0 h-[80%] self-end bg-gradient-to-t from-black to-100% text-white">
                    <p className="mt-25 text-2xl md:text-4xl font-bold line-clamp-2 break-words">
                      {course.title}
                    </p>

                    <Button className="rounded-full bg-blue-600 hover:bg-blue-700 w-fit">
                      <Link href={`/Courses/${course.id}`}>Xem chi tiết</Link>
                    </Button>
                  </div>

                  {/* <div className="absolute inset-0 z-20 flex flex-col justify-center items-start text-white px-8 md:px-16">
                    <h3 className="text-2xl md:text-4xl font-bold drop-shadow-lg">{course.title}</h3>

                    <Button asChild className="mt-20 rounded-full bg-blue-600 hover:bg-blue-700">
                      <Link href={`/Courses/${course.id}`}>Xem chi tiết</Link>
                    </Button>
                  </div> */}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className='hidden md:block'>
            <CarouselPrevious />
            <CarouselNext />
          </div>
        </Carousel>
      ) : (
        <p className='mx-auto text-center'>Không có dữ liệu</p>
      )}
    </div>
  );
};

function CarouselTemplate() {
  return (
    <main className="min-h-screen">
      <MusicVideoCarousel />
    </main>
  )
}

import { cn } from "@/lib/utils"
import { Badge, Star } from 'lucide-react'
import { StarRating } from '@/components/ui/star-rating'

const slides = [
  {
    title: "THE WORLDWIDE LEADER",
    subtitle: "IN CLOUD BANKING SOFTWARE",
    cta: "Xem chi tiết",
    color: "#0f172a",
    backgroundImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
    price: 1499000,
    rating: 5,
    reviews: 94,
  },
  {
    title: "DIGITAL TRANSFORMATION",
    subtitle: "FOR MODERN BANKING SOLUTIONS",
    cta: "Tìm hiểu thêm",
    color: "#1e3a8a",
    backgroundImage: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1200&auto=format&fit=crop",
    price: 1499000,
    rating: 5,
    reviews: 94,
  },
  {
    title: "FINANCIAL EDUCATION",
    subtitle: "RESOURCES FOR BANKING PROFESSIONALS",
    cta: "Khám phá ngay",
    color: "",
    backgroundImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop",
    price: 1499000,
    rating: 5,
    reviews: 94,
  },
]

function FeaturedCarousel() {
  const [features, setFeatures] = useState<CourseModel[]>([])
  const [api, setApi] = useState<any>()
  const [current, setCurrent] = useState(0)

  // Set up autoplay
  useEffect(() => {
    if (!api) return

    const interval = setInterval(() => {
      api.scrollNext()
    }, 5000)

    return () => clearInterval(interval)
  }, [api])

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

      <Carousel setApi={setApi} className="w-full mx-auto">
        <CarouselContent>
          {slides.map((slide, index) => (
            <CarouselItem key={index}>
              <div
                className="aspect-[4/3] sm:aspect-[16/9] md:aspect-[16/7] lg:aspect-[16/5] rounded-lg overflow-hidden relative"
                style={{
                  backgroundImage: `url(${slide.backgroundImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent sm:from-black/70 sm:to-transparent"></div>

                <div className="relative h-full flex items-center">
                  <div className="w-full md:w-[85%] lg:w-[70%] p-3 sm:p-5 md:p-8 lg:p-10 space-y-2 sm:space-y-3 md:space-y-4 z-10 text-white">
                    {/* Price badge */}
                    <div className="bg-green-500 w-fit font-bold italic text-white text-xs sm:text-sm md:text-base px-2 sm:px-3 md:px-4 py-0.5 md:py-1 rounded-full">
                      {(slide.price).toLocaleString("vi-VN")}₫
                      </div>

                    <h3 className="text-xl sm:text-2xl md:text-4xl font-bold leading-tight">
                      {slide.title}
                    </h3>
                    <p className="text-sm sm:text-base md:text-xl lg:text-xl">{slide.subtitle}</p>

                    {/* Star rating */}
                    <div className="flex items-center gap-1 sm:gap-2">
                      <StarRating rating={3.4} />
                      <span className="text-xs sm:text-sm opacity-90">({slide.reviews} đánh giá)</span>
                    </div>

                    <Button className="mt-2 sm:mt-3 md:mt-4 text-xs sm:text-sm md:text-base rounded-full bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-1 sm:py-2 h-sm">
                      {slide.cta}
                    </Button>
                  </div>

                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Responsive navigation buttons */}
        <CarouselPrevious className="left-1 sm:left-2 md:left-4 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-white/20 hover:bg-white/30 text-white border-none" />
        <CarouselNext className="right-1 sm:right-2 md:right-4 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-white/20 hover:bg-white/30 text-white border-none" />

        {/* Dots indicator */}
        <div className="absolute hidden md:inline-block bottom-2 sm:bottom-3 md:bottom-4 left-1/2 -translate-x-1/2 flex space-x-1 sm:space-x-2 z-20">
          {slides.map((_, index) => (
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
