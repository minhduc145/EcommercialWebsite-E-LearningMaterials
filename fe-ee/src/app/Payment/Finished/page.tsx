'use client'

import { Button } from "@/components/ui/button";

export default function VnpayFinish(){
    const handleCloseWindow = () =>{
        if (window.opener) {
            window.close(); 
        } else {
            location.href = "/"; 
        }
    }
return(
    <>
    <p>Thanh toán thành công</p>
    <Button onClick={handleCloseWindow}>Đóng cửa sổ</Button>
    </>
)
}