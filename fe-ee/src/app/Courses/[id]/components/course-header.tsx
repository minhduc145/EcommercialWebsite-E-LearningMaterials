"use client"
import { Banknote } from "lucide-react"
import { StarRating } from "@/components/ui/star-rating"
import type { CourseModel } from "@/models/CourseModel"
import { formatCurrency } from "@/lib/public-var"

interface CourseHeaderProps {
  course: CourseModel
  averageStar: number
}

export default function CourseHeader({ course, averageStar }: CourseHeaderProps) {
  return (
    <div
      className="flex shadow-md items-center relative thumbnail w-full bg-center left-0 bottom-0 bg-cover h-[300px]"
      style={{ backgroundImage: `url(${course?.thumbnailUrl})` }}
    >
      <div className="absolute inset-0"></div>
      
      <div className="w-auto max-w-[70%] relative container px-4 pt-6 pb-6 z-20  z-auto">
        <div className="flex relative items-center gap-3 md:gap-10 backdrop-blur-md bg-black/40 rounded-xl shadow-2xl p-6">
          <div>
            <img src="/global_imgs/logoCourse.svg" alt="" />
          </div>
          <div className="flex flex-col gap-4 justify-between text-white">
            <p className="text-3xl font-bold">{course?.title}</p>
            <div className="flex flex-col gap-1">
              <p className="italic">{course?.category.name}</p>
              <CourseHeaderStats course={course} averageStar={averageStar} />
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

interface CourseHeaderStatsProps {
  course: CourseModel
  averageStar: number
}

function CourseHeaderStats({ course, averageStar }: CourseHeaderStatsProps) {
  return (
    <div className="flex gap-1 md:gap-5">
      <p className="text-md lg:text-lg ring-1 ring-lime-600/20 ring-inset rounded-md bg-green-50 inline-flex items-center px-2 py-1 font-semibold text-green-600">
        <Banknote className="size-3 md:size-5" /> &nbsp; {formatCurrency(course?.price ?? 0)}
      </p>
      <StarRating rating={averageStar} />
    </div>
  )
}
