'use client'
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { NotificationModel } from "@/models/NotificationModel"
import { formatDateTime } from "@/lib/utils"
import useSWR from "swr"
import { getAllNotisByUser } from "@/app/api/api-messages"
import PaginationCluster from "@/components/ui/pagination-button-cluster"
export default function Page() {
    const [result, setResult] = useState<NotificationModel[]>([])
    const [totalElements, setTE] = useState(0)
    const [totalPages, setTP] = useState(0)
    const [currentPage, setCP] = useState(1)
    const [sort, setSort] = useState("createdAt-desc")
    const [keyword, SetKeyword] = useState("")

    const fetcher = () => getAllNotisByUser(keyword, sort, currentPage - 1).then(res => {
        const data = res?.data
        setResult(data?.content)
        setTE(data?.totalElements ?? 0)
        setTP(data?.totalPages ?? 0)
    }).catch(() => { });
    const { mutate } = useSWR<any>('notification-list', fetcher);

    useEffect(() => {
        mutate()
    }, [keyword, sort, currentPage])

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-4 ">
                <Input value={keyword} onChange={e => SetKeyword(e.currentTarget.value)} placeholder="Tìm tiêu đề, nội dung ..." />
        
                <div className="flex items-center gap-2">
                    <Select value={sort} onValueChange={setSort}>
                        <SelectTrigger className="w-56">
                            <SelectValue placeholder="Tất cả" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="createdAt-asc">Thời điểm nhận tăng dần</SelectItem>
                            <SelectItem value="createdAt-desc">Thời điểm nhận giảm dần</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <Card className="overflow-auto">
                <CardHeader>
                    <CardTitle>{totalElements ?? 0} Thông Báo</CardTitle>
                </CardHeader>
                {result && result.length > 0 &&
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[180px]">Thời điểm nhận</TableHead>
                                    <TableHead>Tiêu đề</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {result.map((notification) => (
                                    <TableRow key={notification.id} className="group">
                                        <TableCell colSpan={3} className="p-0">
                                            <Accordion type="single" collapsible className="w-full">
                                                <AccordionItem value={String(notification.id)} className="border-none">
                                                    <AccordionTrigger className="px-4 py-4 hover:no-underline hover:bg-muted/50">
                                                        <div className="flex items-center justify-between w-full mr-4">
                                                            <div className="flex items-center gap-4 text-left">
                                                                <span className="w-[180px] text-sm text-muted-foreground font-mono">
                                                                    {notification.createdAt && formatDateTime(notification.createdAt ?? "1970-01-01")}
                                                                </span>
                                                                <span className="font-medium flex-1">{notification.title}</span>
                                                            </div>
                                                        </div>
                                                    </AccordionTrigger>
                                                    <AccordionContent className="px-4 pb-4">
                                                        <div className="bg-muted/30 rounded-lg p-4 ml-[180px]">
                                                            <h4 className="font-semibold mb-2 text-foreground">Nội dung:</h4>
                                                            <div
                                                                className="reset font-sm"
                                                                dangerouslySetInnerHTML={{
                                                                    __html: notification.message ? notification.message : "<p class='text-center font-light'><i class='mx-auto'>Không có dữ liệu</i><p>",
                                                                }}
                                                            />
                                                        </div>
                                                    </AccordionContent>
                                                </AccordionItem>
                                            </Accordion>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>}
            </Card>
            {totalPages > 0 && <PaginationCluster currentPage={currentPage} totalPages={totalPages} onPageChange={setCP} />}

        </div>
    );
}