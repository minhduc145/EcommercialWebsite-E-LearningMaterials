'use client'
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Banknote, } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

import Image from "next/image"
import PaginationCluster from "@/components/ui/pagination-button-cluster"
import { getFavouritesByUser } from "@/app/api/api-favourites"
import { FavouritesAndSubsDTO } from "@/models/FavouritesAndSubsDTO"
import { formatDateTime } from "@/lib/utils"
import useSWR from "swr"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { getSubsByUser, submitReturnReq } from "@/app/api/api-subs"

export default function Page() {
    const [tab1On, setOnTab1] = useState(true)
    const [tab2On, setOnTab2] = useState(false)
    const [result, setResult] = useState<FavouritesAndSubsDTO[]>([])
    const [totalElements, setTE] = useState(0)
    const [totalPages, setTP] = useState(0)
    const [currentPage, setCP] = useState(1)

    const [keyword, setKeyword] = useState("")
    const [sort, setSort] = useState("createdAt")
    const [descending, setDesc] = useState(true)

    const fetcher = () => tab2On ?
        getFavouritesByUser(keyword ?? "", sort, descending, currentPage - 1).then(res => {
            const data = res?.data;
            if (data) {
                setResult(data?.content)
                setTE(data?.totalElements)
                setTP(data?.totalPages)
            }
        }) :
        getSubsByUser(keyword ?? "", sort, descending, currentPage - 1).then(res => {
            const data = res?.data;
            if (data) {
                setResult(data?.content)
                setTE(data?.totalElements)
                setTP(data?.totalPages)
            }
        })

    const { mutate } = useSWR<any>('favourites-subs-list', fetcher)


    useEffect(() => {
        mutate()
    }, [sort, descending, keyword, currentPage, tab1On, tab2On])

    const toggleTabs = (tab: number) => {
        if (tab == 1) {
            setOnTab1(true);
            setOnTab2(false);
        } else if (tab == 2) {
            setOnTab1(false);
            setOnTab2(true);
        }
    }

    if (result)
        return (
            <div>
                <div className="flex gap-2 mb-6">
                    <Button variant="outline" className={`rounded-full  ${tab1On && 'bg-orange-400 hover:bg-orange-500 text-white'}`} onClick={() => toggleTabs(1)}>
                        Đã đăng ký
                    </Button>
                    <Button variant="outline" className={`rounded-full ${tab2On && 'bg-orange-400 hover:bg-orange-500 text-white'}`} onClick={() => toggleTabs(2)}>
                        Đã thêm vào yêu thích
                    </Button>
                    <Button variant="link" className="">
                        Gồm có {totalElements} bản ghi
                    </Button>
                </div>

                <div className="flex items-center gap-4 mb-6">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input placeholder="Tìm theo Tiêu đề hoặc Danh mục ..." className="pl-10" onChange={e => setKeyword(e.currentTarget.value)} />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Sắp xếp:</span>
                        <Select value={sort} onValueChange={setSort}>
                            <SelectTrigger className="w-32">
                                <SelectValue placeholder="Tất cả" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="createdAt">Thời gian thêm</SelectItem>
                                <SelectItem value="title">Tiêu đề</SelectItem>
                                <SelectItem value="price">Giá</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center gap-2">
                        <Select value={descending ? 'desc' : 'asc'} onValueChange={v => setDesc(v === "desc")}>
                            <SelectTrigger className="w-32">
                                <SelectValue placeholder="Tất cả" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="desc">Giảm dần</SelectItem>
                                <SelectItem value="asc">Tăng dần</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="flex gap-2 flex-row flex-wrap w-full mb-4">
                    {tab2On && <Tab2Details result={result} />}
                    {tab1On && <Tab1Details result={result} />}
                </div>
                {totalPages > 1 && <PaginationCluster currentPage={currentPage} totalPages={totalPages} onPageChange={setCP} />}
            </div>
        );
}

