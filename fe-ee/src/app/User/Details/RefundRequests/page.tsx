'use client'
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { RefundRequestModel } from "@/models/RefundRequestModel"
import { getRefundsByUser } from "@/app/api/api-subs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatDateTime } from "@/lib/utils"


export default function Page() {
    const [sort, setSort] = useState("all")
    const [keyword, SetKeyword] = useState("")

    const [result, setResult] = useState<RefundRequestModel[]>([])
    useEffect(() => {
        getRefundsByUser(keyword,sort).then(res => {
            setResult(res?.data)
        }).catch(() => { })
    }, [sort,keyword])

    const getStatusBadge = (s: string) => {
        if (s)
            switch (s.toLowerCase()) {
                case "pending":
                    return <Badge variant="default" className={"bg-orange-500"}>Đang chờ</Badge>
                case "accepted":
                    return <Badge variant="default" className={"bg-green-500"}>Đã chấp nhận</Badge>
                case "denied":
                    return <Badge variant="default" className={"bg-red-500"}>Đã từ chối</Badge>
                default:
                    break;
            }
    }


    return (
        <div className="flex gap-2 flex-col">
            <div className="flex items-center gap-4 ">
                <Input value={keyword} onChange={e=>SetKeyword(e.currentTarget.value)} placeholder="Tìm tiêu đề ..."/>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Lọc:</span>
                    <Select value={sort} onValueChange={setSort}>
                        <SelectTrigger className="w-48">
                            <SelectValue placeholder="Tất cả" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tất cả</SelectItem>
                            <SelectItem value="accepted">Đã chấp nhận</SelectItem>
                            <SelectItem value="denied">Đã từ chối</SelectItem>
                            <SelectItem value="pending">Chưa xử lý</SelectItem>
                            <SelectItem value="createdAt-asc">Sắp xếp: Thời điểm tạo tăng dần</SelectItem>
                            <SelectItem value="createdAt-desc">Sắp xếp: Thời điểm tạo giảm dần</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <p>Bảng gồm {result.length} bản ghi</p>
            {result &&
                <div className="w-full bg-white">
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[120px]">Mã hoàn</TableHead>
                                    <TableHead className="w-[120px]">Tiêu đề</TableHead>
                                    <TableHead className="w-[120px]">Danh mục</TableHead>
                                    <TableHead className="w-[120px]">Thời điểm tạo y/c</TableHead>
                                    <TableHead className="w-[120px]">Số tiền y/c hoàn</TableHead>
                                    <TableHead className="w-[120px]">Lý do hoàn(người dùng)</TableHead>
                                    <TableHead className="w-[120px]">Thời điểm xét y/c</TableHead>
                                    <TableHead className="w-[100px]">Lý do hoàn (QTV)</TableHead>
                                    <TableHead className="w-[120px]">Trạng thái</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {result.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>{item.id}</TableCell>
                                        <TableCell><a target="_blank" href={`/Courses/${item.subscription.course?.id}`} className="underline text-blue-600">{item?.subscription?.course?.title}</a></TableCell>
                                        <TableCell>{item?.subscription?.course?.category.name}</TableCell>
                                        <TableCell>{formatDateTime(item?.createdAt ?? "1970-01-01")}</TableCell>
                                        <TableCell>{item.subscription?.boughtPrice && (item.subscription?.boughtPrice).toLocaleString("vi")}</TableCell>
                                        <TableCell>{item.userReason}</TableCell>
                                        <TableCell>{item?.updateAt ? formatDateTime(item?.updateAt) : '--:--'}</TableCell>
                                        <TableCell>{item.adminReason ?? "<Không>"}</TableCell>
                                        <TableCell>
                                            {getStatusBadge(item.status)}
                                        </TableCell>
                                    </TableRow>
                                )
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            }
        </div>
    );
}