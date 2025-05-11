"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import VNPayButton from "@/components/VNPAY-open-window"
import { formatDate } from "@/lib/utils"
import { getUserInfo } from "@/app/api/api-account"
import type { CourseModel } from "@/models/CourseModel"
import type { UserModel } from "@/models/UserModel"
import { useUserInfo } from "@/lib/user-info"
import { isSubscribedByUser } from "@/app/api/api-courses"

interface SubscriptionCardProps {
  course: CourseModel
}

export default function SubscriptionCard({ course }: SubscriptionCardProps) {
  const { user, isLoading, isError, logout } = useUserInfo({ redirectToLogin: false })
  const [isSubscribed, setIsSubscribed] = useState<boolean | false>(false)
  const [subscribedAt, setSubscribedAt] = useState("")


  useEffect(() => {
    isSubscribedByUser(course.id).then(res => {
        setIsSubscribed(res.data?.inSub)
        setSubscribedAt(res.data?.subAt??"")
    }).catch(() => {
    })
  }, [])


  return (
    <Card>
      <CardHeader className="">
        {isSubscribed ? (
          <div>
            <Link href={`/Courses/Use/${course.id}`}>
              <Button className="w-full bg-blue-600">Sử dụng học liệu</Button>
            </Link>
          </div>
        ) : (
          <>
            <span>Mua học liệu:</span>
            <div>
              <VNPayButton amount={course.price} orderInfo={`THANHTOAN_${course.id}`} />
            </div>
          </>
        )}
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
              {isSubscribed ? <p className="font-medium">{formatDate(subscribedAt)}</p> : <i>Chưa đăng ký</i>}
            </div>
          </div>
        </div>
        <hr className="border-t border-gray-200" />
        <div>
          <h3 className="text-lg font-medium">Số học viên</h3>
          <p className="text-2xl font-bold">{course.subscriberNumber}</p>
        </div>
      </CardContent>
    </Card>
  )
}
