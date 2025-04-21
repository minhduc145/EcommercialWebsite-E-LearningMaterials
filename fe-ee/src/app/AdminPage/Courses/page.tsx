"use client"

import type React from "react"

import { getSearchCourses } from "@/app/api/api-courses"
import PaginationCluster from "@/components/ui/pagination-button-cluster"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { CourseModel } from "@/models/CourseModel"
import { useEffect, useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MoreHorizontal, Search, Plus, SortAsc } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function Page() {
    const [courses, setCourses] = useState<CourseModel[]>([])
    const [totalPages, setTotalPages] = useState(0)
    const [totalElements, settotalElements] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [keyWord, setKeyWord] = useState("")
    const [searchInput, setSearchInput] = useState("")
    const [selectedRows, setSelectedRows] = useState<number[]>([])
    const [sortBy, setSortBy] = useState("newest")

    const onPageChange = (page: number) => {
        setCurrentPage(page)
        // Clear selections when changing pages
        setSelectedRows([])
    }

    // Handle search submission
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        setKeyWord(searchInput)
        setCurrentPage(1) // Reset to first page when searching
    }

    // Handle sort change
    const handleSortChange = (value: string) => {
        setSortBy(value)
        // You would implement actual sorting logic here
        // This could be done by adding a sort parameter to your API call
        // or by sorting the data client-side
    }

    // Handle add new course
    const handleAddNew = () => {
        console.log("Add new course")
        // Implement your add new course logic here
    }

    useEffect(() => {
        getSearchCourses(keyWord, currentPage).then((response) => {
            setCourses(response.data.content)
            setTotalPages(response.data.totalPages)
            settotalElements(response.data.totalElements)
            console.log(response)
        })
    }, [currentPage, keyWord])

    // Toggle selection of a single row
    const toggleRowSelection = (id: number) => {
        if (selectedRows.includes(id)) {
            setSelectedRows(selectedRows.filter((rowId) => rowId !== id))
        } else {
            setSelectedRows([...selectedRows, id])
        }
    }

    // Toggle selection of all rows
    const toggleAllRows = () => {
        if (selectedRows.length === courses.length) {
            setSelectedRows([])
        } else {
            setSelectedRows(courses.map((course) => course.id))
        }
    }

    // Handle edit action
    const handleEdit = (id: number) => {
        console.log(`Edit course with ID: ${id}`)
        // Implement your edit logic here
    }

    // Handle delete action
    const handleDelete = (id: number) => {
        console.log(`Delete course with ID: ${id}`)
        // Implement your delete logic here
    }

    // Handle view details action
    const handleViewDetails = (id: number) => {
        console.log(`View details for course with ID: ${id}`)
        // Implement your view details logic here
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <Button onClick={handleAddNew} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" /> Thêm mới
                </Button>
            </div>

            {/* Search and filter controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <form onSubmit={handleSearch} className="relative col-span-2">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                        type="text"
                        placeholder="Tìm kiếm theo tiêu đề, danh mục..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className="pl-9"
                    />
                    <Button type="submit" variant="ghost" className="absolute right-0 top-0 h-full px-3">
                        Tìm
                    </Button>
                </form>

                <div className="flex gap-2">
                    <Select value={sortBy} onValueChange={handleSortChange}>
                        <SelectTrigger className="w-full">
                            <div className="flex items-center gap-2">
                                <SortAsc className="h-4 w-4" />
                                <SelectValue placeholder="Sắp xếp theo" />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="newest">Mới nhất</SelectItem>
                            <SelectItem value="oldest">Cũ nhất</SelectItem>
                            <SelectItem value="price-asc">Giá tăng dần</SelectItem>
                            <SelectItem value="price-desc">Giá giảm dần</SelectItem>
                            <SelectItem value="title-asc">Tiêu đề A-Z</SelectItem>
                            <SelectItem value="subscribers">Lượt đăng ký</SelectItem>
                            <SelectItem value="status">Trạng thái</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="flex justify-between items-center mb-4">
                <i>
                    <b>Danh sách gồm có:</b>&nbsp;{totalElements} bản ghi
                </i>
                {selectedRows.length > 0 && (
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{selectedRows.length} đã chọn</span>
                        <Button variant="outline" size="sm">
                            Xóa đã chọn
                        </Button>
                    </div>
                )}
            </div>

            <div className="border rounded-md overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        {!courses || courses.length === 0 ? <TableCaption>Không có dữ liệu.</TableCaption> : null}
                        <TableHeader className="bg-gray-200">
                            <TableRow>
                                <TableHead className="w-[50px]">
                                    <Checkbox
                                        checked={selectedRows.length === courses.length && courses.length > 0}
                                        onCheckedChange={toggleAllRows}
                                    />
                                </TableHead>
                                <TableHead className="w-[60px]">ID</TableHead>
                                <TableHead className="w-[300px]">Tiêu đề</TableHead>
                                <TableHead className="w-[120px]">Danh mục</TableHead>
                                <TableHead className="w-[100px]">Trạng thái</TableHead>
                                <TableHead className="w-[100px] text-right">Giá (VNĐ)</TableHead>
                                <TableHead className="w-[150px]">Người tạo</TableHead>
                                <TableHead className="w-[80px] text-right">Đăng ký</TableHead>
                                <TableHead className="w-[100px] text-right">Ngày tạo</TableHead>
                                <TableHead className="w-[100px]">Thumbnail</TableHead>
                                <TableHead className="w-[70px]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {courses.map((course) => (
                                <TableRow key={course.id}>
                                    <TableCell>
                                        <Checkbox
                                            checked={selectedRows.includes(course.id)}
                                            onCheckedChange={() => toggleRowSelection(course.id)}
                                        />
                                    </TableCell>
                                    <TableCell className="font-medium">{course.id}</TableCell>
                                    <TableCell>
                                        <div className=" max-w-[300px] line-clamp-3"><p>{course.title}</p></div>
                                    </TableCell>
                                    <TableCell className="max-w-[120px]">
                                        <div className="truncate-text" title={course.category?.name || "Không có"}>
                                            {course.category?.name || "Không có"}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span
                                            className={`px-2 py-1 text-xs rounded-full font-medium 
                                            ${course.isAvailable ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                                        >
                                            {course.isAvailable ? "Đang mở" : "Tạm đóng"}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">{course.price?.toLocaleString("vi-VN")} ₫</TableCell>
                                    <TableCell className="max-w-[150px]">
                                        <div className="flex items-center gap-2">
                                            <img
                                                src={course.creator?.avatarUrl || "/placeholder.svg?height=24&width=24"}
                                                alt="Avatar"
                                                className="w-6 h-6 min-w-[24px] rounded-full"
                                            />
                                            <span
                                                className="truncate-text"
                                                title={`${course.creator?.firstName} ${course.creator?.lastName}`}
                                            >
                                                {course.creator?.firstName} {course.creator?.lastName}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">{course.subscriberNumber}</TableCell>
                                    <TableCell className="text-right">{new Date(course.createdAt).toLocaleDateString("vi-VN")}</TableCell>
                                    <TableCell>
                                        <img
                                            src={course.thumbnailUrl || "/placeholder.svg?height=40&width=56"}
                                            alt="Thumbnail"
                                            className="w-14 h-10 object-cover rounded-md"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-[150px]">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => handleViewDetails(course.id)}>Xem chi tiết</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleEdit(course.id)}>Chỉnh sửa</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleDelete(course.id)} className="text-red-600">
                                                    Xóa
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
            <div className="mt-4">
                <PaginationCluster totalPages={totalPages} initialPage={currentPage} onPageChange={onPageChange} />
            </div>
        </div>
    )
}
