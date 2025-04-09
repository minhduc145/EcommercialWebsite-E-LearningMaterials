'use client'
import { useParams } from 'next/navigation'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import Link from "next/link"
import { Badge, HomeIcon } from 'lucide-react'
import '@/app/assets/css/courseDetail/style.css'
import { StarRating } from "@/components/ui/star-rating"

export default function courseDetails() {
    const params = useParams()
    const id = params.id
    const c = {
        id: '1',
        title: "Course name 1",
        category_name: "Cat 01",
        description: "this is example description that never be useful for anything",
        thumbnail_url: "global_imgs/KH-demo.png",
        author_name: "Nguyễn A"
    }

    return (

        <>
            <Breadcrumb className="px-4 py-2">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <Link href="/"><HomeIcon aria-hidden="true" className="size-4" /></Link>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <Link href="/Courses">Học liệu</Link>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Chi tiết học liệu</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className='flex items-center justify-center relative thumbnail w-full bg-center bg-[url("/global_imgs/KH-demo.png")] bg-cover h-[200px] left-0 bottom-0'>
                <div className="absolute inset-0 bg-gradient-to-r from-[#1a2a54]/80 via-[#001f3f]/40 to-transparent z-10"></div>
                <div className='flex relative  items-center gap-3 md:gap-10 container mx-auto px-4 pt-2 text-white z-20'>
                    <div>
                        <img src='/global_imgs/logoCourse.svg' alt='' />
                    </div>
                    <div className='flex flex-col gap-4 justify-between'>
                        <p className="text-3xl font-bold">
                            {c.title}
                        </p>
                        <div className='flex flex-col gap-1'>
                            <p className="font-bold">
                                {c.author_name}
                            </p>
                            <div className="flex gap-1 md:gap-5 ">
                                <p>{c.category_name}</p>
                                |
                                <StarRating rating={3} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <main>
                <div className='container mx-auto'>
                    <div className='p-5 lg:pt-5 lg:flex lg:flex-row-reverse'>
                        <div className='lg:w-80 p-5 lg:p-0 lg:absolute lg:-my-15 z-10  lg:sticky'>
                            <SubscriptionCard />
                        </div>
                        <MainTabs />


                    </div>

                </div>
            </main>
        </>

    )
}

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProgressBar } from '@/components/ui/progress'
function MainTabs() {
    return (
        <div className="w-full max-w-4xl mx-auto p-4">
            <Tabs defaultValue="mo-ta" className="w-full">
                <TabsList className="grid w-full items-center justify-center mx-auto grid-cols-3 rounded-lg p-1 bg-slate-100">
                    <TabsTrigger
                        value="mo-ta"
                        className="rounded-md  data-[state=active]:bg-violet-600 data-[state=active]:text-white transition-all"
                    >
                        Mô tả
                    </TabsTrigger>
                    
                    <TabsTrigger
                        value="tai-lieu"
                        className="rounded-md data-[state=active]:bg-violet-600 data-[state=active]:text-white transition-all"
                    >
                        Tài liệu
                    </TabsTrigger>
                    <TabsTrigger
                        value="danh-gia"
                        className="rounded-md data-[state=active]:bg-violet-600 data-[state=active]:text-white transition-all"
                    >
                        Đánh giá
                    </TabsTrigger>
                </TabsList>
                <div className="mt-6 border rounded-lg p-6">
                    <TabsContent value="mo-ta" className="space-y-4">
                        <h2 className="text-xl font-bold">BÀI DỰ THI ELEARNING</h2>
                        <p>
                            Đây là phần mô tả chi tiết về bài dự thi. Nội dung này sẽ giới thiệu tổng quan về bài học, mục tiêu và các
                            kết quả học tập dự kiến.
                        </p>
                        <p>Học viên sẽ được hướng dẫn cách thức tham gia và hoàn thành bài học một cách hiệu quả.</p>
                    </TabsContent>
                    
                    <TabsContent value="tai-lieu" className="space-y-4">
                        <h2 className="text-xl font-bold">TÀI LIỆU HỌC TẬP</h2>
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="text-blue-500"
                                >
                                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                                    <polyline points="14 2 14 8 20 8" />
                                </svg>
                                <a href="#" className="text-blue-600 hover:underline">
                                    Tài liệu hướng dẫn.pdf
                                </a>
                            </div>
                            <div className="flex items-center gap-2">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="text-blue-500"
                                >
                                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                                    <polyline points="14 2 14 8 20 8" />
                                </svg>
                                <a href="#" className="text-blue-600 hover:underline">
                                    Bài giảng.pptx
                                </a>
                            </div>
                            <div className="flex items-center gap-2">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="text-blue-500"
                                >
                                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                                    <polyline points="14 2 14 8 20 8" />
                                </svg>
                                <a href="#" className="text-blue-600 hover:underline">
                                    Tài liệu tham khảo.docx
                                </a>
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="danh-gia" className="space-y-4">
                        <div className="space-4 flex flex-col items-center justify-center-safe gap-20 lg:flex-row ">
                            <div className='flex flex-col items-center gap-2'>
                                <p className='font-medium text-7xl'>0</p>
                                <div><StarRating rating={3} /></div>
                                <i className='font-light'>(0 lượt đánh giá)</i>
                            </div>
                            <div className='flex flex-col gap-5'>
                                <div className='flex gap-3 items-center'>
                                    <div className='flex gap-1'><div>5</div>
                                        <StarRating maxRating={1} rating={1} /></div>
                                    <div className='w-56'><ProgressBar value={33} /></div>
                                </div>
                                <div className='flex gap-3 items-center'>
                                    <div className='flex gap-1'><div>4</div>
                                        <StarRating maxRating={1} rating={1} /></div>
                                    <div className='w-56'><ProgressBar value={33} /></div>
                                </div>
                                <div className='flex gap-3 items-center'>
                                    <div className='flex gap-1'><div>3</div>
                                        <StarRating maxRating={1} rating={1} /></div>
                                    <div className='w-56'><ProgressBar value={33} /></div>
                                </div>
                                <div className='flex gap-3 items-center'>
                                    <div className='flex gap-1'><div>2</div>
                                        <StarRating maxRating={1} rating={1} /></div>
                                    <div className='w-56'><ProgressBar value={33} /></div>
                                </div>
                                <div className='flex gap-3 items-center'>
                                    <div className='flex gap-1'><div>1</div>
                                        <StarRating maxRating={1} rating={1} /></div>
                                    <div className='w-56'><ProgressBar value={33} /></div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <b>Bình luận:</b>
                            <div></div>
                        </div>
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    )
}

import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card"
import { Button } from '@/components/ui/button'
import { Separator } from '@radix-ui/react-dropdown-menu'
import VNPayButton from '@/components/ui/VNPAY-open-window'

function SubscriptionCard() {
    return (
        <>
            <Card>
                <CardHeader>
                    <Button className='w-full bg-blue-600'>Mua học liệu</Button>
                    <VNPayButton />

                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Thời gian diễn ra */}
                    <div className="space-y-2">
                        <h3 className="text-lg font-medium">Thời gian diễn ra</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Bắt đầu</p>
                                <p className="font-medium">10/03/2024</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Kết thúc</p>
                                <p className="font-medium">31/05/2030</p>
                            </div>
                        </div>
                    </div>
                    <Separator />
                    {/* Thời gian đăng ký */}
                    <div className="space-y-2">
                        <h3 className="text-lg font-medium">Thời gian đăng ký</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="font-medium">09/03/2024</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-medium">Số học viên</h3>
                        <p className="text-2xl font-bold">0</p>
                    </div>
                </CardContent>
            </Card>

        </>
    )
}