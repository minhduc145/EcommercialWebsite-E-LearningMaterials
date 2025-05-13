'use client'

import type React from "react"
import Link from "next/link"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList } from "@/components/ui/breadcrumb"
import { ToastContainer } from "react-toastify"
import MainCourseEditTab from "../../components/edit-course"
import { ArrowLeft } from "lucide-react"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { CourseModel } from "@/models/CourseModel"
import { getCourse } from "@/app/api/api-courses"

export default function Page() {
    const params = useParams();
    const id = String(params.id);
    const [course, setCourse] = useState<CourseModel>()
    useEffect(() => {
        if (id)
            getCourse(id).then(res => {
                setCourse(res?.data)
            }).catch(() => { })
    }, [id])
    return (
        <>
            <Breadcrumb className="px-4 py-2">
                <BreadcrumbList>
                    <Link href="/AdminPage/Courses">
                        <BreadcrumbItem>
                            <ArrowLeft aria-hidden="true" className="size-4" /><span>&nbsp;Trở lại</span>
                        </BreadcrumbItem>
                    </Link>
                </BreadcrumbList>
            </Breadcrumb>
            <div className="w-[90%] mx-auto">
{course && <MainCourseEditTab course={course} />}
            </div>
        </>
    )
}