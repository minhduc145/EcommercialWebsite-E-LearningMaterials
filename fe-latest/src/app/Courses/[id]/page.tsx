'use client'
import { useParams } from 'next/navigation'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import Link from "next/link"
import { HomeIcon } from '@heroicons/react/24/outline'
import '@/app/assets/css/courseDetail/style.css'

export default function courseDetails() {
    const params = useParams()
    const id = params.id
    const c = {
        title:"title 1",
        description:"des 1",

    }
    return (
        <>
            <Breadcrumb className="px-4 py-2">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <Link href="/"><HomeIcon aria-hidden="true" className="size-4" /></Link>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <Link href="/Courses"> Học liệu</Link>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Chi tiết học liệu</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className='relative thumbnail w-screen h-[200px]'>
                <div className="absolute inset-0 bg-gradient-to-r from-[#1a2a54]/80 via-[#001f3f]/40 to-transparent z-10" />
                <div className='relative container mx-auto px-4 pt-2 text-white z-20'>hi</div>
            </div>
            <main>
                <div className='container mx-auto px-4'>

                </div>
            </main>
        </>

    )
}

