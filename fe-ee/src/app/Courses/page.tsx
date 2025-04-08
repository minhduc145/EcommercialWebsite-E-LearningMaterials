import '@/app/assets/css/products/products.css'
import '@/app/assets/js/globals.js'
import { CourseCarousel, CourseCarouselItem } from '@/components/ui/course-carousel';


export default  function Courses() {
  return (
    <>
      <div className="banner h-96 bg-blue-900 rounded-bl-3xl rounded-br-3xl bg-left">
        <div className="grid h-80 grid-cols-1  inset-x-0 lg:grid-cols-2">
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

var courses = [
  { id: '1', title: "Course name 1", description: "this is example description that never be useful for anything", thumbnail_url: "global_imgs/KH-demo.png" },
  { id: '2', title: "Course name 2", description: "this is example description that never be useful for anything", thumbnail_url: "https://cdn.fliki.ai/image/page/660ba680adaa44a37532fd97/6663112070e1cfda27f86585.jpg" },
  { id: '3', title: "Course name 3", description: "this is example description that never be useful for anything", thumbnail_url: "https://i.pinimg.com/736x/af/44/ea/af44ea07fa5bfd828004747f62f63bc3.jpg" },
  { id: '4', title: "Course name 4", description: "this is example description that never be useful for anything", thumbnail_url: "https://marketingai.mediacdn.vn/wp-content/uploads/2019/04/thumbnail-la-gi.jpg" }
]

function ControlledCarousel() {
  return (
    <CourseCarousel className='relative'>
      {courses.map((course) => (
        <CourseCarouselItem
          key={course.id}
          id={course.id}
          title={course.title}
          description={course.description}
          thumbnailUrl={course.thumbnail_url}
          linkHref={`/Courses/${course.id}`}
        />
      ))}
     
    </CourseCarousel>
  );
};
