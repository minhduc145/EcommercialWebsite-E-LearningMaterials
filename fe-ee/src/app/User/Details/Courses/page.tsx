'use client'
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Star, Settings, Banknote, } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { CourseBasicDTO } from "@/models/CourseBasicDTO"
import { getFeaturesSummary } from "@/app/api/api-courses"
import Image from "next/image"
import { StarRating } from "@/components/ui/star-rating"

export default function Page() {
    const [result, setResult] = useState<CourseBasicDTO[]>([])
    useEffect(() => {
        getFeaturesSummary().then(res => {
            setResult(res?.data)
        })
    }, [])
    if (result)
        return (
            <div>
                {/* Tab Navigation */}
                <div className="flex gap-2 mb-6">
                    <Button variant="outline" className="rounded-full">
                        Đã đăng ký
                    </Button>
                    <Button variant="default" className="rounded-full bg-blue-600 hover:bg-blue-700">
                        Đã thêm vào yêu thích
                    </Button>
                </div>

                {/* Search and Filter */}
                <div className="flex items-center gap-4 mb-6">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input placeholder="Nhập từ khoá ..." className="pl-10" />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Trạng thái:</span>
                        <Select defaultValue="all">
                            <SelectTrigger className="w-32">
                                <SelectValue placeholder="Tất cả" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tất cả</SelectItem>
                                <SelectItem value="active">Đang học</SelectItem>
                                <SelectItem value="completed">Hoàn thành</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Course Card */}
                <div className="flex gap-2 flex-row flex-wrap justify-center w-full">
                    {result.map((course) => (
                        <div key={course.id} className="relative flex-1 min-w-[300px] max-w-[calc(33.333%-1rem)] bg-white rounded-lg shadow-lg dark:bg-gray-950 overflow-hidden">
                            {course.isFeatured && (
                                <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                                    Nổi bật
                                </div>
                            )}
                            <Image
                                src={course.thumbnailUrl}
                                alt="Product Image"
                                width={400}
                                height={200}
                                className="w-full h-35 object-cover"
                                style={{ aspectRatio: "400/200", objectFit: "cover" }}
                            />
                            <div className="p-4">
                                <h3 className="text-lg font-semibold truncate">{course.title}</h3>
                                <p className="text-gray-500">{course.categoryName}</p>
                                <div className="flex justify-between flex-col lg:flex-row">
                                    <p className="text-sm flex items-center text-green-400">
                                        <Banknote className="w-4 h-4" />&nbsp;{course.price?.toLocaleString("vi-VN") ?? 0}&nbsp;VND
                                    </p>
                                    <div className="flex items-center gap-1 sm:gap-2">
                                        <StarRating size="sm" className="gap-0" rating={course.averageRating} />
                                        <span className="text-sm opacity-90">({course.commentCount} đánh giá)</span>
                                    </div>
                                </div>
                                <a href={`/Courses/${course.id}`} target="_blank">
                                    <Button size="sm" className="mt-4 w-full bg-blue-500 text-white">
                                        Xem chi tiết
                                    </Button>
                                </a>
                            </div>
                        </div>
                    ))}
                   
                </div>
            </div>
        );
}