import type React from "react"
import Link from "next/link"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList } from "@/components/ui/breadcrumb"
import MainCourseEditTab from "../../../../components/edit-course"
import { ArrowLeft } from "lucide-react"

export default function Page() {
    
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
                <MainCourseEditTab />
            </div>
        </>
    )
}