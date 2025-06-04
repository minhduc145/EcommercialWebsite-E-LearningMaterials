"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog"
import { FileImageIcon, Loader2, Send, SendIcon, X } from "lucide-react"
import DOMPurify from "dompurify"
import MyEditor from "@/components/editor"
import MyToaster from "@/components/ui/toastify-template"
import { getCategories, submitCourseInfo } from "@/app/api/api-courses"
import { CategoryModel } from "@/models/CategoryModel"
import { CourseModel } from "@/models/CourseModel"

export default function MainCourseEditTab({ course = undefined }: { course?: CourseModel | undefined }) {
    const [id, setId] = useState(course?.id ?? "")
    const [bannerFile, setBannerFile] = useState<File | null>(null);
    const [name, setName] = useState(course?.title ?? "")
    const [description, setDescription] = useState(course?.description ?? "")
    const [price, setPrice] = useState(course?.price ?? 0)
    const [isAvailable, setIsAvailable] = useState(course?.isAvailable ?? true)
    const [isFeatured, setIsFeatured] = useState(course?.isFeatured ?? true)
    const [categoryId, setCategoryId] = useState(String(course?.category.id) ?? "")
    const [tab2Ready, setTab2Ready] = useState(course ? true : false)
    const [bannerUrl, setBannerUrl] = useState<string | undefined>(course?.thumbnailUrl ?? undefined)
    useEffect(() => { }, [course])
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
                    <CardContent className="space-y-4">
                        <InfoTab id={id} setId={setId} bannerFile={bannerFile} setBannerFile={setBannerFile} bannerUrl={bannerUrl}
                            name={name} setName={setName} price={price} setPrice={setPrice} isFeatured={isFeatured} setIsFeatured={setIsFeatured}
                            categoryId={categoryId} setCategoryId={setCategoryId} isAvailable={isAvailable} setIsAvailable={setIsAvailable}
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
                        <DataTab id={id} />
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    )
}

