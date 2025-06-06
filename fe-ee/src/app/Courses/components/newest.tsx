"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CourseBasicDTO } from "@/models/CourseBasicDTO"
import { getNewest } from "@/app/api/api-courses"
import { ResultItem } from "@/app/Search/page"

export default function MusicVideoCarousel() {
    const scrollContainerRef = useRef<HTMLDivElement>(null)

    const handleNext = () => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current
            const cardWidth = container.querySelector("div")?.offsetWidth || 0
            const scrollAmount = cardWidth + 16
            container.scrollBy({ left: scrollAmount, behavior: "smooth" })
        }
    }

    const handlePrev = () => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current
            const cardWidth = container.querySelector("div")?.offsetWidth || 0
            const scrollAmount = cardWidth + 16
            container.scrollBy({ left: -scrollAmount, behavior: "smooth" })
        }
    }

    const [results, setResults] = useState<CourseBasicDTO[]>([])

    useEffect(() => {
        getNewest().then(res => {
            if (res?.data) {
                setResults(res.data)
            }
        }).catch(() => setResults([]))
    }, [])
    if (results)
        return (
            <div className="w-full">
                <div className="mx-auto">
                    <div className="flex justify-between items-center ">
                        <h2 className="text-lg sm:text-xl md:text-2xl font-bold px-2 sm:px-4 md:px-6 py-3 md:py-4">
                            MỚI THÊM GẦN ĐÂY
                        </h2>
                        <div className="flex items-center gap-4">
                            <div className="flex gap-2">
                                <Button onClick={handlePrev} variant="outline" size="icon" className="rounded-full">
                                    <ChevronLeft className="h-5 w-5" />
                                </Button>
                                <Button onClick={handleNext} variant="outline" size="icon" className="rounded-full">
                                    <ChevronRight className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div ref={scrollContainerRef} className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
                        {results.map((course) => (
                            <div
                                key={course.id}
                                className="relative group flex-shrink-0"
                                style={{
                                    width: "calc(100vw - 3rem)",
                                    maxWidth: "362px",
                                    minWidth: "250px",
                                }}
                            >
                                <ResultItem loadInPage={true} course={course} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
}
