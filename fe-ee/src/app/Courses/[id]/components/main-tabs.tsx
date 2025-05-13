"use client"
import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CourseFileAccordion from "./course-file-accordion"
import CommentLayout from "./comment-layout"
import type { CourseModel } from "@/models/CourseModel"
import type { CourseContainerModel } from "@/models/CourseContainerModel"
import { getCourseData } from "@/app/api/api-courses"

interface MainTabsProps {
  course: CourseModel
  resetCommentKey: boolean
}

export default function MainTabs({ course,resetCommentKey }: MainTabsProps) {
  const [courseData, setCourseData] = useState<CourseContainerModel[]>([])
  useEffect(() => {
    getCourseData(String(course.id))
      .then((response) => {
        setCourseData(response?.data)
      })
      .catch()
  }, [course.id])

  return (
    <div className="w-full max-w-4xl mx-auto p-4  rounded-md">
      <Tabs defaultValue="description" className="w-full">
        <TabsList className="grid w-full items-center justify-center mx-auto grid-cols-3 rounded-lg p-1 bg-slate-100">
          <TabsTrigger
            value="description"
            className="rounded-md data-[state=active]:bg-orange-400 data-[state=active]:text-white transition-all"
          >
            Mô tả
          </TabsTrigger>
          <TabsTrigger
            value="docs"
            className="rounded-md data-[state=active]:bg-orange-400 data-[state=active]:text-white transition-all"
          >
            Tài liệu
          </TabsTrigger>
          <TabsTrigger
            value="reviews"
            className="rounded-md data-[state=active]:bg-orange-400 data-[state=active]:text-white transition-all"
          >
            Đánh giá
          </TabsTrigger>
        </TabsList>

        <div className="mt-3 border shadow-xl rounded-lg p-6">
          <TabsContent value="description" className="space-y-4 flex flex-col-reverse">
            <br />
            <div
              className="reset"
              dangerouslySetInnerHTML={{
                __html: course.description ? course.description : "<p class='text-center font-light'><i class='mx-auto'>Không có dữ liệu</i><p>",
              }}
            />
          </TabsContent>

          <TabsContent value="docs" className="space-y-4">
            <div className="">
              {courseData.length !== 0 ? (
                <CourseFileAccordion course_data={courseData ?? []} />
              ) : (
                <p className="text-center">Không có dữ liệu</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-4">
            <div className="space-4">
              <CommentLayout id={String(course?.id)} resetCommentKey={resetCommentKey} />
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
