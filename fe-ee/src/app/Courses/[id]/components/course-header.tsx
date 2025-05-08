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
      className="flex items-center justify-center relative thumbnail w-full bg-center left-0 bottom-0 bg-cover h-[300px]"
      style={{ backgroundImage: `url(${course?.thumbnailUrl})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-[#1a2a54]/80 via-[#001f3f]/40 to-transparent z-10"></div>
      <div className="flex relative items-center gap-3 md:gap-10 container mx-auto px-4 pt-2 text-white z-20">
        <div>
          <img src="/global_imgs/logoCourse.svg" alt="" />
        </div>
        <div className="flex flex-col gap-4 justify-between">
          <p className="text-3xl font-bold">{course?.title}</p>
          <div className="flex flex-col gap-1">
            <p className="font-bold">{course?.category.name}</p>
            <CourseHeaderStats course={course} averageStar={averageStar} />
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
      <p className="text-md lg:text-lg ring-1 ring-green-600/20 ring-inset rounded-md bg-green-50 inline-flex items-center px-2 py-1 font-semibold text-green-600">
        <Banknote className="size-3 md:size-5" /> &nbsp; {formatCurrency(course?.price ?? 0)}
      </p>
      <StarRating rating={averageStar} />
    </div>
  )
}
