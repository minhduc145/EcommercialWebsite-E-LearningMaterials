"use client"

import { Breadcrumb, BreadcrumbItem, BreadcrumbList } from "@/components/ui/breadcrumb"
import { ArrowLeft, Loader2, Send } from "lucide-react"
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
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")


    const [isReady, setIsReady] = useState(false)

    
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
                        <CardTitle></CardTitle>
                        <CardDescription>Nhập thông tin chi tiết về học liệu của bạn.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <InfoTab bannerUrl={bannerUrl} setBannerUrl={setBannerUrl} name={name} setName={setName} description={description} setDescription={setDescription} />
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="data">
                <Card>
                    <CardHeader>
                        <CardTitle>Tài liệu</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <DataTab ready={isReady}/>
                    </CardContent>
                </Card>
            </TabsContent>

            <Button className="w-50 bg-green-600 hover:bg-green-400">Lưu thay đổi</Button>
        </Tabs>
    )
}

const InfoTab = ({ bannerUrl, setBannerUrl, name, setName, description, setDescription }
    : { bannerUrl: string, setBannerUrl: (i: string) => void, name: string, setName: (i: string) => void, description: string, setDescription: (i: string) => void }) => {
    const defaultBannerUrl = ("/global_imgs/KH-demo.png");

    return (
        <>
            <div className="space-y-1">
                <div className="grow-1 flex flex-col gap-1">
                    <Label htmlFor="name">Tên học liệu</Label>
                    <Input value={name} id="name" placeholder="Nhập tên học liệu" onChange={(e) => setName(e.currentTarget.value)} />
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
                <div className="flex flex-col gap-1">
                    <Label htmlFor="price">Giá</Label>
                    <Input id="price" placeholder="Nhập giá" type="number" />
                </div>

            </div>
            <div className="space-y-1">
                <div>
                    <div className="grid grid-cols-1 gap-4">
                        <div className="flex items-center gap-2">
                            <div className="relative flex-1">
                                <Input
                                    id="cover-file"
                                    type="file"
                                    accept="image/*"
                                    className="absolute inset-0 cursor-pointer opacity-0"
                                />
                                <Button variant="outline" className="w-full">
                                    Tải ảnh bìa lên
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
                <div><AIModal name={name} handleChange={setDescription} /></div>
                <div className="max-w-full">
                    <MyEditor value={description} handleChange={setDescription} />

                </div>
            </div>
        </>
    )
}
import { FileExplorer } from "@/components/file-manager"

const DataTab = ({ready}:{ready:boolean}) => {
    return (
        <>
            <FileExplorer ready ={ready}/>
        </>
    )
}

import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { DialogClose } from "@radix-ui/react-dialog"
import DOMPurify from 'dompurify';

const AIModal = ({ name, handleChange }: { name: string, handleChange: (i: string) => void }) => {
    const [cue, setCue] = useState("");
    const [response, setResponse] = useState("");
    const [wordCount, setWordCount] = useState(300);
    const [isLoading, setIsLoading] = useState(false)
    const [allowIcons, setAllowIcons] = useState(false)



    const handleSubmit = async () => {
        var message = `
Viết ví dụ cho phần mô tả của một khóa học online "${name?.trim()}" từ những thông tin gợi ý bên dưới (khoảng ${wordCount} từ).

Yêu cầu trả về bắt buộc phải đáp ứng các tiêu chí sau: 
1. Trả về nội dung HTML thuần, không dùng Markdown (dù chỉ 1 ký tự như ** hay -).
2. Không tự ý thêm ảnh, src, class attributes.
3. Trình bày rõ ràng theo đoạn, xuống dòng, cách đoạn, bullet, bold, italic hợp lý. 
4. Không lặp lại yêu cầu, không thêm nội dung mẫu. 
${allowIcons && "5. Chèn các icon văn bản dạng ký tự Unicode (ví dụ: ✅, 🎯, 📚, 💡...), KHÔNG dùng icon từ thư viện ngoài như FontAwesome hay SVG."}

Thông tin gợi ý: ${cue}
        `;
        setIsLoading(true)
        setResponse("")
        const res = await fetch("/api/groq", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ message }),
        });
        setIsLoading(false)
        const data = await res.json();
        setResponse(data.content);
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Nhận gợi ý cho mô tả</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[80%] max-h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="mx-auto">Tạo mô tả mẫu:</DialogTitle>
                </DialogHeader>
                <div className="overflow-y-auto flex-1">
                    <div className="grid gap-4 py-4">
                        <div className="flex flex-col gap-4">
                            <div>
                                <p className="font-bold">Tên học liệu:</p>
                                <p>{name ? name : "<Không có dữ liệu>"}</p>
                            </div>
                            <div className="flex flex-col md:flex-row gap-5">
                                <div>
                                    <p className="font-bold">Số từ:</p>
                                    <Input type="number" min={50} max={500} defaultValue={wordCount} onChange={(e) => setWordCount(e.currentTarget.valueAsNumber ?? 50)}></Input>
                                </div>
                                <div className="flex flex-col gap-1  justify-around">
                                    <Label>Cho phép thêm Icon, Emoji:</Label>
                                    <RadioGroup defaultValue="0" className="flex gap-4">
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="1" id="y" onClick={() => setAllowIcons(true)} />
                                            <Label htmlFor="y">Có</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="0" id="n" defaultChecked={true} onClick={() => setAllowIcons(false)} />
                                            <Label htmlFor="n">Không</Label>
                                        </div>
                                    </RadioGroup>
                                </div>
                            </div>
                            <div>
                                <p className="font-bold">Các thông tin cần có:</p>
                                <Textarea value={cue}
                                    onChange={(e) => setCue(e.target.value)}></Textarea>
                            </div>
                            <div className="flex justify-between items-center my-2">
                                <p className="font-bold">Kết quả:</p>
                            </div>
                            <Card className="flex-1 overflow-auto">
                                <CardContent className="px-4 min-h-[100px]">
                                    {isLoading ? (
                                        <div className="space-y-2 mt-4">
                                            <Skeleton className="h-4 w-full" />
                                            <Skeleton className="h-4 w-[90%]" />
                                            <Skeleton className="h-4 w-[95%]" />
                                            <Skeleton className="h-4 w-[85%]" />
                                            <Skeleton className="h-4 w-[70%]" />
                                        </div>
                                    ) : response && (
                                        <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(response) }}></div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={handleSubmit} disabled={!cue.trim() || isLoading} className="bg-blue-600">
                        {isLoading ? (
                            <>
                                Xử lý <Loader2 className="h-4 w-4 animate-spin" />
                            </>
                        ) : (
                            <>
                                Tạo mô tả mẫu <Send className="h-4 w-4" />
                            </>
                        )}
                    </Button>
                    <DialogClose asChild>
                        <Button onClick={() => handleChange(response)}>Sử dụng</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

