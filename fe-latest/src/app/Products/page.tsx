'use client'
import Header from '../components/header'
import { AppFooter } from '../components/footer'
import Image from "next/image";
import BannerImg from '../assets/dummy-slide-min.png'
import '@/app/assets/css/products/products.css'
import '@/app/assets/js/globals.js'


export default function Main() {
  return (
    <>
      <Header color="blue" />
      <div className="banner h-96 bg-blue-900 rounded-bl-3xl rounded-br-3xl bg-left">
        <div className="grid grid-cols-1  lg:grid-cols-2">
          <div className='m-auto text-white'>
            <p>Chào mừng bạn đến với</p>
            <p className='text-5xl mt-3'>ABCXYZ</p>
          </div>
          <div className="s2-col">
            <Image className='m-auto' width='570' src={BannerImg} alt="" />
          </div>
        </div>
      </div>
      <br />
      <main>
        <div className="container mx-auto px-4">
          <div className='bought-materials'>
            <p className='font-bold'>CÁC KHÓA HỌC NỔI BẬT</p>
            <ControlledCarousel></ControlledCarousel>
          </div>
        </div>
      </main>
      <br />
      <AppFooter />
    </>
  )
}

import { Carousel } from "flowbite-react";

function ControlledCarousel() {
  return (
    <>
      <div className="h-56 sm:h-64 xl:h-80 2xl:h-96">
        <Carousel>
          <div className="flex h-full items-center justify-center bg-gray-400 dark:bg-gray-700 dark:text-white">
            <a href=''>Slide 1 </a>
          </div>
          <div className="flex h-full items-center justify-center bg-gray-400 dark:bg-gray-700 dark:text-white">
            Slide 2
          </div>
          <div className="flex h-full items-center justify-center bg-gray-400 dark:bg-gray-700 dark:text-white">
            Slide 3
          </div>
        </Carousel>
      </div>
    </>
  );
};
