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
import { HomeIcon, Banknote, Star } from 'lucide-react'
import '@/app/assets/css/courseDetail/style.css'
import { StarRating } from "@/components/ui/star-rating"
import { CourseModel } from "@/models/CourseModel"
import { CourseReviewModel } from "@/models/CourseReviewModel"
import SockJS from "sockjs-client";
import { Client, IMessage } from "@stomp/stompjs";

import axios from "axios";
axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://localhost:8080";

interface ICourseProp {
    course: CourseModel,
}

interface IReviewProp {
    id: string
}




export default function courseDetails() {
    const id = useParams().id
    const [course, setCourse] = useState<CourseModel>()
    const [averageStar, setAverageStar] = useState<number>(0)

    useEffect(() => {
        getCourse(String(id)).then((response) => {
            setCourse(response?.data)
        })
        getAverageStarReview(String(id)).then((response) => {
            setAverageStar(response?.data)
        })
    }, [])

    useEffect(() => {
        const paymentSocket = new SockJS('http://localhost:8080/ws/payment');
        const paymentClient = new Client({
            webSocketFactory: () => paymentSocket,
            reconnectDelay: 5000,
            onConnect: () => {
                paymentClient.subscribe(`/topic/result/${JSON.parse(String(localStorage.getItem('currentUser')))?.id}`
                    , (message: IMessage) => {
                        console.log('📩 Message received:', message.body);
                        if (message.body === "1") {
                            setTimeout(() => {
                                window.location.reload();
                            }, 1000)
                        } else {
                            alert("Thanh toán thất bại")
                        }
                    }
                    , {
                        username: JSON.parse(String(localStorage.getItem('currentUser')))?.id
                    });
                console.log('✅ Connected to WebSocket');
            },
            onStompError: (frame) => {
                console.error('❌ Broker error:', frame.headers['message']);
            },
        });
        paymentClient.activate();
        return () => {
            paymentClient.deactivate();
        };
    }, []);

    return (
        <div className=' min-h-dvh'>
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
                        <BreadcrumbPage>Xem học liệu</BreadcrumbPage>
                    </BreadcrumbItem>

                </BreadcrumbList>
            </Breadcrumb>
            <div className="flex items-center justify-center relative thumbnail w-full bg-center  left-0 bottom-0 bg-cover h-[300px]" style={{ backgroundImage: `url(${course?.thumbnailUrl})` }}>
                <div className="absolute inset-0 bg-gradient-to-r from-[#1a2a54]/80 via-[#001f3f]/40 to-transparent z-10"></div>
                <div className='flex relative  items-center gap-3 md:gap-10 container mx-auto px-4 pt-2 text-white z-20'>
                    <div>
                        <img src='/global_imgs/logoCourse.svg' alt='' />
                    </div>
                    <div className='flex flex-col gap-4 justify-between'>
                        <p className="text-3xl font-bold">
                            {course?.title}
                        </p>
                        <div className='flex flex-col gap-1'>
                            <p className="font-bold">
                                {course?.category.name}
                            </p>
                            <div className="flex gap-1 md:gap-5 ">
                                <p className="text-md lg:text-lg ring-1 ring-green-600/20 ring-inset rounded-md bg-green-50 inline-flex items-center px-2 py-1 font-semibold text-green-600">
                                    <Banknote className='size-3 md:size-5' /> &nbsp; {formatCurrency(course?.price ?? 0)}
                                </p>
                                <StarRating rating={averageStar} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <main>
                <div className='container mx-auto'>
                    <div className='p-5 lg:pt-5 lg:flex lg:flex-row-reverse'>
                        <div className='lg:w-80 p-5 lg:p-0 lg:absolute lg:-my-20 z-10  lg:sticky'>
                            {course && <SubscriptionCard course={course} />}
                        </div>
                        {course && <MainTabs course={course} />}
                    </div>

                </div>
            </main>
        </div>

    )
}

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProgressBar } from '@/components/ui/progress'
function MainTabs({ course }: ICourseProp) {
    const [courseData, setCourseData] = useState<CourseDataModel[]>([])
    useEffect(() => {
        getCourseData(String(course.id)).then((response) => {
            setCourseData(response?.data)
        })
    }, [])
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
                <div className="mt-3 border rounded-lg p-6">
                    <TabsContent value="mo-ta" className="space-y-4 flex flex-col-reverse">
                        <div className="aspect-video w-full">
                            <iframe className="w-full h-full" src="https://pub-e96712ffb5c644eab6d6682c1ebe8bf3.r2.dev/Getting%20started%20with%20iSpring/res/index.html" allowFullScreen ></iframe>
                        </div>
                        <br />
                        {/* <MarkdownRenderer content={course?.description} /> */}
                        <div dangerouslySetInnerHTML={{ __html: course?.description ?? "<p class='text-center'>Không có dữ liệu<p>" }}></div>
                    </TabsContent>
                    <TabsContent value="tai-lieu" className="space-y-4">
                        <div className=" ">
                            {courseData.length != 0 ? (
                                <CourseFileAccordion course_data={courseData ?? []} />
                            ) : (
                                <p className='text-center'>Không có dữ liệu</p>
                            )}
                        </div>
                    </TabsContent>
                    <TabsContent value="danh-gia" className="space-y-4">
                        <div className="space-4">
                            <CommentLayout id={String(course?.id)} />
                        </div>
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    )
}

