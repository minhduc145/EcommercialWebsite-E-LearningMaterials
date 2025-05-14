'use client'

import dynamic from 'next/dynamic';

const AppFooter = dynamic(() => import('@/components/footer'), { ssr: false });
const Header = dynamic(() => import('@/components/header'), { ssr: false });
import axios from "axios";
import { url_backend_default } from '@/lib/public-var';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
axios.defaults.withCredentials = true;
axios.defaults.baseURL = url_backend_default;

export default function Home() {
	return (
		<div className='bg-gradient-to-b from-blue-50 to-white'>
			<Header color='' />
			<br></br>
				<div className="min-h-[85dvh] m-auto container  gap-8 items-center justify-center flex flex-col-reverse md:flex-row ">
					<div className="flex flex-col gap-4">
						<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-yellow-400 via-red-400 to-pink-500 bg-clip-text text-transparent leading-18">
							Nâng cấp kỹ năng cùng e-Edu
						</h1>
						<p className="text-lg text-gray-600 max-w-[600px]">
							Truy cập các khóa học chất lượng cao mọi lúc, mọi nơi.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 mt-4">
							<Button size="lg" className="bg-orange-500 hover:bg-orange-600 hover:cursor-pointer">
								<Link href={"/Courses"}>Khám phá ngay!</Link>
							</Button>
						</div>
						<p className="text-sm text-gray-600">
							<span className="font-bold text-blue-700">10,000+</span> học viên.
						</p>
					</div>
					<Image
						src="/global_imgs/homepage-img.png"
						alt="E-learning"
						className='max-w-[80dvw] max-h-[80dvh] w-auto'
						width={600} height={600}
					/>
				</div>
			<AppFooter />
		</div>
	)
}

// import Image from "next/image"
// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent } from "@/components/ui/card"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { BookOpen, Users, Award, Monitor, Clock, CheckCircle } from "lucide-react"

// export default function Home() {
//   return (
//     <div className="flex flex-col min-h-screen">
//       {/* Navigation */}
//       <Header color=""/>

//       {/* Hero Section */}
//       <section className="w-full mx-auto bg-gradient-to-b from-blue-50 to-white">
//         <div className="container grid gap-8 md:grid-cols-2 items-center">
//           <div className="flex flex-col gap-4">
//             <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900">
//               Transform Your Skills with Online Learning
//             </h1>
//             <p className="text-lg text-gray-600 max-w-[600px]">
//               Access high-quality courses anytime, anywhere. Learn at your own pace and advance your career with our
//               expert-led programs.
//             </p>
//             <div className="flex flex-col sm:flex-row gap-4 mt-4">
//               <Button size="lg" className="bg-orange-500 hover:bg-orange-600">
//                 Browse Courses
//               </Button>
//               <Button size="lg" variant="outline" className="border-blue-700 text-blue-700 hover:bg-blue-50">
//                 Learn More
//               </Button>
//             </div>
//             <div className="flex items-center gap-4 mt-6">
//               <div className="flex -space-x-2">
//                 {[1, 2, 3, 4].map((i) => (
//                   <div
//                     key={i}
//                     className="w-8 h-8 rounded-full bg-blue-700 border-2 border-white flex items-center justify-center text-white text-xs"
//                   >
//                     {i}
//                   </div>
//                 ))}
//               </div>
//               <p className="text-sm text-gray-600">
//                 <span className="font-bold text-blue-700">10,000+</span> students already enrolled
//               </p>
//             </div>
//           </div>
//           <div className="relative">
//             <Image
//               src="/global_imgs/homepage-img.png"
//               alt="E-learning platform illustration showing students learning on various devices"
//               width={600}
//               height={600}
//               className="rounded-lg shadow-lg"
//             />
//           </div>
//         </div>
//       </section>

