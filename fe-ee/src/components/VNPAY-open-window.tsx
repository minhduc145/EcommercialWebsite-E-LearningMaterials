'use client';

import { Button } from "@/components/ui/button";
import { useState } from "react";
interface IProps {
    amount: any,
    orderInfo: string
}
export default function VNPayButton(props: IProps) {
    const [loading, setLoading] = useState(false);

    const handlePayment = () => {
        setLoading(true);

        const url = new URL("http://localhost:8080/api/payment/vnpay");
        url.searchParams.append("amount", props.amount);
        url.searchParams.append("orderInfo", props.orderInfo);

        fetch(url.toString(), {
            credentials: "include",
            method: "GET"
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(String(res.status) ?? "Lỗi");
                }
                return res.text();
            })
            .then(data => {
                window.open(
                    String(data),
                    "VNPayWindow",
                    "width=800,height=600,top=100,left=400,resizable=yes,scrollbars=yes"
                );
            })
            .catch(error => {
                if (error.message === "401") {
                    alert("Bạn phải đăng nhập trước")
                    location.href = "/User/Login"
                } else
                    alert(error.message || "Không thể khởi tạo thanh toán.");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <Button variant="default" className='w-full text-white bg-green-500 ' onClick={handlePayment} disabled={loading}>
            {loading ? "Đang xử lý..." : "Thanh toán qua"}
            <img
                src="https://cdn.brandfetch.io/idV02t6WJs/theme/dark/logo.svg?c=1dxbfHSJFAPEGdCLU4o5B"
                alt="VNPay Logo"
                className="w-15 h-15"
            />
        </Button>
    );
}
