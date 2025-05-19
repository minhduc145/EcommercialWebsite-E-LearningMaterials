"use client"

import type React from "react"

import { deleteCourse, getAverageStarReview, getSearchCourses } from "@/app/api/api-courses"
import PaginationCluster from "@/components/ui/pagination-button-cluster"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { CourseModel } from "@/models/CourseModel"
import { useEffect, useRef, useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MoreHorizontal, Search, Plus, SortAsc, RefreshCcw, Check, X, SortDesc, SlidersHorizontalIcon } from "lucide-react"
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
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import useSWR from "swr"
import Loading from "@/app/loading"
import CommentLayout from "@/components/comment-layout"

export default function Page() {
    const [courses, setCourses] = useState<CourseModel[]>([])
    const [totalPages, setTotalPages] = useState(0)
    const [totalElements, settotalElements] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [searchInput, setSearchInput] = useState("")
    const [selectedRows, setSelectedRows] = useState<string[]>([])
    const [deleteIds, setDeleteIds] = useState<string[]>([])
    const [sortBy, setSortBy] = useState("createdAt")
    const [descending, setDescending] = useState(true)
    const [reloadKey, setReloadKey] = useState(true)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [idForReview, setIdForReview] = useState("")
    const [averageStar, setAS] = useState(0)
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        requestAnimationFrame(() => {
            setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 500);
        });
    }, [idForReview]);

    const fetcher = () => getSearchCourses(currentPage, searchInput, sortBy, descending).then(res => {
        setCourses(res?.data?.content)
        setTotalPages(res?.data?.totalPages)
        settotalElements(res?.data?.totalElements)
    }).catch(() => { })
    const { data, error, isLoading, mutate } = useSWR<any>('admin-courses-list', fetcher)

    useEffect(() => {
        if (idForReview) getAverageStarReview(idForReview).then(res => {
            setAS(res?.data != 0 ? res?.data : 0)
        }).catch(() => { })
    }, [idForReview])

    useEffect(() => {
        mutate('admin-courses-lists')
    }, [currentPage, reloadKey, sortBy, descending])


    const onPageChange = (page: number) => {
        setCurrentPage(page)
        setSelectedRows([])
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        setReloadKey(!reloadKey)
    }

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
            MyToaster("success")
            setSelectedRows([])
            setDeleteIds([])
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
                        <Input
                            type="text"
                            placeholder="Tìm kiếm theo tiêu đề, danh mục, người tạo..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="pl-4"
                        />
                        <Button type="submit" variant="ghost" className="absolute right-0 top-0 h-full px-3">
                            <Search className="h-4 w-4" />
                        </Button>
                    </form>

                    <div className="flex gap-2">
                        <Select value={sortBy} onValueChange={(value => setSortBy(value))}>
                            <SelectTrigger className="w-full">
                                <div className="flex items-center gap-2">
                                    <SlidersHorizontalIcon className="h-4 w-4" />
                                    <SelectValue placeholder="Sắp xếp theo" />
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="id">ID</SelectItem>
                                <SelectItem value="createdAt">Ngày tạo</SelectItem>
                                <SelectItem value="price">Giá</SelectItem>
                                <SelectItem value="title">Tiêu đề</SelectItem>
                                <SelectItem value="subscriberNumber">Lượt đăng ký</SelectItem>
                                <SelectItem value="isAvailable">Trạng thái</SelectItem>
                                <SelectItem value="isFeatured">Nổi bật</SelectItem>
                                <SelectItem value="creatorId">Người tạo</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={String(descending)} onValueChange={(v) => setDescending(v === "true")}>
                            <SelectTrigger className="w-full">
                                <div className="flex items-center gap-2">
                                    {descending ? <SortDesc className="h-4 w-4" /> : <SortAsc className="h-4 w-4" />}
                                    <SelectValue placeholder="Chiều sắp xếp" />
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="true">Giảm dần</SelectItem>
                                <SelectItem value="false">Tăng dần</SelectItem>
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
                                    <Button variant="outline" size="sm" onClick={() => { setDeleteIds(selectedRows); setIsDeleteModalOpen(true); }}>
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
                                            checked={selectedRows.length === courses?.length && courses?.length > 0}
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
                                {courses?.map((course) => (
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
                                                src={course.thumbnailUrl}
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
                                                    <a href={`/Courses/${course.id}`} target="_blank"> <DropdownMenuItem>Xem chi tiết</DropdownMenuItem></a>
                                                    <DropdownMenuItem className="hover:cursor-pointer" onClick={() => setIdForReview(course.id)}>Xem đánh giá</DropdownMenuItem>
                                                    <Link href={`/AdminPage/Courses/Edit/${course.id}`}> <DropdownMenuItem className="hover:cursor-pointer">Chỉnh sửa</DropdownMenuItem></Link>
                                                    <DropdownMenuItem className="hover:cursor-pointer text-red-600" onClick={() => {
                                                        setDeleteIds([course.id]);
                                                        requestAnimationFrame(() => {
                                                            setTimeout(() => setIsDeleteModalOpen(true), 0);
                                                        });
                                                    }}>
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
                <hr className="m-10" />
                <div>
                    {idForReview &&
                        <>
                            <p className="font-bold mb-4">Trung bình: <i>{Number(averageStar.toFixed(2))}</i></p>

                            <div className="flex justify-between">
                                <p className="font-bold">Chi tiết đánh giá:</p>
                                <Button variant={"destructive"} onClick={() => setIdForReview("")}><X className="h-4 w-4" /></Button>
                            </div>

                            <CommentLayout id={idForReview} forAdmin={true} />

                            <div ref={messagesEndRef} />

                        </>
                    }

                </div>
            </div>
            <DeleteModal isDeleteModalOpen={isDeleteModalOpen} handleDelete={handleDelete} id={deleteIds} setIsDeleteModalOpen={setIsDeleteModalOpen} />
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
                    <p>Bạn có chắc chắn muốn xóa học liệu có id: {id.length > 1 ? id.join(", ") : id}</p>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline" onClick={() => { setIsDeleteModalOpen(false) }}>
                            Hủy
                        </Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button variant="destructive" onClick={() => handleDelete(id)}>
                            Xóa
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}