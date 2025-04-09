'use client';

import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function VNPayButton() {
    const [loading, setLoading] = useState(false);

    const handlePayment = async () => {
        setLoading(true);
        try {
            const res = await fetch("http://localhost:8080/api/payment/vnpay?amount=100000&orderInfo=Thanh+toan+don+hang");
            const data = await res.text();
            const paymentUrl = String(data);
            window.open(
                paymentUrl,
                "VNPayWindow",
                "width=800,height=600,top=100,left=400,resizable=yes,scrollbars=yes"
            );
        } catch (error) {
            console.error("Lỗi khi tạo thanh toán:", error);
            alert("Không thể khởi tạo thanh toán.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button className='w-full bg-white border-2 border-solid' onClick={handlePayment} disabled={loading}>
            {loading ? "Đang xử lý..." : "Thanh toán qua"}
            <img
                src="https://cdn.brandfetch.io/idV02t6WJs/theme/dark/logo.svg?c=1dxbfHSJFAPEGdCLU4o5B"
                alt="VNPay Logo"
                className="w-15 h-15"
            />
        </Button>
    );
}
