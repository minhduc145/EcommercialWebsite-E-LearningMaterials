"use client"
import { addCategory, deleteCategories, getCategories } from "@/app/api/api-courses";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CategoryModel } from "@/models/CategoryModel";
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Plus, RefreshCcw, Search, SlidersHorizontalIcon, SortAsc, SortDesc } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export default function Page() {
    const [selectedRows, setSelectedRows] = useState<string[]>([])
    const [data, setData] = useState<CategoryModel[]>([])
    const [reloadKey, setReloadKey] = useState(true)
    const [sortBy, setSortBy] = useState("name")
    const [descending, setDescending] = useState(true)
    const [searchInput, setSearchInput] = useState("")
    const [onSelectedIds, setOnSelectedIds] = useState<string[]>([])
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [selectedCategory, setSC] = useState<CategoryModel | null>()
    useEffect(() => {
        getCategories(searchInput, sortBy, descending).then(res => {
            setData(res.data)
        })
    }, [reloadKey, sortBy, descending])

    const onOpenChange = (v: boolean) => {
        setIsAddModalOpen(false);
        setSC(null)
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
        if (selectedRows.length === data.length) {
            setSelectedRows([])
        } else {
            setSelectedRows(data.map((category) => String(category.id)))
        }
    }
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        setReloadKey(!reloadKey)
    }

    function handleEdit(category: CategoryModel): void {
        setSC(category);
        requestAnimationFrame(() => {
            setTimeout(() => setIsAddModalOpen(true), 100);
        });
    }

    function handleDelete(): void {
        deleteCategories(onSelectedIds).then(() => {
            MyToaster("success");
            setOnSelectedIds([])
            setSelectedRows([])
            setIsDeleteModalOpen(false)
            setReloadKey(!reloadKey)
        }).catch(
            error => {
                MyToaster("error", error.response?.data?.details.join("\n"))
            }
        )
    }

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <Button className="flex items-center gap-2 hover:opacity-50" onClick={() => setIsAddModalOpen(true)}>
                    <Plus className="h-4 w-4" /> Thêm mới
                </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <form onSubmit={handleSearch} className="relative col-span-2">
                    <Input
                        type="text"
                        placeholder="Tìm kiếm tên loại, mô tả"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className="pl-4"
                    />
                    <Button type="submit" variant="ghost" className="absolute right-0 top-0 h-full px-3">
                        <Search className="h-4 w-4" />
                    </Button>
                </form>

                <div className="flex gap-2">
                    <Select value={sortBy} onValueChange={value => setSortBy(value)}>
                        <SelectTrigger className="w-full">
                            <div className="flex items-center gap-2">
                                <SlidersHorizontalIcon className="h-4 w-4" />
                                <SelectValue placeholder="Sắp xếp theo" />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="id">ID</SelectItem>
                            <SelectItem value="name">Tên loại</SelectItem>
                            <SelectItem value="description">Mô tả</SelectItem>
                            <SelectItem value="courseCount">Số học liệu</SelectItem>
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
                    <b>Danh sách gồm có:</b>&nbsp;{data.length} bản ghi
                </i>
                <div className="flex gap-2">
                    {selectedRows.length > 0 && (
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{selectedRows.length} đã chọn</span>
                            <Button variant="outline" size="sm" onClick={() => { setOnSelectedIds(selectedRows); setIsDeleteModalOpen(true) }}>
                                Xóa đã chọn
                            </Button>
                        </div>
                    )}
                    <Button variant={"secondary"} className="bg-green-500 hover:bg-green-600 text-white" onClick={() => setReloadKey(!reloadKey)}>
                        <RefreshCcw className="size-4" />
                    </Button>
                </div>
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
                                            checked={selectedRows.includes(String(category.id))}
                                            onCheckedChange={() => toggleRowSelection(String(category.id))}
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
                                                <DropdownMenuItem onClick={() => handleEdit(category)}>Chỉnh sửa</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => {
                                                    setOnSelectedIds([String(category.id)]);
                                                    requestAnimationFrame(() => {
                                                        setTimeout(() => setIsDeleteModalOpen(true), 0);
                                                    });
                                                }} className="text-red-600">
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
            <DeleteModal isDeleteModalOpen={isDeleteModalOpen} handleDelete={handleDelete} id={onSelectedIds} setIsDeleteModalOpen={setIsDeleteModalOpen} />
            <CategoryAddForm category={selectedCategory ?? undefined} onOpenChange={onOpenChange} open={isAddModalOpen} rk={reloadKey} setRK={setReloadKey} />
        </>
    );
}
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import MyToaster from "@/components/ui/toastify-template";

interface DeleteModalProps {
    id: string[];
    handleDelete: () => void;
    isDeleteModalOpen: boolean;
    setIsDeleteModalOpen: (open: boolean) => void;
};
function DeleteModal({ id, handleDelete, isDeleteModalOpen, setIsDeleteModalOpen }: DeleteModalProps) {
    return (
        <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Xác nhận xóa Danh mục:</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    <p>Bạn có chắc chắn muốn xóa Danh mục có id: {id.join(", ")}</p>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline" onClick={() => { setIsDeleteModalOpen(false) }}>
                            Hủy
                        </Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button variant="destructive" onClick={() => handleDelete()}>
                            Xóa
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function CategoryAddForm({ category, open, onOpenChange, rk, setRK }: 
    { category?: CategoryModel, open: boolean | false, onOpenChange: (i: boolean) => void,rk:boolean, setRK: (i: boolean) => void }) {
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")

    useEffect(() => {
        if (category) {
            setName(category.name);
            setDescription(category?.description ?? "");
        } else {
            setName("");
            setDescription("");
        }
    }, [category])

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        const id: number = Number(category?.id) ?? undefined
        const newCat: CategoryModel = {
            id, name, description, courseCount: 0
        }
        addCategory(newCat).then(() => {
            MyToaster("success")
            onOpenChange(false)
            setRK(!rk)
        })
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{!category ? 'Tạo Danh Mục' : 'Sửa Danh mục'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Tên</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Nhập tên danh mục"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Mô Tả</Label>
                            <Textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Nhập mô tả danh mục"
                                rows={3}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">
                                Hủy
                            </Button>
                        </DialogClose>
                        <Button type="submit">Lưu</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
