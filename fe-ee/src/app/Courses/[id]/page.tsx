"use client"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { useEffect, useState } from "react"
import SockJS from "sockjs-client"
import { Client, type IMessage } from "@stomp/stompjs"
import axios from "axios"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { HomeIcon } from "lucide-react"
import MainTabs from "./components/main-tabs"
import SubscriptionCard from "./components/subscription-card"
import CourseHeader from "./components/course-header"
import type { CourseModel } from "@/models/CourseModel"
import { getAverageStarReview, getCourse } from "@/app/api/api-courses"
import { url_backend_default } from "@/lib/public-var"
import { useUserInfo } from "@/lib/user-info"
import { toast, ToastContainer } from "react-toastify"
axios.defaults.withCredentials = true
axios.defaults.baseURL = url_backend_default

export default function CourseDetailsClient() {
  const { user, isLoading, isError, logout } = useUserInfo({ redirectToLogin: false })

  const params = useParams();
  const id = params.id;
  const [course, setCourse] = useState<CourseModel>()
  const [averageStar, setAverageStar] = useState<number>(0)
  const router = useRouter()
  useEffect(() => {
    getCourse(String(id))
      .then((response) => {
        setCourse(response?.data)
      })
      .catch((res) => {
        if (res.status === 404) {
          router.push("/NotFound")
        }
      })

    getAverageStarReview(String(id)).then((response) => {
      setAverageStar(response?.data)
    })
  }, [id, router])

  

  return (
    <div className="min-h-dvh">
      <Breadcrumb className="px-4 py-2">
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link href="/">
              <HomeIcon aria-hidden="true" className="size-4" />
            </Link>
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

      {course && (
        <>
          <CourseHeader course={course} averageStar={averageStar} />

          <main>
            <div className="container mx-auto">
              <div className="p-5 lg:pt-5 lg:flex lg:flex-row-reverse">
                <div className="lg:w-80 p-5 lg:p-0 lg:absolute lg:-my-20 z-10 lg:sticky">
                  <SubscriptionCard course={course} />
                </div>
                <MainTabs course={course} />
              </div>
            </div>
          </main>
        </>
      )}
    </div>
  )
}
