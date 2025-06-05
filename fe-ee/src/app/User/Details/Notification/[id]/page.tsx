'use client'
import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { NotificationModel } from "@/models/NotificationModel"
import { formatDateTime } from "@/lib/utils"
import { getNotiById } from "@/app/api/api-messages"
import { useParams } from "next/navigation"
export default function Page() {
    const params = useParams();
    const id = String(params.id);
    const [result, setResult] = useState<NotificationModel>()

    useEffect(() => {
        if (id)
            getNotiById(id).then(res => setResult(res?.data)).catch(() => { })
    }, [])
    if (result)
        return (
            <div className="flex flex-col gap-2">
                <Card className="overflow-auto">
                    <CardHeader className="flex flex-col gap-4">
                        <CardTitle>Tiêu đề: {result.title ?? ""}</CardTitle>
                        <CardTitle className="font-normal">Thời điểm nhận: {formatDateTime(result.createdAt ?? "1970-01-01")}</CardTitle>
                        <CardTitle className="font-normal">Nội dung:</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div
                            className="reset font-sm"
                            dangerouslySetInnerHTML={{
                                __html: result.message ? result.message : "<p class='text-center font-light'><i class='mx-auto'>Không có dữ liệu</i><p>",
                            }}
                        />
                    </CardContent>
                </Card>
            </div>
        );
}