//       {/* Features Section */}
//       <section className="w-full py-12 md:py-24 bg-white">
//         <div className="container">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-4">Why Choose Our Platform</h2>
//             <p className="text-lg text-gray-600 max-w-[800px] mx-auto">
//               We provide a comprehensive learning experience with features designed to help you succeed.
//             </p>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {[
//               {
//                 icon: <Monitor className="h-10 w-10 text-orange-500" />,
//                 title: "Interactive Learning",
//                 description:
//                   "Engage with dynamic content, quizzes, and hands-on projects that reinforce your learning.",
//               },
//               {
//                 icon: <Users className="h-10 w-10 text-orange-500" />,
//                 title: "Expert Instructors",
//                 description:
//                   "Learn from industry professionals with real-world experience and proven teaching methods.",
//               },
//               {
//                 icon: <Clock className="h-10 w-10 text-orange-500" />,
//                 title: "Learn at Your Pace",
//                 description: "Access course materials 24/7 and study according to your own schedule and preferences.",
//               },
//               {
//                 icon: <Award className="h-10 w-10 text-orange-500" />,
//                 title: "Recognized Certificates",
//                 description: "Earn certificates that are valued by employers and can enhance your resume.",
//               },
//               {
//                 icon: <CheckCircle className="h-10 w-10 text-orange-500" />,
//                 title: "Practical Skills",
//                 description: "Develop job-ready skills through practical assignments and real-world applications.",
//               },
//               {
//                 icon: <BookOpen className="h-10 w-10 text-orange-500" />,
//                 title: "Diverse Course Library",
//                 description: "Choose from hundreds of courses across various disciplines and specializations.",
//               },
//             ].map((feature, index) => (
//               <Card key={index} className="border-none shadow-md hover:shadow-lg transition-shadow">
//                 <CardContent className="p-6">
//                   <div className="mb-4">{feature.icon}</div>
//                   <h3 className="text-xl font-bold mb-2 text-gray-900">{feature.title}</h3>
//                   <p className="text-gray-600">{feature.description}</p>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Course Categories */}
//       <section className="w-full py-12 md:py-24 bg-blue-50">
//         <div className="container">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-4">Explore Our Course Categories</h2>
//             <p className="text-lg text-gray-600 max-w-[800px] mx-auto">
//               Find the perfect course to match your interests and career goals.
//             </p>
//           </div>
//           <Tabs defaultValue="technology" className="w-full">
//             <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-6 mb-8">
//               <TabsTrigger value="technology">Technology</TabsTrigger>
//               <TabsTrigger value="business">Business</TabsTrigger>
//               <TabsTrigger value="design">Design</TabsTrigger>
//               <TabsTrigger value="marketing">Marketing</TabsTrigger>
//               <TabsTrigger value="personal">Personal Dev</TabsTrigger>
//               <TabsTrigger value="languages">Languages</TabsTrigger>
//             </TabsList>
//             <TabsContent value="technology" className="mt-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {[
//                   {
//                     title: "Web Development Bootcamp",
//                     description: "Learn HTML, CSS, JavaScript, React, and Node.js",
//                     lessons: 48,
//                     level: "Beginner to Advanced",
//                   },
//                   {
//                     title: "Python for Data Science",
//                     description: "Master Python programming for data analysis",
//                     lessons: 36,
//                     level: "Intermediate",
//                   },
//                   {
//                     title: "Mobile App Development",
//                     description: "Build iOS and Android apps with React Native",
//                     lessons: 42,
//                     level: "Intermediate",
//                   },
//                 ].map((course, index) => (
//                   <Card key={index} className="overflow-hidden">
//                     <div className="h-48 bg-blue-700 flex items-center justify-center">
//                       <Monitor className="h-16 w-16 text-white" />
//                     </div>
//                     <CardContent className="p-6">
//                       <h3 className="text-xl font-bold mb-2">{course.title}</h3>
//                       <p className="text-gray-600 mb-4">{course.description}</p>
//                       <div className="flex justify-between text-sm text-gray-500">
//                         <span>{course.lessons} lessons</span>
//                         <span>{course.level}</span>
//                       </div>
//                       <Button className="w-full mt-4 bg-orange-500 hover:bg-orange-600">View Course</Button>
//                     </CardContent>
//                   </Card>
//                 ))}
//               </div>
//             </TabsContent>
//             {/* Other tab contents would be similar */}
//             <TabsContent value="business" className="mt-4">
//               <div className="text-center py-12">
//                 <p className="text-gray-600">
//                   Explore our business courses to develop management and entrepreneurial skills.
//                 </p>
//               </div>
//             </TabsContent>
//             <TabsContent value="design" className="mt-4">
//               <div className="text-center py-12">
//                 <p className="text-gray-600">Discover design courses covering UI/UX, graphic design, and more.</p>
//               </div>
//             </TabsContent>
//             <TabsContent value="marketing" className="mt-4">
//               <div className="text-center py-12">
//                 <p className="text-gray-600">Learn digital marketing strategies, SEO, and social media marketing.</p>
//               </div>
//             </TabsContent>
//             <TabsContent value="personal" className="mt-4">
//               <div className="text-center py-12">
//                 <p className="text-gray-600">Improve your soft skills with our personal development courses.</p>
//               </div>
//             </TabsContent>
//             <TabsContent value="languages" className="mt-4">
//               <div className="text-center py-12">
//                 <p className="text-gray-600">Master new languages with our comprehensive language courses.</p>
//               </div>
//             </TabsContent>
//           </Tabs>
//         </div>
//       </section>

