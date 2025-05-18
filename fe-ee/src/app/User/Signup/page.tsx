"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { House } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import * as yup from "yup";
import axios from "axios";
import { url_backend_default } from "@/lib/public-var"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { submitSignUp } from "@/app/api/api-account"
import MyToaster from "@/components/ui/toastify-template"
import { setTimeout } from "timers"
import { ToastContainer } from "react-toastify"
axios.defaults.withCredentials = true;
axios.defaults.baseURL = url_backend_default;
const schema = yup.object({
    firstName: yup.string().required("Vui lòng nhập Họ"),
    lastName: yup.string().required("Vui lòng nhập Tên"),
    username: yup.string().required('Vui lòng nhập Username'),
    phone: yup
        .string()
        .matches(/^\d{10}$/, 'Vui lòng nhập SĐT (10 chữ số)')
        .required('Vui lòng nhập SĐT'),
    email: yup.string().email('Email không hợp lệ').required('Vui lòng nhập Email'),
    password: yup.string().min(3, 'Mật khẩu ít nhất 3 ký tự').required('Vui lòng nhập mật khẩu'),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref('password')], 'Mật khẩu không khớp')
        .required('Vui lòng xác nhận mật khẩu'),
});


export default function SignUpForm() {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = (data: any) => {

        submitSignUp(data).then(res => {
            const resData = res?.data
            if (resData.result == 1) {
                MyToaster("success", "Đăng ký thành công")
                setTimeout(() => {
                    location.href = "/User/Login"
                }, 1000)
            } else {
                MyToaster("error",res?.data.details)
            }

        })
    }

    return (
        <>
                <ToastContainer />

            <a className="absolute p-5 float-left" href="/">
                <House aria-hidden className="size-6" />
            </a>
            <div className=" mx-auto flex items-center justify-center min-h-screen py-6 bg-white lg:bg-muted ">
                <Card className="w-full max-w-sm mx-auto border-0 shadow-none lg:shadow-sm lg:border-sm">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl">Đăng ký tài khoản</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="">
                                    <Label htmlFor="firstName">Họ</Label>
                                    <Input
                                        {...register("firstName")}
                                        id="firstName"
                                        placeholder="Nguyễn"
                                    />
                                    {errors.firstName && (
                                        <p className="text-red-500 text-[12px]">{errors.firstName.message}</p>
                                    )}
                                </div>
                                <div className="">
                                    <Label htmlFor="lastName">Tên</Label>
                                    <Input
                                        {...register("lastName")}
                                        id="lastName"
                                        placeholder="Văn A"
                                    />
                                    {errors.lastName && (
                                        <p className="text-red-500 text-[12px]">{errors.lastName.message}</p>
                                    )}
                                </div>
                            </div>

                            <div className="">
                                <Label htmlFor="username">Tên đăng nhập</Label>
                                <Input
                                    id="username"
                                    type="text"
                                    {...register("username")}
                                />
                                {errors.username && (
                                    <p className="text-red-500 text-[12px]">{errors.username.message}</p>
                                )}
                            </div>

                            <div className="">
                                <Label htmlFor="phone">Số điện thoại</Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    placeholder="0912345678"
                                    {...register("phone")}
                                />
                                {errors.phone && (
                                    <p className="text-red-500 text-[12px]">{errors.phone.message}</p>
                                )}
                            </div>

                            <div className="">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    type={"email"}
                                    id="email"
                                    placeholder="example@email.com"
                                    {...register("email")}
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-[12px]">{errors.email.message}</p>
                                )}
                            </div>

                            <div className="">
                                <Label htmlFor="password">Mật khẩu</Label>
                                <Input
                                    id="password"
                                    type={"password"}
                                    {...register("password")}
                                />
                                {errors.password && (
                                    <p className="text-red-500 text-[12px]">{errors.password.message}</p>
                                )}
                            </div>

                            <div className="">
                                <Label htmlFor="confirmPassword">Nhập lại mật khẩu</Label>
                                <Input
                                    id="confirmPassword"
                                    type={"password"}
                                    {...register("confirmPassword")}
                                />
                                {errors.confirmPassword && (
                                    <p className="text-red-500 text-[12px]">{errors.confirmPassword.message}</p>
                                )}
                            </div>

                            <Button type="submit" className="w-full">
                                Đăng ký
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex justify-center">
                        <p className="text-sm text-muted-foreground">
                            Đã có tài khoản?{" "}
                            <Link href="/User/Login" className="text-primary underline underline-offset-4 hover:text-primary/90">
                                Đăng nhập
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </>
    )
}
