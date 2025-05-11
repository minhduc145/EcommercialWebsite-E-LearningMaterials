"use client"

import { useEffect, useState } from "react"
import { PanelLeftClose, HomeIcon, PanelLeftOpen, } from "lucide-react"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { cn, GetFileIcon, GetFileTypeName } from "@/lib/utils"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { getCourseDataWithUrl, isSubscribedByUser } from "@/app/api/api-courses"
import { CourseContainerModel } from "@/models/CourseContainerModel"
import { Separator } from "@/components/ui/separator"
import { CourseFileModel } from "@/models/CourseFileModel"
import { link_r2_default } from "@/lib/public-var"

export default function CourseLayout() {
    const params = useParams();
    const courseId = String(params.id);

    const [isSubscribed, setIsSubscribed] = useState<boolean | false>(false)
    const [courseContainers, setCourseContainers] = useState<CourseContainerModel[]>([])
    const [openingFile, setOpeningFile] = useState<CourseFileModel>()


    const [sidebarMinimized, setSidebarMinimized] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const router = useRouter()
    const redirectToCourseView = () => {
        router.push("/Courses")
    }

    useEffect(() => {
        isSubscribedByUser(courseId).then(res => {
            if (res.data == true) {
                setIsSubscribed(res.data);
                getCourseDataWithUrl(courseId).then(res => {
                    setCourseContainers(res.data)
                }).catch(() => {
                })
            }
            else redirectToCourseView();
        }).catch(() => {
            redirectToCourseView();
        })
    }, [])

    const toggleSidebar = () => {
        setSidebarMinimized(!sidebarMinimized)
        if (window.innerWidth < 768) {
            setSidebarMinimized(false)
            setMobileMenuOpen(!mobileMenuOpen)
        }
    }

    if (isSubscribed)
        return (
            <>
                <Breadcrumb className="px-4 py-2">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <Link href="/"><HomeIcon aria-hidden="true" className="size-4" /></Link>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <Link href="/Courses">Học liệu</Link>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <Link href={`/Courses/${courseId}`}>Xem học liệu</Link>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Sử dụng học liệu</BreadcrumbPage>
                        </BreadcrumbItem>

                    </BreadcrumbList>
                </Breadcrumb>

                <div className="flex flex-col md:flex-row min-h-[85dvh] max-h-[85dvh]  bg-background">
                    <div className="md:hidden flex items-center justify-between p-4 border-b border-border">
                        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
                            {sidebarMinimized ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
                        </Button>
                        <h1 className="text-lg font-semibold">Thông tin khóa học</h1>
                        <div className="w-9"></div>
                    </div>
                    <div
                        className={cn(
                            "border-r border-border bg-card transition-all duration-300 ease-in-out",
                            sidebarMinimized ? "w-16 overflow-hidden" : "w-80",
                            " md:static flex flex-col min-h-[85dvh] max-h-[85dvh]  z-40",
                            !mobileMenuOpen && "hidden md:block",
                        )}
                    >
                        <div className={` hidden md:flex p-4 border-b border-border  items-center justify-between`}>
                            <h2 className={cn("text-lg font-semibold", sidebarMinimized && "hidden")}>NỘI DUNG</h2>
                            <Button variant="outline" size="icon" onClick={toggleSidebar} className="ml-auto">
                                {sidebarMinimized ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
                            </Button>
                        </div>
                        <div className={cn("h-[83%] overflow-auto", sidebarMinimized && "hidden h-[83%] overflow-auto")}>
                            <Accordion type="multiple" className="w-full">
                                <Accordion type="multiple" className="w-full">
                                    {courseContainers.length > 0 ? courseContainers.map((container, index) => {
                                        const files = container?.files
                                        return (
                                            <AccordionItem key={container.id} value={String(index)} className="border-b border-border/50 px-3">
                                                <AccordionTrigger className="px-4 ">
                                                    <span className="font-medium">📂 {index + 1}. {container.name}</span>
                                                </AccordionTrigger>
                                                <AccordionContent>
                                                    {files.length > 0 ? (
                                                        files.map((file, index) => (
                                                            <div key={index} className="hover:cursor-pointer" onClick={() => setOpeningFile(file)}>
                                                                <div className={`px-4 py-2 border border-white ${file.id === openingFile?.id ? 'bg-[#005fd0]/20' : 'bg-[grey]/5'} `}>
                                                                    <div className="flex items-center">
                                                                        <Badge variant="secondary" className={`mr-2  ${file.id === openingFile?.id ? 'bg-blue-600 text-white' : 'bg-white'}`}>
                                                                            <GetFileIcon type={file.type} />
                                                                            {GetFileTypeName(file.type)}
                                                                        </Badge>
                                                                    </div>
                                                                    <div className="pl-2 mt-2 font-medium">
                                                                        {file.name}
                                                                    </div>
                                                                </div>
                                                                <Separator />
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <p className="text-center py-3">Không có dữ liệu</p>
                                                    )}
                                                </AccordionContent>
                                            </AccordionItem>
                                        )
                                    }) : (
                                        <p className="text-center py-3">Không có dữ liệu</p>
                                    )}
                                </Accordion>
                            </Accordion>
                        </div>
                    </div>

                    <div className={cn("grow border flex justify-center items-center overflow-auto", mobileMenuOpen && "md:ml-0")}>
                        <FileContentView file={openingFile} />
                    </div>

                </div >
                <hr></hr>
            </>

        )
}

function FileContentView({ file }: { file: CourseFileModel | undefined }) {
    const r2BaseUrl = link_r2_default + "/";
    const getProcessedView = () => {
        const rawUrl = file?.url
        var embeddedUrl = "";
        switch (file?.type) {
            case "document": {
                if (file.extension === "pdf") embeddedUrl = r2BaseUrl + rawUrl
                else embeddedUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURI(r2BaseUrl + rawUrl)}`
                return (
                    <iframe
                        src={embeddedUrl}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        className="w-full h-full aspect-video"
                        allowFullScreen
                    >
                    </iframe>
                )
            }
            case "media-image":
                {
                    embeddedUrl = `https://gosoccerboy5.github.io/view-images/#${encodeURI(r2BaseUrl + rawUrl)}`
                    return (
                        <iframe
                            src={embeddedUrl}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            className="w-full h-full aspect-video"
                            allowFullScreen
                        >
                        </iframe>
                    )
                }
            case "media-audio":
                {
                    embeddedUrl = r2BaseUrl + rawUrl
                    return (
                        <iframe
                            src={embeddedUrl}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            className="w-full h-full aspect-video"
                            allowFullScreen
                        >
                        </iframe>
                    )
                }
            case "media-hls":
                {
                    embeddedUrl = `https://m3u8player.org/player.html?url=${encodeURI(r2BaseUrl + rawUrl)}`
                    return (
                        <iframe
                            src={embeddedUrl}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            className="w-full h-full aspect-video"
                            allowFullScreen
                        >
                        </iframe>
                    )
                }
            case "media-video":
                {
                    embeddedUrl = `https://m3u8player.org/player.html?url=${encodeURI(r2BaseUrl + rawUrl)}`
                    return (
                        <iframe
                            src={embeddedUrl}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            className="w-full h-full aspect-video"
                            allowFullScreen
                        >
                        </iframe>
                    )
                }
            case "scorm":
                {
                    embeddedUrl = (r2BaseUrl + rawUrl)
                    return (
                        <iframe
                            src={embeddedUrl}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            className="w-full h-full aspect-video"
                            allowFullScreen
                        >
                        </iframe>
                    )
                }
            case "link":
                return (
                    <div className="flex flex-col justify-center items-center gap-2">
                        <h2>Đường dẫn cho Tệp <b>{file.name}</b></h2>
                        <a className="text-blue-600 underline italic" href={file.url} title={file.url} target="_blank">{file.url}</a>
                    </div>
                )
            case "iframe":
                {
                    const srcMatch = rawUrl?.match(/src="([^"]+)"/);
                    if (srcMatch) {
                        const src = srcMatch[1].trim();
                        return (
                            <iframe
                                src={src}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                referrerPolicy="strict-origin-when-cross-origin"
                                className="w-full h-full aspect-video"
                                allowFullScreen
                            >
                            </iframe>
                        )
                    } else {
                        return <div dangerouslySetInnerHTML={{ __html: rawUrl ?? "" }} />
                    }

                }
            default:
                return "Không xác định được loại file"
        }
    }
    if (file)
        return (
            <>
                {getProcessedView()}
            </>
        )
    else
        return <p>Chọn bài giảng để xem</p>
}
