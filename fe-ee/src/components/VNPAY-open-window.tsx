'use client';

import { Button } from "@/components/ui/button";
import { url_backend_default } from "@/lib/public-var";
import { useUserInfo } from "@/lib/user-info";
import { Client, IMessage } from "@stomp/stompjs";
import { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import MyToaster from "./ui/toastify-template";
import axios from "axios";
import Image from "next/image";
axios.defaults.withCredentials = true;
axios.defaults.baseURL = url_backend_default;

interface IProps {
    amount: any;
    orderInfo: string;
}

export default function VNPayButton(props: IProps) {
    const [loading, setLoading] = useState(false);
    const { user } = useUserInfo({ redirectToLogin: false });
    const paymentClientRef = useRef<Client | null>(null);

    useEffect(() => {
        return () => {
            paymentClientRef.current?.deactivate();
        };
    }, []);

    const callPaymentWebSocket = () => {
        if (!user?.id) return;

        const socket = new SockJS(`${url_backend_default}/ws/payment`);
        const client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,

            onConnect: () => {
                console.log("✅ WebSocket connected");
                client.subscribe(`/topic/result/${user.id}`, (message: IMessage) => {
                    console.log("📩 Message received:", message.body);
                    if (message.body === "1") {
                        MyToaster("success", "Thanh toán thành công");
                        setTimeout(() => {
                            client.deactivate();
                            window.location.reload();
                        }, 1000);
                    } else {
                        client.deactivate();
                        MyToaster("error", "Thanh toán thất bại");
                    }
                });
            },

            onStompError: (frame) => {
                console.error("❌ STOMP error:", frame.headers["message"]);
            },

            onDisconnect: () => {
                console.log("🔌 WebSocket disconnected.");
            },
        });

        client.activate();
        paymentClientRef.current = client;
    };

    const handlePayment = async () => {
        if (!user?.id) {
            alert("Bạn phải đăng nhập trước");
            return;
        }

        callPaymentWebSocket();
        setLoading(true);

        try {
            const response = await axios.get(`/api/payment/vnpay`, {
                params: {
                    amount: props.amount,
                    orderInfo: props.orderInfo
                }
            });

            const redirectUrl = response.data;
            const popup = window.open(
                redirectUrl,
                "VNPayWindow",
                "width=800,height=600,top=100,left=400,resizable=yes,scrollbars=yes"
            );

            if (popup) {
                const interval = setInterval(() => {
                    if (popup.closed) {
                        console.log("🛑 Cửa sổ thanh toán đã đóng");
                        clearInterval(interval);
                        paymentClientRef.current?.deactivate();
                    }
                }, 500);
            }
        } catch (error: any) {
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                location.href = "/User/Login";
            } else {
                alert(error.message || "Không thể khởi tạo thanh toán.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            variant="default"
            className="w-full text-white bg-green-500"
            onClick={handlePayment}
            disabled={loading}
        >
            {loading ? "Đang xử lý..." : "Thanh toán qua"}
            <Image
                src="https://pay.vnpay.vn/images/brands/logo-en.svg"
                alt="VNPay Logo"
                className="w-15 h-15"
                width={15} height={15}
            />
        </Button>
    );
}
