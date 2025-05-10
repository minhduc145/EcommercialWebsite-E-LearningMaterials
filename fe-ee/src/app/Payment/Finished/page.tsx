'use client'

import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";

export default function VnpayFinish() {
    const searchParams = useSearchParams()
    const isSuccess = searchParams.has('success')
    const handleCloseWindow = () => {
        if (window.opener) {
            window.close();
        } else {
            location.href = "/";
        }
    }
    return (
        <>
            {isSuccess?(<p>Thanh toán THÀNH CÔNG</p>):(<p>Thanh toán THẤT BẠI</p>)}
            <Button onClick={handleCloseWindow}>Đóng cửa sổ</Button>
        </>
    )
}