"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import VNPayButton from "@/components/VNPAY-open-window"
import { formatDate } from "@/lib/utils"
import type { CourseModel } from "@/models/CourseModel"
import { useUserInfo } from "@/lib/user-info"
import { deleteReview, getReviewByUserAndCourse, getSubscriptionCardSummary, isSubscribedByUser, submitReview } from "@/app/api/api-courses"
import { StarRating } from "@/components/ui/star-rating"
import { Textarea } from "@/components/ui/textarea"
import { CourseReviewModel } from "@/models/CourseReviewModel"
import MyToaster from "@/components/ui/toastify-template"
import { Heart, Star } from "lucide-react"
import { deleteFromFavourite, markAsFavourite } from "@/app/api/api-favourites"

interface SubscriptionCardProps {
  course: CourseModel
  setResetKey: (i: boolean) => void
  resetKey: boolean
}

interface SubscriptionRes {
  isSubsAvailable: boolean | false;
  subscribed: boolean | false;
  subscribedAt: string;
  favourite: boolean | false;
  review: CourseReviewModel;
}

export default function SubscriptionCard({ course, setResetKey, resetKey }: SubscriptionCardProps) {
  const { user, isLoading, isError, logout } = useUserInfo({ redirectToLogin: false })
  const [summary, setSummary] = useState<SubscriptionRes>()
  const [resetCurrentKey, setResetCurrentKey] = useState(false)

  const handleAddToFavourite = () => {
    var promise = summary?.favourite ? deleteFromFavourite(course.id) : markAsFavourite(course.id)
    promise.then(res => {
      MyToaster("success", `${summary?.favourite ? "Xóa khỏi" : "Thêm vào"} danh sách yêu thích thành công`)
      setResetCurrentKey(!resetCurrentKey)
    }).catch(() => MyToaster("error", `${summary?.favourite ? "Xóa khỏi" : "Thêm vào"} danh sách yêu thích thất bại`))

  }

  useEffect(() => {
    if (user?.id)
      getSubscriptionCardSummary(user.id, course.id).then(res => {
        if (res.data) {
          setSummary(res.data)
        }
      }).catch(() => { })
  }, [resetKey, resetCurrentKey])

  return (
    <Card className="">
      <CardHeader>
        {summary?.subscribed == false && <span>Mua học liệu:</span>}
        <div className="flex flex-row gap-2 items-center">
          {summary?.subscribed ? (
            summary?.isSubsAvailable ? <Button className="grow bg-blue-600"><Link href={`/Courses/Use/${course.id}`}>Sử dụng học liệu</Link></Button> :
              <Button className="grow" variant={"destructive"}>Đăng ký này bị tạm đóng</Button>
          ) : (
            <VNPayButton amount={course.price} orderInfo={`THANHTOAN_${course.id}`} />
          )}
          {user?.id && <Heart fill={summary?.favourite ? 'red' : 'white'} className="w-6 h-6 hover:cursor-pointer" onClick={handleAddToFavourite} />}
        </div>

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
              {summary?.subscribed ? <p className="font-medium">{formatDate(summary?.subscribedAt)}</p> : <i>Chưa đăng ký</i>}
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
          <UserRate review={summary?.review} course={course} isShown={summary?.subscribed ?? false} resetKey={resetKey} setResetKey={setResetKey} />
        </div>

      </CardContent>
    </Card>
  )
}


function UserRate({ review, course, isShown = false, resetKey, setResetKey }: { review: CourseReviewModel | undefined, course: CourseModel, isShown: boolean, resetKey: boolean, setResetKey: (i: boolean) => void }) {
  const [star, setStar] = useState<number>(5)
  const [isEditing, setIsEditing] = useState(false)
  const [comment, setComment] = useState("")

  useEffect(() => {
    setIsEditing(review?.id ? true : false)
    setComment(review?.comment ?? "")
  }, [review])

  const handleSubmit = () => {
    submitReview(review?.id, course.id, comment, star == 0 ? 1 : star).then(res => {
      if (res.data) {
        setResetKey(!resetKey)
        MyToaster("success", `${isEditing ? "Sửa" : "Gửi"} đánh giá thành công`)
        setIsEditing(true)
      }
    }).catch(() => {
      MyToaster("error", `${isEditing ? "Sửa" : "Gửi"} đánh giá Thất bại (comment tối đa 100 kí tự)`)
    })
  }

  const handleDelete = () => {
    if (review?.id)
      deleteReview(review?.id).then(res => {
        if (res?.data == true) {
          setResetKey(!resetKey)
          setStar(5)
          setComment("")
          MyToaster("success", "Xóa đánh giá thành công")
        }
      }).catch()
  }

  if (isShown) return (
    <div className="flex flex-col gap-2">
      <h3 className="text-lg font-medium">{isEditing ? "Sửa" : "Để"}&nbsp;lại đánh giá</h3>
      <div className="flex  gap-2 self-center">
        <StarRating rating={star} className="hover:cursor-pointer" onChange={setStar} />
        <i>{`(${star} sao)`}</i>
      </div>
      <Textarea value={comment} placeholder="Viết đánh giá" onChange={(e) => setComment(e.target.value)} />
      <div className="self-end">
        {review && <Button className="text-red-500" variant={"link"} onClick={handleDelete}>Xóa</Button>}
        <Button className=" bg-green-500 hover:bg-green-600" onClick={handleSubmit}>{isEditing ? "Chỉnh sửa" : "Gửi"}</Button>
      </div>
    </div>
  )
}