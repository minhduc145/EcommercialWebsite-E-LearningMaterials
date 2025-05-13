"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import VNPayButton from "@/components/VNPAY-open-window"
import { formatDate } from "@/lib/utils"
import type { CourseModel } from "@/models/CourseModel"
import { useUserInfo } from "@/lib/user-info"
import { deleteReview, getReviewByUserAndCourse, isSubscribedByUser, submitReview } from "@/app/api/api-courses"
import { StarRating } from "@/components/ui/star-rating"
import { Textarea } from "@/components/ui/textarea"
import { CourseReviewModel } from "@/models/CourseReviewModel"
import MyToaster from "@/components/ui/toastify-template"

interface SubscriptionCardProps {
  course: CourseModel
  onReviewSubmit: (i: boolean) => void
  resetCommentKey: boolean
}

export default function SubscriptionCard({ course, onReviewSubmit, resetCommentKey }: SubscriptionCardProps) {
  const { user, isLoading, isError, logout } = useUserInfo({ redirectToLogin: false })
  const [isSubscribed, setIsSubscribed] = useState<boolean | false>(false)
  const [subscribedAt, setSubscribedAt] = useState("")

  useEffect(() => {
    isSubscribedByUser(course.id).then(res => {
      setIsSubscribed(res.data?.inSub)
      setSubscribedAt(res.data?.subAt ?? "")
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
        <hr className="border-t border-gray-200" />
        <div>
          <UserRate userId={user?.id} course={course} isShown={isSubscribed} resetCommentKey={resetCommentKey} setCommentResetKey={onReviewSubmit} />
        </div>

      </CardContent>
    </Card>
  )
}


function UserRate({ userId, course, isShown = false, resetCommentKey, setCommentResetKey }: { userId: string | undefined, course: CourseModel, isShown: boolean, resetCommentKey: boolean, setCommentResetKey: (i: boolean) => void }) {
  const [review, setReview] = useState<CourseReviewModel>()
  const [star, setStar] = useState<number>(5)
  const [isEditing, setIsEditing] = useState(false)
  const [comment, setComment] = useState("")

  useEffect(() => {
    if (userId)
      getReviewByUserAndCourse(course?.id, userId).then(res => {
        setReview(res.data)
        setComment(res.data.comment)
        setStar(res.data.starRate)
        setIsEditing(true)
      }).catch(() => {
        setReview(undefined)
        setIsEditing(false)
      })
  }, [resetCommentKey])

  const handleSubmit = () => {
    submitReview(review?.id, course.id, comment, star == 0 ? 1 : star).then(res => {
      if (res.data) {
        setReview(res.data)
        setCommentResetKey(!resetCommentKey)
        MyToaster("success", `${isEditing ? "Sửa" : "Gửi"} đánh giá thành công`)
      }
    }).catch()
  }

  const handleDelete = () => {
    if (review?.id)
      deleteReview(review?.id).then(res => {
        if (res?.data == true) {
          setCommentResetKey(!resetCommentKey)
          setStar(0)
          setComment("")
          MyToaster("success", "Xóa đánh giá thành công")
        }
      }).catch()
  }

  if (isShown) return (
    <div className="flex flex-col gap-2">
      <h3 className="text-lg font-medium">Để lại đánh giá</h3>
      <div className="flex  gap-2 self-center">
        <StarRating rating={star} className="hover:cursor-pointer" onChange={setStar} />
        <i>{`(${star} sao)`}</i>
      </div>
      <Textarea value={comment} placeholder="Viết đánh giá" onChange={(e) => setComment(e.target.value)} />
      <div className="self-end">
        {review && <Button className="text-red-500" variant={"link"} onClick={handleDelete}>Xóa</Button>}
        <Button className=" bg-green-600 hover:bg-green-500" onClick={handleSubmit}>Gửi</Button>
      </div>
    </div>
  )
}