const CommentLayout = ({ id }: IReviewProp) => {
    const [reviews, setReviews] = useState<CourseReviewModel[]>([])
    const [reviewLength, setReviewLength] = useState<number>(0)
    const [totalPages, setTotalPages] = useState<number>(0)
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [starRateMeta, setStarRateMeta] = useState([])
    const currentUser: UserModel = JSON.parse(String(localStorage.getItem('currentUser')))

    const onPageChange = (page: number) => {
        setCurrentPage(page)
    }

    useEffect(() => {
        getCourseReview(id, currentPage).then((response) => {
            setReviews(response?.data.reviewPageable.content)
            setReviewLength(response?.data.reviewPageable.totalElements)
            setTotalPages(response?.data.reviewPageable.totalPages)
            setStarRateMeta(response?.data.starRateMeta)
        })
    }, [currentPage])

    return (
        <>
            <div className="flex flex-col items-center justify-center-safe gap-5 md:gap-20 mb-5 md:mb-0 lg:flex-row ">
                <div className='flex flex-col items-center gap-2'>
                    <p className='font-medium text-7xl'>{reviewLength}</p>
                    <i className='font-light'>({reviewLength} lượt đánh giá)</i>
                </div>
                <div className='flex flex-col gap-5'>
                    {starRateMeta.map((star) => {
                        const percentage = (star[1] / reviewLength)
                        return (
                            <div key={star[0]} className="flex gap-3 items-center">
                                <div className="flex gap-1 items-center">
                                    <div>{star[0]}</div>
                                    <Star className="fill-yellow-400 text-yellow-400 h-5 w-5" />
                                </div>
                                <div className="w-56">
                                    <ProgressBar value={percentage * 100} />
                                </div>
                                <i className='font-light text-sm'>({star[1]})</i>
                            </div>
                        )
                    })}
                </div>
            </div>
            <div>
                <b>Bình luận:</b>
                <div className="max-w-3xl mx-auto py-4">
                    <div>
                        {reviewLength === 0 ? (
                            <p className="text-gray-500">Không có dữ liệu.</p>
                        ) : (
                            <div className="space-y-3">
                                {reviews?.map((review) => (
                                    <div key={review.id} className="border-b pb-4">
                                        <div className="flex justify-between items-center mb-2">
                                            <h3 className="font-medium">{review.user.lastName}&nbsp;{review.user.firstName}&nbsp;
                                                <i className='text-sm font-light'>{review.user.id === currentUser?.id ? '• Bạn' : ''}</i>
                                            </h3>
                                            <span className="text-sm text-gray-500">{formatDateTime(review.createdAt)}</span>
                                        </div>
                                        <div className="flex mb-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    className={`w-4 h-4 ${star <= review.starRate ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                                                />
                                            ))}
                                        </div>
                                        <p className="text-gray-700">{review.comment}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <PaginationCluster totalPages={totalPages} initialPage={currentPage} onPageChange={onPageChange} />
            </div>
        </>
    )
}



import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card"
import { Separator } from '@radix-ui/react-dropdown-menu'
import VNPayButton from '@/components/VNPAY-open-window'
import { formatCurrency } from '../../../lib/public-var';
import { useEffect, useState } from 'react'
import CourseFileAccordion from './components/course-file-accordion'
import { getAverageStarReview, getCourse, getCourseData, getCourseReview } from '@/app/api/api-courses'
import { Button } from '@/components/ui/button'
import { formatDate, formatDateTime } from '@/lib/utils'
import { UserModel } from '@/models/UserModel'
import PaginationCluster from '@/components/ui/pagination-button-cluster'
import { CourseDataModel } from '@/models/CourseDataModel'
import { getUserInfo } from '@/app/api/api-account'

function SubscriptionCard({ course }: ICourseProp) {
    const [user, setCurrentUser] = useState<UserModel>()

    useEffect(() => {
        getUserInfo().then(response => {
            setCurrentUser(response?.data ?? null)
        })
    }, [])

    const i: boolean | false = user?.id === course.creator.id
    return (
        <Card>
            <CardHeader className=''>
                {
                    i ? (
                        <>
                            <div>
                                <Link href={`/Courses/Use/${course.id}`}> <Button className='w-full bg-blue-600'>Sử dụng học liệu</Button></Link>
                            </div></>
                    ) : (
                        <>
                            <span>Mua học liệu:</span>
                            <div>
                                <VNPayButton amount={course.price} orderInfo={`${course.id}_${course.title}`} />
                            </div></>
                    )
                }

            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <h3 className="text-lg font-medium">Ngày tạo</h3>
                            <p className="font-medium">{formatDate(course.createdAt)}</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-medium">Ngày đăng ký</h3>
                            {i ? (<p className="font-medium">09/04/2024</p>) : (<i>Chưa đăng ký</i>)}
                        </div>
                    </div>
                </div>
                <Separator />
                <div>
                    <h3 className="text-lg font-medium">Số học viên</h3>
                    <p className="text-2xl font-bold">{course.subscriberNumber}</p>
                </div>
            </CardContent>
        </Card >
    )
}


