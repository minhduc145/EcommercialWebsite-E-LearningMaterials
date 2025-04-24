"use client"

import { Breadcrumb, BreadcrumbItem, BreadcrumbList } from "@/components/ui/breadcrumb"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import type React from "react"
import { ToastContainer } from "react-toastify"

export default function Page() {

    return (
        <>
            <Breadcrumb className="px-4 py-2">
                <BreadcrumbList>
                    <Link href="/AdminPage/Courses">
                        <BreadcrumbItem>
                            <ArrowLeft aria-hidden="true" className="size-4" /><span>&nbsp;Trở lại</span>
                        </BreadcrumbItem>
                    </Link>
                </BreadcrumbList>
            </Breadcrumb>
            <div className="w-[90%] mx-auto">
                <MainTab />
            </div>
            <ToastContainer />
        </>
    )
}


import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"
import MyEditor from "@/components/editor"

const MainTab = () => {
    const [bannerUrl, setBannerUrl] = useState("/global_imgs/KH-demo.png")
    return (
        <Tabs defaultValue="information">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="information" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                    Thông tin
                </TabsTrigger>
                <TabsTrigger value="data" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                    Tài liệu
                </TabsTrigger>
            </TabsList>
            <TabsContent value="information">
                <Card>
                    <CardHeader>
                        <CardTitle>Thông tin học liệu</CardTitle>
                        <CardDescription>Nhập thông tin chi tiết về học liệu của bạn.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-1 flex gap-2">
                            <div className="grow-1 flex flex-col gap-1">
                                <Label htmlFor="name">Tên học liệu</Label>
                                <Input id="name" placeholder="Nhập tên học liệu" />
                            </div>
                            <div className="w-auto flex flex-col gap-1">
                                <Label htmlFor="type">Loại</Label>
                                <Select>
                                    <SelectTrigger id="type">
                                        <SelectValue placeholder="Chọn loại học liệu" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="book">Sách</SelectItem>
                                        <SelectItem value="document">Tài liệu</SelectItem>
                                        <SelectItem value="video">Video</SelectItem>
                                        <SelectItem value="audio">Audio</SelectItem>
                                        <SelectItem value="other">Khác</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-1 flex gap-10 justify-around">
                            <div className="flex flex-col gap-1  justify-around">
                                <Label>Trạng thái</Label>
                                <RadioGroup defaultValue="open" className="flex gap-4">
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="open" id="open" />
                                        <Label htmlFor="open">Mở</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="closed" id="closed" />
                                        <Label htmlFor="closed">Đóng</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                            <div className="flex flex-col gap-1">
                                <Label htmlFor="price">Giá</Label>
                                <Input id="price" placeholder="Nhập giá" type="number" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <div>
                                <Label htmlFor="cover">Ảnh bìa</Label>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <Input id="cover-url" placeholder="Nhập đường dẫn ảnh" />
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-500">hoặc</span>
                                        <div className="relative flex-1">
                                            <Input
                                                id="cover-file"
                                                type="file"
                                                accept="image/*"
                                                className="absolute inset-0 cursor-pointer opacity-0"
                                            />
                                            <Button variant="outline" className="w-full">
                                                Chọn tệp ảnh
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div><img className="mx-auto my-3 max-w-full" src={bannerUrl} alt="banner-img" /></div>
                        </div>

                        <div className="space-y-1 flex-col gap-2">
                            <div>
                                <Label htmlFor="cover">Mô tả</Label>
                            </div>
                            <div className="max-w-full">
                            <MyEditor />

                            </div>

                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="data">
                <Card>
                    <CardHeader>
                        <CardTitle>Tài liệu</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="space-y-1">
                            <Label htmlFor="current">Current password</Label>
                            <Input id="current" type="password" />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="new">New password</Label>
                            <Input id="new" type="password" />
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
            <Button className="w-50 bg-green-600 hover:bg-green-400">Lưu thay đổi</Button>
        </Tabs>
    )
}

