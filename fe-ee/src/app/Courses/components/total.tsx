"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CourseBasicDTO } from "@/models/CourseBasicDTO"
import { getByCates, getCategories, getNewest } from "@/app/api/api-courses"
import { ResultItem, ResultPanel } from "@/app/Search/page"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tab2Details } from "@/app/User/Details/Courses/page"
import { CategoryModel } from "@/models/CategoryModel"
import PaginationCluster from "@/components/ui/pagination-button-cluster"

export default function TotalCourses() {
    const [totalElements, setTE] = useState(0)
    const [totalPages, setTP] = useState(1)
    const [currentPage, setCP] = useState(1)
    const [results, setResults] = useState<CourseBasicDTO[]>([])
    const [cates, setCates] = useState<CategoryModel[]>([])

    const [sort, setSort] = useState("0")

    useEffect(() => {
         getByCates(sort,currentPage-1).then(res => {
            if (res?.data) {
                setResults(res.data?.content)
                setTE(res?.data?.totalElements)
                setTP(res?.data?.totalPages)
            }
        }).catch(() => setResults([]))
    }, [sort, currentPage])

    useEffect(() => {
        getCategories().then(res => {
            if (res?.data) {
                setCates(res.data)
            }
        }).catch(() => setCates([]))
    }, [])
    if (results)
        return (
            <div className="w-full">
                <div className="mx-auto">
                    <div className="flex justify-between items-center ">
                        <h2 className="text-lg sm:text-xl md:text-2xl font-bold px-2 sm:px-4 md:px-6 py-3 md:py-4">
                            THEO DANH MỤC
                        </h2>
                        <p>Tổng {totalElements} học liệu</p>

                        <div className="flex items-center gap-4">
                            <Select defaultValue="0" value={sort} onValueChange={setSort}>
                                <SelectTrigger className="w-56">
                                    <SelectValue placeholder="Tất cả" />
                                </SelectTrigger>
                                <SelectContent className="h-[30vh] overflow-auto">
                                    <SelectItem value="0">Tất cả</SelectItem>
                                    {
                                        cates && cates.map(cate => (
                                            <SelectItem key={cate.id} value={String(cate.id)}>{cate.name}</SelectItem>
                                        ))
                                    }
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="flex gap-6 flex-row flex-wrap w-full mb-4">
                        {
                            results && results?.map(course =>
                            (<div key={course.id} className="min-w-[300px] w-[calc(33.333%-1rem)] overflow-auto shadow-2xl">
                                <ResultItem loadInPage={true} course={course} />
                            </div>
                            )
                            )
                        }
                    </div>
                </div>
                {totalPages > 0 && <PaginationCluster currentPage={currentPage} totalPages={totalPages} onPageChange={setCP} />}
            </div>
        )
}
