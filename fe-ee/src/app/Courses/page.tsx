import '@/app/assets/css/products/products.css'
import '@/app/assets/js/globals.js'
import { CourseCarousel, CourseCarouselItem } from '@/components/ui/course-carousel';
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


export default function Courses() {
  return (
    <>
      <div className="banner m-0 p-0 inset-x-0 top-0 w-full h-96 bg-blue-900 rounded-bl-3xl rounded-br-3xl bg-left">
        <div className="grid w-full h-80 grid-cols-1 inset-x-0 lg:grid-cols-2">
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
            <ControlledCarousel />
            <br />

          </div>
        </div>
      </main>
    </>
  )
}

var courses = [
  { id: '1', title: "Course name 1", description: "this is example description that never be useful for anything this is example description that never be useful for anythingthis is example description that never be useful for anythingthis is example description that never be useful for anythingthis is example description that never be useful for anythingthis is example description that never be useful for anythingthis is example description that never be useful for anythingthis is example description that never be useful for anythingthis is example description that never be useful for anythingthis is example description that never be useful for anythingthis is example description that never be useful for anythingthis is example description that never be useful for anything", thumbnail_url: "" },
  { id: '2', title: "Course name 2", description: "this is example description that never be useful for anything", thumbnail_url: "https://cdn.fliki.ai/image/page/660ba680adaa44a37532fd97/6663112070e1cfda27f86585.jpg" },
  { id: '3', title: "Course name 3", description: "this is example description that never be useful for anything", thumbnail_url: "https://i.pinimg.com/736x/af/44/ea/af44ea07fa5bfd828004747f62f63bc3.jpg" },
  { id: '4', title: "Course name 4", description: "this is example description that never be useful for anything", thumbnail_url: "https://marketingai.mediacdn.vn/wp-content/uploads/2019/04/thumbnail-la-gi.jpg" }
]

function ControlledCarousel() {
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
    <div>
      <Carousel className='mx-auto'>
        <CarouselContent>
          {courses.map((course) => (
            <CarouselItem className='w-full h-80 ' key={course.id}>
              <div className="relative flex h-full items-center justify-center">
                <Image
                  src={processedThumbnailUrl(course.thumbnail_url)}
                  alt={course.title}
                  fill
                  className="object-cover  rounded rounded-2xl"
                />
                <div className="absolute   rounded rounded-2xl inset-0 bg-[rgba(0,0,0,0.70)] z-10"></div>
                <div className="absolute inset-0 z-20 flex flex-col justify-center items-start text-white px-8 md:px-16">
                  <h3 className="text-2xl md:text-4xl font-bold drop-shadow-lg">{course.title}</h3>
                  <p className="mt-2 text-sm md:text-lg text-white max-w-xl line-clamp-2">{course.description}</p>
                  <Button asChild className="mt-20 rounded-full bg-blue-600 hover:bg-blue-700">
                    <Link href={`/Courses/${course.id}`}>Xem chi tiết</Link>
                  </Button>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className='hidden md:block'>
          <CarouselPrevious />
          <CarouselNext />
        </div>
      </Carousel>
    </div>
  );
};
