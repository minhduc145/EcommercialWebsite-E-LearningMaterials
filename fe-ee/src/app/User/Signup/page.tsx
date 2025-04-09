"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Eye, EyeOff, House } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function SignUpForm() {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        emailOrUsername: "",
        phone: "",
        address: "",
        password: "",
        confirmPassword: "",
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Form submission logic would go here
        console.log("Form submitted:", formData)
    }

    return (
        <>
        <a className="absolute p-5 float-left" href="/">
        <House aria-hidden className="size-6" />
      </a>
        <div className=" mx-auto flex items-center justify-center min-h-screen py-6 bg-white lg:bg-muted ">
            <Card className="w-full max-w-sm mx-auto border-0 shadow-none lg:shadow-sm lg:border-sm">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Đăng ký tài khoản</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">Họ</Label>
                                <Input
                                    id="firstName"
                                    name="firstName"
                                    placeholder="Nguyễn"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName">Tên</Label>
                                <Input
                                    id="lastName"
                                    name="lastName"
                                    placeholder="Văn A"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="emailOrUsername">Email hoặc tên đăng nhập</Label>
                            <Input
                                id="emailOrUsername"
                                name="emailOrUsername"
                                type="text"
                                placeholder="example@domain.com"
                                value={formData.emailOrUsername}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">Số điện thoại</Label>
                            <Input
                                id="phone"
                                name="phone"
                                type="tel"
                                placeholder="0912345678"
                                value={formData.phone}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="address">Địa chỉ</Label>
                            <Input
                                id="address"
                                name="address"
                                placeholder="Nhập địa chỉ của bạn"
                                value={formData.address}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Mật khẩu</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-0 top-0 h-full px-3"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Nhập lại mật khẩu</Label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    required
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-0 top-0 h-full px-3"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    <span className="sr-only">{showConfirmPassword ? "Hide password" : "Show password"}</span>
                                </Button>
                            </div>
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