function Tab2Details({ result }: { result?: FavouritesAndSubsDTO[] }) {
    if (result)
        return (
            result.map((favourite) => {
                const course = favourite.course
                if (course)
                    return (
                        <div key={favourite.id} className="relative flex-1 min-w-[300px] max-w-[calc(33.333%-1rem)] bg-white rounded-lg shadow-lg dark:bg-gray-950 overflow-hidden">
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
                                <p className="text-gray-500">{course.category.name}</p>
                                <div className="flex justify-between flex-col lg:flex-row">
                                    <p className="text-sm flex items-center text-green-400">
                                        <Banknote className="w-4 h-4" />&nbsp;{course?.price && (course.price?.toLocaleString("vi-VN") ?? 0)}&nbsp;VND
                                    </p>
                                    <div className="text-sm ">
                                        Thêm lúc {formatDateTime(favourite?.createdAt ?? "1970-01-01")}
                                    </div>
                                </div>
                                <a href={`/Courses/${course.id}`} target="_blank">
                                    <Button size="sm" className="mt-4 w-full bg-blue-500 text-white">
                                        Xem chi tiết
                                    </Button>
                                </a>
                            </div>
                        </div>
                    )
            }
            )
        )
}


function Tab1Details({ result }: { result: FavouritesAndSubsDTO[] }) {
    const [selectedSub, setSelected] = useState<FavouritesAndSubsDTO>()
    const [openDialog, setOpenDialog] = useState(false)

    if (result)
        return (
            <div className="w-full p-6">
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[120px]">Tiêu đề</TableHead>
                                <TableHead className="w-[120px]">Danh mục</TableHead>
                                <TableHead className="w-[120px]">Thời điểm đăng ký</TableHead>
                                <TableHead className="w-[120px]">Giá mua</TableHead>
                                <TableHead className="w-[100px]">Khả dụng</TableHead>
                                <TableHead className="w-[120px]">Trạng thái</TableHead>
                                <TableHead className="w-[75px]">Tùy chọn</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {result.map((item) => {
                                var canReturn = true;
                                const yourDate = new Date(item.createdAt ?? "1970-01-01");
                                const now = new Date();
                                const diffInMs = now.getTime() - yourDate.getTime();
                                const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
                                if (diffInDays >= 1) {
                                    canReturn = false;
                                }
                                return (
                                    <TableRow key={item.id}>
                                        <TableCell className="underline text-blue-600"><a target="_blank" href={`/Courses/${item.course?.id}`}>{item.course?.title}</a></TableCell>
                                        <TableCell>{item.course?.category.name}</TableCell>
                                        <TableCell>{formatDateTime(item?.createdAt ?? "1970-01-01")}</TableCell>
                                        <TableCell>{item.boughtPrice && (item.boughtPrice).toLocaleString("vi")}</TableCell>
                                        <TableCell>
                                            <Badge variant="default" className={`${item.isAvailable ? "bg-green-500" : "bg-red-500"} `}>{item.isAvailable ? "Có" : "Không"}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            {item?.status ?? "<Không>"}
                                        </TableCell>
                                        <TableCell>
                                            {item.isAvailable && canReturn && <p onClick={() => {
                                                setSelected(item)
                                                setOpenDialog(true)
                                            }} className="font-thin italic text-blue-500 hover:cursor-pointer">YC hoàn tiền</p>}
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </div>
                {selectedSub && <ReturnRequestForm isOpen={openDialog} setIsOpen={setOpenDialog} selectedItem={selectedSub} />}
            </div>
        )
}

import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import MyToaster from "@/components/ui/toastify-template"

function ReturnRequestForm({ isOpen, setIsOpen, selectedItem }: { isOpen: boolean, setIsOpen: (open: boolean) => void, selectedItem: FavouritesAndSubsDTO }) {
    const [reason, setReason] = useState("")
    const submitForm = () => {
        submitReturnReq(selectedItem.id,reason).then(res=>{
            MyToaster("success")
        }).catch(()=>{
            MyToaster("error")
        })
    }
    if (selectedItem)
        return (
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Yêu cầu hoàn tiền, hủy đăng ký</DialogTitle>
                        <DialogClose />
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="font-medium">Tiêu đề:</span>
                                <span>{selectedItem?.course?.title}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium">Danh mục:</span>
                                <span>{selectedItem?.course?.category.name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium">Thời gian đăng ký:</span>
                                <span>{selectedItem?.createdAt && formatDateTime(selectedItem?.createdAt)}</span>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <Textarea placeholder="Nhập lí do yêu cầu hoàn ..." className="h-24 resize-none" required onChange={e=>setReason(e.currentTarget.value)} value={reason} />
                            <DialogClose asChild>
                                <Button disabled={!reason} className="w-full" onClick={submitForm}>Gửi yêu cầu</Button>
                            </DialogClose>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        )
}