//       {/* Testimonials */}
//       <section className="w-full py-12 md:py-24 bg-white">
//         <div className="container">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-4">What Our Students Say</h2>
//             <p className="text-lg text-gray-600 max-w-[800px] mx-auto">
//               Hear from our community of learners about their experiences.
//             </p>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             {[
//               {
//                 name: "Alex Johnson",
//                 course: "Web Development Bootcamp",
//                 quote:
//                   "This platform completely transformed my career. I went from knowing nothing about coding to landing a job as a frontend developer in just 6 months.",
//               },
//               {
//                 name: "Sarah Williams",
//                 course: "Digital Marketing Masterclass",
//                 quote:
//                   "The instructors are incredibly knowledgeable and the course content is up-to-date with the latest industry trends. Highly recommended!",
//               },
//               {
//                 name: "Michael Chen",
//                 course: "Data Science Specialization",
//                 quote:
//                   "The hands-on projects helped me build a portfolio that impressed employers. The community support was also invaluable during my learning journey.",
//               },
//             ].map((testimonial, index) => (
//               <Card key={index} className="p-6">
//                 <div className="flex flex-col h-full">
//                   <div className="mb-4">
//                     <div className="flex gap-1">
//                       {[1, 2, 3, 4, 5].map((star) => (
//                         <svg key={star} className="h-5 w-5 fill-orange-500" viewBox="0 0 20 20" fill="currentColor">
//                           <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//                         </svg>
//                       ))}
//                     </div>
//                   </div>
//                   <blockquote className="flex-1 text-gray-600 italic mb-4">"{testimonial.quote}"</blockquote>
//                   <div className="mt-auto">
//                     <p className="font-bold">{testimonial.name}</p>
//                     <p className="text-sm text-gray-500">Student, {testimonial.course}</p>
//                   </div>
//                 </div>
//               </Card>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="w-full py-12 md:py-24 bg-blue-700 text-white">
//         <div className="container">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
//             <div>
//               <h2 className="text-3xl font-bold tracking-tight mb-4">Ready to Start Your Learning Journey?</h2>
//               <p className="text-blue-100 mb-6 max-w-[500px]">
//                 Join thousands of students who are already advancing their careers with our comprehensive courses.
//               </p>
//               <div className="flex flex-col sm:flex-row gap-4">
//                 <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white">
//                   Sign Up Now
//                 </Button>
//                 <Button size="lg" variant="outline" className="border-white text-white hover:bg-blue-600">
//                   View All Courses
//                 </Button>
//               </div>
//             </div>
//             <div className="bg-blue-800 p-8 rounded-lg">
//               <h3 className="text-xl font-bold mb-4">Subscribe to Our Newsletter</h3>
//               <p className="text-blue-100 mb-4">Get updates on new courses, special offers, and learning tips.</p>
//               <form className="space-y-4">
//                 <input type="text" placeholder="Your Name" className="w-full p-3 rounded-md text-gray-900" />
//                 <input type="email" placeholder="Your Email" className="w-full p-3 rounded-md text-gray-900" />
//                 <Button className="w-full bg-orange-500 hover:bg-orange-600">Subscribe</Button>
//               </form>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="w-full py-12 bg-gray-900 text-gray-300">
//         <div className="container">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
//             <div>
//               <div className="flex items-center gap-2 mb-4">
//                 <BookOpen className="h-6 w-6 text-orange-500" />
//                 <span className="text-xl font-bold text-white">EduLearn</span>
//               </div>
//               <p className="text-gray-400 mb-4">
//                 Empowering learners worldwide with quality education and practical skills.
//               </p>
//               <div className="flex gap-4">
//                 {["twitter", "facebook", "instagram", "linkedin"].map((social) => (
//                   <Link key={social} href="#" className="text-gray-400 hover:text-white">
//                     <span className="sr-only">{social}</span>
//                     <div className="h-8 w-8 rounded-full bg-gray-800 flex items-center justify-center">
//                       <span className="text-xs">{social[0].toUpperCase()}</span>
//                     </div>
//                   </Link>
//                 ))}
//               </div>
//             </div>
//             <div>
//               <h3 className="text-lg font-bold mb-4 text-white">Courses</h3>
//               <ul className="space-y-2">
//                 {["Technology", "Business", "Design", "Marketing", "Personal Development", "Languages"].map((item) => (
//                   <li key={item}>
//                     <Link href="#" className="text-gray-400 hover:text-white">
//                       {item}
//                     </Link>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//             <div>
//               <h3 className="text-lg font-bold mb-4 text-white">Company</h3>
//               <ul className="space-y-2">
//                 {["About Us", "Careers", "Blog", "Partners", "Testimonials", "Contact Us"].map((item) => (
//                   <li key={item}>
//                     <Link href="#" className="text-gray-400 hover:text-white">
//                       {item}
//                     </Link>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//             <div>
//               <h3 className="text-lg font-bold mb-4 text-white">Support</h3>
//               <ul className="space-y-2">
//                 {["Help Center", "FAQs", "Terms of Service", "Privacy Policy", "Accessibility", "Cookie Settings"].map(
//                   (item) => (
//                     <li key={item}>
//                       <Link href="#" className="text-gray-400 hover:text-white">
//                         {item}
//                       </Link>
//                     </li>
//                   ),
//                 )}
//               </ul>
//             </div>
//           </div>
//           <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
//             <p>© {new Date().getFullYear()} EduLearn. All rights reserved.</p>
//           </div>
//         </div>
//       </footer>
//     </div>
//   )
// }
