"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { FavouritesAndSubsDTO } from "@/models/FavouritesAndSubsDTO"
import { formatDateTime } from "@/lib/utils"
import { useEffect, useState } from "react"
import { RefundRequestModel } from "@/models/RefundRequestModel"
import { getRefundRequests, submitHandleReturnReq } from "@/app/api/api-subs"
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RefreshCcw, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

// export interface RefundRequestModel {
//     id: number
//     status: string
//     userReason: string
//     createdAt: string
//     updateAt: string
//     adminReason: string
//     subscription: FavouritesAndSubsDTO
// }

// interface RefundRequestsTableProps {
//     refundRequests: RefundRequestModel[]
// }

export default function RefundRequestsTable() {

    const [result, setR] = useState<RefundRequestModel[]>([])
    const [sort, setS] = useState("all")
    const [keyword, setK] = useState("")
    const [openDialog, setOpenDialog] = useState(false)
    const [selected, setSL] = useState<RefundRequestModel>()

    useEffect(() => {
        query()
    }, [sort, openDialog])

    const query = () => {
        getRefundRequests(sort).then((res) => {
            setR(res?.data);
        })
    }

    const getStatusBadge = (status: string) => {
        const statusLower = status.toLowerCase()
        switch (statusLower) {
            case "pending":
                return (
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                        Chờ xử lý
                    </Badge>
                )
            case "accepted":
                return (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Đã chấp nhận
                    </Badge>
                )
            case "denied":
                return (
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                        Đã từ chối
                    </Badge>
                )
            default:
                return <Badge variant="outline">{status}</Badge>
        }
    }

    return (
        <>
            <div className="flex gap-5 pb-5">
                <Input value={keyword} onChange={e => setK(e.currentTarget.value)} />
                <Button variant="outline" onClick={query}><Search className="h-4 w-4" /></Button>
            </div>
            <Select value={sort} onValueChange={v => setS(v)}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Chọn" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectItem value="all">Tất cả</SelectItem>
                        <SelectItem value="pending">Đang chờ xử lý</SelectItem>
                        <SelectItem value="accepted">Đồng ý hoàn</SelectItem>
                        <SelectItem value="denied">Không đồng ý</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[80px]">ID</TableHead>
                            <TableHead>Trạng thái</TableHead>
                            <TableHead className="table-cell">Lý do khách hàng</TableHead>
                            <TableHead className="table-cell">Lý do quản trị viên</TableHead>
                            <TableHead>Gói đăng ký</TableHead>
                            <TableHead className="table-cell">Ngày tạo</TableHead>
                            <TableHead className="table-cell">Ngày cập nhật</TableHead>
                            <TableHead className="table-cell">Xử lý</TableHead>

                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {result.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                    Không có yêu cầu hoàn tiền nào
                                </TableCell>
                            </TableRow>
                        ) : (
                            result.map((request) => (
                                <TableRow key={request.id}>
                                    <TableCell className="font-medium">{request.id}</TableCell>
                                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                                    <TableCell className="table-cell max-w-[200px] truncate" title={request.userReason}>
                                        {request.userReason}
                                    </TableCell>
                                    <TableCell className="table-cell max-w-[200px] truncate" title={request.adminReason}>
                                        {request.adminReason || "—"}
                                    </TableCell>
                                    <TableCell>{request.subscription?.course?.title || `ID: ${request.subscription?.id}`}</TableCell>
                                    <TableCell className="table-cell">{formatDateTime(request.createdAt)}</TableCell>
                                    <TableCell className="table-cell">{formatDateTime(request.updateAt)}</TableCell>

                                    <TableCell className="table-cell">
                                        {
                                            request.status === "pending" &&
                                            <a className="hover:cursor-pointer underline" onClick={() => { setSL(request); setOpenDialog(true) }}>Xử lý</a>
                                        }
                                    </TableCell>

                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
                {selected && <ReturnRequestForm isOpen={openDialog} setIsOpen={setOpenDialog} selectedItem={selected} />}
            </div>
        </>
    )
}


function ReturnRequestForm({ isOpen, setIsOpen, selectedItem }: { isOpen: boolean, setIsOpen: (open: boolean) => void, selectedItem: RefundRequestModel }) {
    const [reason, setReason] = useState("")
    const [action, setA] = useState("denied")

    const submitForm = () => {
        if (selectedItem) submitHandleReturnReq(String(selectedItem.id), reason, action).then(() => { })
    }

    if (selectedItem)
        return (
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Xử lý Yêu cầu hoàn tiền, hủy đăng ký</DialogTitle>
                        <DialogClose />
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="font-medium">Tiêu đề:</span>
                                <Select value={action} onValueChange={v => setA(v)}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Chọn" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel></SelectLabel>
                                            <SelectItem value="accepted">Đồng ý hoàn</SelectItem>
                                            <SelectItem value="denied">Không đồng ý</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>

                        </div>
                        <div className="space-y-3">
                            <Textarea placeholder="Nhập lí do ..." className="h-24 resize-none" required onChange={e => setReason(e.currentTarget.value)} value={reason} />
                            <DialogClose asChild>
                                <Button disabled={!reason} className="w-full" onClick={submitForm}>Gửi yêu cầu</Button>
                            </DialogClose>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        )
}
