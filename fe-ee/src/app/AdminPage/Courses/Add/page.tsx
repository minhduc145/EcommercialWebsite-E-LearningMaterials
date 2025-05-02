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
    const [bannerFile, setBannerFile] = useState<File>()
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [tab2Ready, setTab2Ready] = useState(false)


    return (
        <Tabs defaultValue="information">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="information" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                    Thông tin
                </TabsTrigger>
                <TabsTrigger disabled={!tab2Ready} value="data" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
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
                        <InfoTab bannerFile={bannerFile} setBannerFile={setBannerFile} name={name} setName={setName} 
                        description={description} setDescription={setDescription} setTab2Ready={setTab2Ready} />
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="data">
                <Card>
                    <CardHeader>
                        <CardTitle>Tài liệu</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <DataTab />
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    )
}

const InfoTab = ({ bannerFile, setBannerFile, name, setName, description, setDescription, setTab2Ready }
    : { bannerFile: File | undefined, setBannerFile: (i: File) => void, name: string, setName: (i: string) => void, description: string, setDescription: (i: string) => void, setTab2Ready: (i: boolean) => void }) => {
    const handleInfoSave = () => {
        setTab2Ready(true)

    }
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
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files.length > 0) {
                                            setBannerFile(e.target.files[0]);
                                        }
                                    }}
                                />
                                <Button variant="outline" className="w-full">
                                    Tải ảnh bìa lên
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="relative mx-auto my-3 w-full max-w-4xl h-56 bg-gray-100 overflow-hidden rounded-md">
                    <img
                        className="object-fill w-full h-full"
                        src={bannerFile ? URL.createObjectURL(bannerFile) : "/global_imgs/KH-demo.png"}
                        alt="banner-img"
                    />
                </div>
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
            <div className="justify-self-end">
                <Button className="w-50 bg-green-500 hover:bg-green-600" onClick={handleInfoSave}>Lưu</Button>
            </div>
        </>
    )
}
import { FileExplorer } from "@/components/file-manager"

const DataTab = () => {
    return (
        <>
            <FileExplorer />
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
                <Button variant="outline"> <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 48 48">
                    <radialGradient id="oDvWy9qKGfkbPZViUk7TCa_eoxMN35Z6JKg_gr1" cx="-670.437" cy="617.13" r=".041" gradientTransform="matrix(128.602 652.9562 653.274 -128.6646 -316906.281 517189.719)" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#1ba1e3"></stop><stop offset="0" stopColor="#1ba1e3"></stop><stop offset=".3" stopColor="#5489d6"></stop><stop offset=".545" stopColor="#9b72cb"></stop><stop offset=".825" stopColor="#d96570"></stop><stop offset="1" stopColor="#f49c46"></stop></radialGradient><path fill="url(#oDvWy9qKGfkbPZViUk7TCa_eoxMN35Z6JKg_gr1)" d="M22.882,31.557l-1.757,4.024c-0.675,1.547-2.816,1.547-3.491,0l-1.757-4.024	c-1.564-3.581-4.378-6.432-7.888-7.99l-4.836-2.147c-1.538-0.682-1.538-2.919,0-3.602l4.685-2.08	c3.601-1.598,6.465-4.554,8.002-8.258l1.78-4.288c0.66-1.591,2.859-1.591,3.52,0l1.78,4.288c1.537,3.703,4.402,6.659,8.002,8.258	l4.685,2.08c1.538,0.682,1.538,2.919,0,3.602l-4.836,2.147C27.26,25.126,24.446,27.976,22.882,31.557z"></path><radialGradient id="oDvWy9qKGfkbPZViUk7TCb_eoxMN35Z6JKg_gr2" cx="-670.437" cy="617.13" r=".041" gradientTransform="matrix(128.602 652.9562 653.274 -128.6646 -316906.281 517189.719)" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#1ba1e3"></stop><stop offset="0" stopColor="#1ba1e3"></stop><stop offset=".3" stopColor="#5489d6"></stop><stop offset=".545" stopColor="#9b72cb"></stop><stop offset=".825" stopColor="#d96570"></stop><stop offset="1" stopColor="#f49c46"></stop></radialGradient><path fill="url(#oDvWy9qKGfkbPZViUk7TCb_eoxMN35Z6JKg_gr2)" d="M39.21,44.246l-0.494,1.132	c-0.362,0.829-1.51,0.829-1.871,0l-0.494-1.132c-0.881-2.019-2.467-3.627-4.447-4.506l-1.522-0.676	c-0.823-0.366-0.823-1.562,0-1.928l1.437-0.639c2.03-0.902,3.645-2.569,4.511-4.657l0.507-1.224c0.354-0.853,1.533-0.853,1.886,0	l0.507,1.224c0.866,2.088,2.481,3.755,4.511,4.657l1.437,0.639c0.823,0.366,0.823,1.562,0,1.928l-1.522,0.676	C41.677,40.619,40.091,42.227,39.21,44.246z"></path>
                </svg>Nhận gợi ý cho mô tả</Button>
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

