"use client"
import { getCategories } from "@/app/api/api-courses";
import { Button } from "@/components/ui/button";
import PaginationCluster from "@/components/ui/pagination-button-cluster";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDateTime } from "@/lib/utils";
import { CategoryModel } from "@/models/CategoryModel";
import { CourseModel } from "@/models/CourseModel";
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import Link from "next/link";

export default function Page() {
    const [selectedRows, setSelectedRows] = useState<number[]>([])
    const [data, setData] = useState<CategoryModel[]>([])
    const [reloadKey, setReloadKey] = useState(true)

    const getCate = () => {
        getCategories().then(res => {
            setData(res.data)
            setReloadKey(!reloadKey)
        })
    }

    useEffect(() => {
        getCate();
    }, [reloadKey])

    const toggleRowSelection = (id: number) => {
        console.log(selectedRows)
        if (selectedRows.includes(id)) {
            setSelectedRows(selectedRows.filter((rowId) => rowId !== id))
        } else {
            setSelectedRows([...selectedRows, id])
        }
    }
    const toggleAllRows = () => {
        if (selectedRows.length === data.length) {
            setSelectedRows([])
        } else {
            setSelectedRows(data.map((category) => category.id))
        }
    }
    function handleEdit(id: any): void {
        throw new Error("Function not implemented.");
    }

    function handleDelete(arg0: any[]): void {
        throw new Error("Function not implemented.");
    }

    return (
        <>
            <ToastContainer />
            <div className="flex justify-between items-center mb-6">
                    <Link href={"/AdminPage/Courses/Add"}>
                        <Button className="flex items-center gap-2 hover:opacity-50">
                            <Plus className="h-4 w-4" /> Thêm mới
                        </Button>
                    </Link>

                </div>
            <div className="flex justify-between items-center mb-2">
                <i>
                    <b>Danh sách gồm có:</b>&nbsp;{data.length} bản ghi
                </i>
                {selectedRows.length > 0 && (
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{selectedRows.length} đã chọn</span>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(selectedRows)}>
                            Xóa đã chọn
                        </Button>
                    </div>
                )}
            </div>

            <div className="border rounded-md overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        {!data || data.length === 0 ? <TableCaption className="my-3">Không có dữ liệu.</TableCaption> : null}
                        <TableHeader className="bg-blue-600 ">
                            <TableRow>
                                <TableHead className="w-[50px] ">
                                    <Checkbox
                                        checked={selectedRows.length === data.length && data.length > 0}
                                        onCheckedChange={toggleAllRows}
                                    />
                                </TableHead>
                                <TableHead className="text-white">ID</TableHead>
                                <TableHead className="max-w-[300px] text-white">Tên loại</TableHead>
                                <TableHead className="max-w-[500px] text-white">Mô tả</TableHead>
                                <TableHead className="max-w-[50px] text-white">Số lượng Học liệu</TableHead>
                                <TableHead className="text-white">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((category) => (
                                <TableRow key={category.id}>
                                    <TableCell>
                                        <Checkbox
                                            checked={selectedRows.includes(category.id)}
                                            onCheckedChange={() => toggleRowSelection(category.id)}
                                        />
                                    </TableCell>
                                    <TableCell className="font-medium">{category.id}</TableCell>
                                    <TableCell>
                                        <div className="max-w-[300px] line-clamp-3"><p>{category.name}</p></div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="max-w-[500px] truncate-text" title={category.description || "Không có"}>
                                            {category.description || "Không có"}
                                        </div>
                                    </TableCell>

                                    <TableCell className="text-center max-w-[50px]">{category.courseCount}</TableCell>

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
                                                <DropdownMenuItem onClick={() => handleEdit(category.id)}>Chỉnh sửa</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleDelete([category.id])} className="text-red-600">
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
        </>
    );
}