const InfoTab = (
    { id, setId, bannerFile, setBannerFile, bannerUrl, name, setName, categoryId, setCategoryId, isFeatured, setIsFeatured, isAvailable, price, setPrice, setIsAvailable, description, setDescription, setTab2Ready }
        : {
            id: string, setId: (i: string) => void, bannerUrl: string | undefined, isFeatured: boolean, setIsFeatured: (i: boolean) => void,
            bannerFile: File | null, setBannerFile: (i: File | null) => void, name: string, setName: (i: string) => void, categoryId: string, setCategoryId: (i: string) => void,
            isAvailable: boolean, setIsAvailable: (i: boolean) => void, price: number, setPrice: (i: number) => void,
            description: string, setDescription: (i: string) => void, setTab2Ready: (i: boolean) => void
        }) => {
    const [categories, setCategories] = useState<CategoryModel[]>([])
    const [displayPrice, setDisplayPrice] = useState<string>(
        price?.toLocaleString("vi-VN") ?? "0"
    );

    const handlePriceChange = (val: string) => {
        const raw = val.replace(/\D/g, "");
        const number = parseInt(raw || "0", 10);
        setPrice(number);
        const formatted = number.toLocaleString("vi-VN");
        setDisplayPrice(formatted === "0" ? '(Miễn phí)' : formatted);
    };

    useEffect(() => {
        getCategories().then(res => {
            setCategories(res.data)
        })
    }, [])

    const handleInfoSave = () => {
        submitCourseInfo({ id, bannerFile, name, description, price, isAvailable, isFeatured, categoryId }).then(res => {
            if (res && res.status === 200 && res.data?.details) {
                const c: CourseModel = res.data.details
                MyToaster("success", "Lưu Thông tin học liệu thành công!")
                setId(c.id)
                c.id && setTab2Ready(true)
            }
        }).catch(error => {
            const msg: string = error.response.data ? error.response.data.details : error.message;
            MyToaster("error", msg ?? "Không xác định")
            console.log(msg)
        })
    }
    return (
        <>
            <div className="space-y-1">
                <div className="grow-1 flex flex-col gap-1">
                    <Label htmlFor="name">Tên học liệu<span className='text-red-600'>*</span></Label>
                    <Input value={name} id="name" placeholder="Nhập tên học liệu" onChange={(e) => setName(e.currentTarget.value)} />
                </div>
            </div>

            <div className="space-y-1 flex gap-10 justify-around">
                <div className="flex flex-col gap-1  justify-around">
                    <Label>Trạng thái<span className='text-red-600'>*</span></Label>
                    <RadioGroup defaultValue={String(isAvailable)} onValueChange={(value) => setIsAvailable(value === "true")} className="flex gap-4">
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="true" id="open" />
                            <Label htmlFor="open">Mở</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="false" id="closed" />
                            <Label htmlFor="closed">Đóng</Label>
                        </div>
                    </RadioGroup>
                </div>
                <div className="flex flex-col gap-1  justify-around">
                    <Label>Thêm vào "Nổi bật"<span className='text-red-600'>*</span></Label>
                    <RadioGroup defaultValue={String(isFeatured)} onValueChange={(value) => setIsFeatured(value === "true")} className="flex gap-4">
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="true" id="ftrue" />
                            <Label htmlFor="true">Có</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="false" id="ffalse" />
                            <Label htmlFor="false">Không</Label>
                        </div>
                    </RadioGroup>
                </div>
                <div className="w-auto flex flex-col gap-1">
                    <Label htmlFor="type">Loại<span className='text-red-600'>*</span></Label>
                    <Select value={categoryId} onValueChange={val => setCategoryId(val)}>
                        <SelectTrigger id="type">
                            <SelectValue placeholder="Chọn loại học liệu" />
                        </SelectTrigger>
                        <SelectContent>
                            {categories && categories.map(cat => (
                                <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex flex-col gap-1">
                    <Label htmlFor="price">Giá<span className='text-red-600'>*</span></Label>
                    <Input
                        id="price"
                        type="text"
                        placeholder="Nhập giá"
                        value={displayPrice}
                        onChange={val => handlePriceChange(val.currentTarget.value)}
                    />
                </div>

            </div >
            <div className="space-y-1">
                <div>
                    <div className="grid grid-cols-1 gap-4">
                        <div className="flex items-center gap-2">
                            <div className="relative flex-1">

                                <div className="flex gap-3 items-center">
                                    <Input
                                        id="cover-file"
                                        type="file"
                                        accept="image/*"
                                        className="cursor-pointer hidden"
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files.length > 0) {
                                                setBannerFile(e.target.files[0]);
                                            }
                                        }}
                                    />
                                    <Label
                                        htmlFor="cover-file"
                                        className="inline-flex items-center gap-2 rounded border border-gray-300 px-4 py-1.5 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-100 hover:cursor-pointer transition"
                                    >
                                        <FileImageIcon className="size-4" /> Chọn ảnh bìa
                                    </Label>
                                    <div className={bannerFile ? "inline-block" : "hidden"}><X className="size-4 hover:cursor-pointer text-red-600" onClick={() => setBannerFile(null)} /></div>
                                    <i className="font-light">(bỏ qua để dùng ảnh mặc định)</i>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
                <div className="relative mx-auto my-3 max-w-4xl h-50 bg-gray-100 overflow-hidden rounded-md">
                    <img
                        className="object-fill w-full h-full"
                        src={bannerFile ? URL.createObjectURL(bannerFile) : bannerUrl ?? "/global_imgs/KH-demo.png"}
                        alt="banner-img"
                    />
                </div>
            </div>

            <div className="space-y-1 flex-col gap-2">
                <div>
                    <Label htmlFor="cover">Mô tả<span className='text-red-600'>*</span></Label>
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
import { askAI } from "@/app/api/api-ai"

const DataTab = ({ id }: { id: string }) => {
    if (id)
        return (
            <>
                <FileExplorer courseId={id} />
            </>
        )
}


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
        askAI(message).then(res => {
            setResponse(res?.data?.content);
            setIsLoading(false)
        }).catch(()=>{
            setResponse("Lỗi");
            setIsLoading(false)
        })
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Nhận gợi ý cho mô tả<SendIcon size={5} /></Button>
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
                            <Card className="flex-1 overflow-auto p-0">
                                <CardContent className="px-4 min-h-[100px]">
                                    {isLoading ? (
                                        <div className="space-y-2 mt-4">
                                            <Skeleton className="h-4 w-full" />
                                            <Skeleton className="h-4 w-[95%]" />
                                            <Skeleton className="h-4 w-[90%]" />
                                            <Skeleton className="h-4 w-[85%]" />
                                            <Skeleton className="h-4 w-[70%]" />
                                        </div>
                                    ) : response && (
                                        <div className="reset" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(response) }}></div>
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

