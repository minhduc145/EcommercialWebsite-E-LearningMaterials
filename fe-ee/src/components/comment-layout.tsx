"use client"
import { useEffect, useState } from "react"
import { CircleX, Star } from "lucide-react"
import { ProgressBar } from "@/components/ui/progress"
import PaginationCluster from "@/components/ui/pagination-button-cluster"
import type { CourseReviewModel } from "@/models/CourseReviewModel"
import { deleteReview, getAverageStarReview, getCourseReview } from "@/app/api/api-courses"
import { formatDateTime } from "@/lib/utils"
import { useUserInfo } from "@/lib/user-info"
import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import useSWR from "swr"
import { isAdmin } from "@/app/api/api-account"

interface CommentLayoutProps {
  id: string;
  resetKey?: boolean;
  forAdmin?: boolean | false
}

export default function CommentLayout({ id, resetKey, forAdmin }: CommentLayoutProps) {
  const { user, isError, logout } = useUserInfo({ redirectToLogin: false })

  const [reviews, setReviews] = useState<CourseReviewModel[]>([])
  const [reviewLength, setReviewLength] = useState<number>(0)
  const [totalPages, setTotalPages] = useState<number>(0)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [starRateMeta, setStarRateMeta] = useState<[number, number][]>([])
  const [averageStar, setAS] = useState(0)

  const [reset, setreset] = useState(false)
  const fetcher = () => getCourseReview(id, currentPage).then((response) => {
    setReviews(response?.data.reviewPageable.content)
    setReviewLength(response?.data.reviewPageable.totalElements)
    setTotalPages(response?.data.reviewPageable.totalPages)
    setStarRateMeta(response?.data.starRateMeta)
  }).catch(() => { })
  const { data, error, mutate, isLoading } = useSWR<any>('course-reviews', fetcher)

  const onPageChange = (page: number) => {
    setCurrentPage(page)
  }
  const handleDeleteReview = (id: number) => {
    if (forAdmin) {
      deleteReview(id)
      setreset(!reset)
    }
  }
  useEffect(() => {
    mutate('course-review')
    if (id) getAverageStarReview(id).then(res => {
      setAS(res?.data != 0 ? res?.data : 0)
    }).catch(() => { })
  }, [currentPage, resetKey, reset])

  return (
    <>
      {forAdmin && <p className="font-bold mb-4">Trung bình: <i>{Number(averageStar.toFixed(2))}</i></p>}

      <div className="flex flex-col items-center justify-center-safe gap-5 md:gap-20 mb-5 md:mb-0 lg:flex-row">
        <div className="flex flex-col items-center gap-2">
          <p className="font-medium text-7xl">{reviewLength}</p>
          <i className="font-light">({reviewLength} lượt đánh giá)</i>
        </div>

        <div className="flex flex-col gap-5">
          {starRateMeta.map((star, index) => {
            const percentage = star[1] !== 0 ? star[1] / reviewLength : 0
            return (
              <div key={index} className="flex gap-3 items-center">
                <div className="flex gap-1 items-center">
                  <div>{star[0]}</div>
                  <Star className="fill-yellow-400 text-yellow-400 h-5 w-5" />
                </div>
                <div className="w-56">
                  <ProgressBar value={percentage * 100} />
                </div>
                <i className="font-light text-sm">({star[1]})</i>
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
              <p className="text-gray-500 justify-self-center">Không có dữ liệu.</p>
            ) : (
              <div className="space-y-3">
                {reviews?.map((review) => (
                  <div key={review.id} className="flex flex-row items-center gap-5">
                    <Avatar>
                      <AvatarImage src={review.user.avatarUrl} alt="User" />
                      <AvatarFallback>{review.user.firstName.charAt(0)}</AvatarFallback>
                    </Avatar>

                    <div key={review.id} className="border-b pb-4 grow">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium">
                          {review.user.lastName}&nbsp;{review.user.firstName}&nbsp;
                          <i className="text-sm font-light">{review.user.id === user?.id ? "• Bạn" : ""}</i>
                        </h3>
                        <div className="flex gap-2">
                          <span className="text-sm text-gray-500">{formatDateTime(review.createdAt)}</span>
                          {forAdmin && <CircleX className="w-5 h-5 hover:fill-red-600 hover:text-white hover:cursor-pointer" onClick={() => handleDeleteReview(review.id)} />}
                        </div>
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
