"use client"

import type React from "react"

import { deleteCourse, getCourse, getSearchCourses } from "@/app/api/api-courses"
import PaginationCluster from "@/components/ui/pagination-button-cluster"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { CourseModel } from "@/models/CourseModel"
import { useEffect, useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MoreHorizontal, Search, Plus, SortAsc, LoaderIcon, Loader2, RefreshCcw, RefreshCcwDotIcon, Check, X } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import MyToaster from "@/components/ui/toastify-template"
import { formatDateTime } from "@/lib/utils"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function Page() {
    const [courses, setCourses] = useState<CourseModel[]>([])
    const [totalPages, setTotalPages] = useState(0)
    const [totalElements, settotalElements] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [keyWord, setKeyWord] = useState("")
    const [searchInput, setSearchInput] = useState("")
    const [selectedRows, setSelectedRows] = useState<string[]>([])
    const [sortBy, setSortBy] = useState("newest")
    const [reloadKey, setReloadKey] = useState(true)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [deleteId, setDeleteId] = useState<string[]>([])




    const onPageChange = (page: number) => {
        setCurrentPage(page)
        setSelectedRows([])
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        setKeyWord(searchInput)
        setCurrentPage(1)
    }

    const handleSortChange = (value: string) => {
        setSortBy(value)
    }

    const getCourse = () => {
        getSearchCourses(keyWord, currentPage).then((response) => {
            setCourses(response.data.content)
            setTotalPages(response.data.totalPages)
            settotalElements(response.data.totalElements)
            console.log(response)
        })
    }

    useEffect(() => {
        getCourse();
    }, [currentPage, reloadKey])

    const toggleRowSelection = (id: string) => {
        console.log(selectedRows)
        if (selectedRows.includes(id)) {
            setSelectedRows(selectedRows.filter((rowId) => rowId !== id))
        } else {
            setSelectedRows([...selectedRows, id])
        }
    }

    const toggleAllRows = () => {
        if (selectedRows.length === courses.length) {
            setSelectedRows([])
        } else {
            setSelectedRows(courses.map((course) => course.id))
        }
    }

    const handleDelete = (id: string[]) => {
        deleteCourse(id).then(() => {
            MyToaster("success", "")
            setSelectedRows([])
            setIsDeleteModalOpen(false)
            setReloadKey(!reloadKey)
        })
    }

    return (
        <>
            <div>
                <div className="flex justify-between items-center mb-6">
                    <Link href={"/AdminPage/Courses/Add"}>
                        <Button className="flex items-center gap-2 hover:opacity-50">
                            <Plus className="h-4 w-4" /> Thêm mới
                        </Button>
                    </Link>

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

                <div className="flex justify-between items-center mb-2">
                    <i>
                        <b>Danh sách gồm có:</b>&nbsp;{totalElements} bản ghi
                    </i>
                    <div className="flex gap-2 items-center">
                        <div>
                            {selectedRows.length > 0 && (
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium">{selectedRows.length} đã chọn</span>
                                    <Button variant="outline" size="sm" onClick={() => { setIsDeleteModalOpen(true); setDeleteId(selectedRows) }}>
                                        Xóa đã chọn
                                    </Button>
                                </div>
                            )}
                        </div>
                        <Button variant={"secondary"} className="bg-green-500 hover:bg-green-600 text-white" onClick={() => setReloadKey(!reloadKey)}>
                            <RefreshCcw className="size-4" />
                        </Button>

                    </div>

                </div>

                <div className="border rounded-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <Table>
                            {!courses || courses.length === 0 ? <TableCaption className="my-3">Không có dữ liệu.</TableCaption> : null}
                            <TableHeader className="bg-blue-600 ">
                                <TableRow>
                                    <TableHead className="w-[50px] ">
                                        <Checkbox
                                            checked={selectedRows.length === courses.length && courses.length > 0}
                                            onCheckedChange={toggleAllRows}
                                        />
                                    </TableHead>
                                    <TableHead className="w-[60px] text-white">ID</TableHead>
                                    <TableHead className="w-[300px] text-white">Tiêu đề</TableHead>
                                    <TableHead className="w-[120px] text-white">Danh mục</TableHead>
                                    <TableHead className="w-[100px] text-white">Trạng thái</TableHead>
                                    <TableHead className="w-[100px] text-white">Nổi bật</TableHead>
                                    <TableHead className="w-[100px] text-right text-white">Giá (VNĐ)</TableHead>
                                    <TableHead className="w-[150px] text-white">Người tạo</TableHead>
                                    <TableHead className="w-[80px] text-right text-white">Đăng ký</TableHead>
                                    <TableHead className="w-[100px] text-right text-white">Ngày tạo</TableHead>
                                    <TableHead className="w-[100px] text-white">Thumbnail</TableHead>
                                    <TableHead className="w-[70px] text-white">Actions</TableHead>
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
                                                className={`px-2 py-1 text-xs rounded-full font-medium ${course.status ? "text-amber-600 bg-amber-100 text-[9px]" : course.isAvailable ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                                            >
                                                {course.status ? course.status : course.isAvailable ? "Đang mở" : "Tạm đóng"}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            {course.isFeatured ? 
                                                <div className="rounded-full h-6 w-6 bg-green-100 p-1">
                                                    <Check className="h-4 w-4 text-green-600" />
                                                </div> : <div className="rounded-full h-6 w-6 bg-red-100 p-1">
                                                    <X className="h-4 w-4 text-red-600" />
                                                </div>}
                                        </TableCell>
                                        <TableCell className="text-right">{course.price?.toLocaleString("vi-VN")} ₫</TableCell>
                                        <TableCell className="max-w-[150px]">
                                            <div className="flex items-center gap-2">
                                                <Avatar>
                                                    <AvatarImage src={course.creator?.avatarUrl} alt="User settings" />
                                                    <AvatarFallback>{course.creator?.firstName.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <span
                                                    className="truncate-text"
                                                    title={`${course.creator?.firstName} ${course.creator?.lastName}`}
                                                >
                                                    {course.creator?.firstName} {course.creator?.lastName}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">{course.subscriberNumber}</TableCell>
                                        <TableCell className="text-right">{formatDateTime(course.createdAt)}</TableCell>
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
                                                    <a href={`/Courses/${course.id}`} target="_blank"> <DropdownMenuItem>Xem chi tiết</DropdownMenuItem></a>
                                                    <Link href={`/AdminPage/Courses/Edit/${course.id}`}> <DropdownMenuItem className="hover:cursor-pointer">Chỉnh sửa</DropdownMenuItem></Link>
                                                    <DropdownMenuItem className="hover:cursor-pointer text-red-600" onClick={() => { setIsDeleteModalOpen(true); setDeleteId([course.id]) }}>
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
            <DeleteModal isDeleteModalOpen={isDeleteModalOpen} handleDelete={handleDelete} id={deleteId} setIsDeleteModalOpen={setIsDeleteModalOpen} />
        </>
    )
}

interface DeleteModalProps {
    id: string[];
    handleDelete: (id: string[]) => void;
    isDeleteModalOpen: boolean;
    setIsDeleteModalOpen: (open: boolean) => void;
};
function DeleteModal({ id, handleDelete, isDeleteModalOpen, setIsDeleteModalOpen }: DeleteModalProps) {
    return (
        <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Xác nhận xóa Học liệu:</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    <p>Bạn có chắc chắn muốn xóa học liệu có id: {id.join(", ")}</p>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
                        Hủy
                    </Button>
                    <Button variant="destructive" onClick={() => handleDelete(id)}>
                        Xóa
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}