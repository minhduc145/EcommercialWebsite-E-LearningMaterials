'use client'
import '@/app/assets/css/products/products.css'
import '@/app/assets/js/globals.js'


export default function Main() {
  return (
    <>
      <div className="banner h-96 bg-blue-900 rounded-bl-3xl rounded-br-3xl bg-left">
        <div className="grid h-80 grid-cols-1  lg:grid-cols-2">
          <div className='m-auto text-white'>
            <p>Chào mừng bạn đến với</p>
            <p className='text-5xl mt-3'>ABCXYZ</p>
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
            <p className='font-bold'>CÁC HỌC LIỆU NỔI BẬT</p>
            <ControlledCarousel>

            </ControlledCarousel>
          </div>
        </div>
      </main>
    </>
  )
}

import { Carousel } from "flowbite-react";
import Link from 'next/link';
import Image from 'next/image';
var courses = [
  { id: '1', title: "Course name 1", description: "this is example description that never be useful for anything", thumbnail_url: "global_imgs/KH-demo.png" },
  { id: '2', title: "Course name 2", description: "this is example description that never be useful for anything", thumbnail_url: "https://cdn.fliki.ai/image/page/660ba680adaa44a37532fd97/6663112070e1cfda27f86585.jpg" },
  { id: '3', title: "Course name 3", description: "this is example description that never be useful for anything", thumbnail_url: "https://i.pinimg.com/736x/af/44/ea/af44ea07fa5bfd828004747f62f63bc3.jpg" },
  { id: '4', title: "Course name 4", description: "this is example description that never be useful for anything", thumbnail_url: "https://marketingai.mediacdn.vn/wp-content/uploads/2019/04/thumbnail-la-gi.jpg" }
]

function ControlledCarousel() {
  return (
    <div className="h-56 sm:h-64 xl:h-80 2xl:h-96">
      <Carousel>
        {courses.map(c => (
          <div key={c.id} className="relative flex h-full items-center justify-center bg-gray-400 dark:bg-gray-700 dark:text-white">

            <Image
              src={c.thumbnail_url}
              alt="thumbnail"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-[rgba(0,0,0,0.70)] z-10"></div>

            <div className="absolute inset-0 z-20 flex flex-col justify-center items-start text-white px-16 md:px-16">
              <h3 className="text-2xl md:text-4xl font-bold drop-shadow-lg">{c.title}</h3>
              <p className="mt-2 text-sm md:text-lg text-white max-w-xl line-clamp-1">{c.description}</p>
              <button className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 transition rounded-full text-sm font-medium shadow-md">
                <Link key={c.id} href={`/Courses/${c.id}`}>
                  Xem chi tiết
                </Link>
              </button>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};
