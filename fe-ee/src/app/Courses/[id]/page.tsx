"use client"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { useEffect, useState } from "react"
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
import { getCourse } from "@/app/api/api-courses"
import { url_backend_default } from "@/lib/public-var"
import { useUserInfo } from "@/lib/user-info"
axios.defaults.withCredentials = true
axios.defaults.baseURL = url_backend_default

export default function CourseDetailsClient() {
  const { user, isLoading, isError, logout } = useUserInfo({ redirectToLogin: false })
  const [resetKey, setResetKey] = useState(false)

  const params = useParams();
  const id = params.id;
  const [course, setCourse] = useState<CourseModel>()
  const router = useRouter()
  useEffect(() => {
    getCourse(String(id))
      .then((response) => {
        if (user && user?.account.role!=="ADMIN" && response.data?.isAvailable == false) {
          router.push("/NotFound")
        } else
          setCourse(response?.data)
      })
      .catch((res) => {
        if (res.status === 404) {
          router.push("/NotFound")
        }
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
          <CourseHeader resetKey={resetKey} course={course} />

          <main>
            <div className="container mx-auto">
              <div className="p-5 lg:pt-5 lg:flex lg:flex-row-reverse">
                <div className="lg:w-80 p-5 lg:p-0 lg:-my-20 z-10">
                  <SubscriptionCard course={course} resetKey={resetKey} setResetKey={setResetKey} />
                </div>
                <MainTabs course={course} resetKey={resetKey} />
              </div>
            </div>
          </main>
        </>
      )}
    </div>
  )
}
