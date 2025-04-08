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
import { HomeIcon } from 'lucide-react' 
import '@/app/assets/css/courseDetail/style.css'

export default function courseDetails() {
    const params = useParams()
    const id = params.id
    const c = {
        title: "Course's title 1",
        description: "des 1",

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
                        <Link href="/Courses">Học liệu</Link>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Chi tiết học liệu</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className='flex items-center justify-center relative thumbnail w-screen bg-center bg-[url("/global_imgs/KH-demo.png")] bg-cover h-[200px] left-0 bottom-0'>
                <div className="absolute inset-0 bg-gradient-to-r from-[#1a2a54]/80 via-[#001f3f]/40 to-transparent z-10"></div>
                <div className='flex relative  items-center gap-3 md:gap-10 container mx-auto px-4 pt-2 text-white z-20'>
                    <div>
                        <img src='/global_imgs/logoCourse.svg' alt='' />
                    </div>
                    <div className='flex flex-col gap-10 justify-between'>
                        <p className="text-3xl font-bold">
                            {c.title}
                        </p>
                        <p className="">
                            {c.title}
                        </p>
                    </div>
                </div>
            </div>
            <main>
                <div className='container mx-auto px-4'>

                </div>
            </main>

        </>

    )
}

