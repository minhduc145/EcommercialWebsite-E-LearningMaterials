"use client"

import { useEffect, useState } from "react"
import {
    FileText,
    Video,
    PanelLeftClose,
    HomeIcon,
    FileVideo,
    PanelLeftOpen,
    PanelLeft,
    Menu,
} from "lucide-react"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import Link from "next/link"

export default function CourseLayout() {
    const [openSections, setOpenSections] = useState<string[]>(["noi-dung-khoa-hoc"])
    const [sidebarMinimized, setSidebarMinimized] = useState(true)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [onMobile, setOnMobile] = useState(false)

    useEffect(()=>{

    },[])


    const toggleSidebar = () => {
        setSidebarMinimized(!sidebarMinimized)
        if (window.innerWidth < 768) {
            setMobileMenuOpen(!mobileMenuOpen)
        }
    }

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
                        <Link href="/Courses/1">Xem học liệu</Link>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Sử dụng học liệu</BreadcrumbPage>
                    </BreadcrumbItem>

                </BreadcrumbList>
            </Breadcrumb>





            <div className="flex flex-col md:flex-row min-h-max bg-background">
                <div className="md:hidden flex items-center justify-between p-4 border-b border-border">
                    <Button variant="ghost" size="icon" onClick={toggleSidebar}>
                    {sidebarMinimized ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
                    </Button>
                    <h1 className="text-lg font-semibold">Thông tin khóa học</h1>
                    <div className="w-9"></div> {/* Spacer for alignment */}
                </div>
                <div
                    className={cn(
                        "border-r border-border bg-card transition-all duration-300 ease-in-out",
                        sidebarMinimized ? "w-16 overflow-hidden" : "w-80",
                        " md:static h-[calc(100vh-64px)] md:h-screen z-40",
                        !mobileMenuOpen && "hidden md:block",
                    )}
                >
                    <div className={` hidden md:flex p-4 border-b border-border  items-center justify-between`}>
                        <h2 className={cn("text-lg font-semibold", sidebarMinimized && "hidden")}>NỘI DUNG</h2>
                        <Button variant="outline" size="icon" onClick={toggleSidebar} className="ml-auto">
                            {sidebarMinimized ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
                        </Button>
                    </div>

                    <div className={cn("overflow-auto h-[calc(100vh-64px)]", sidebarMinimized && "hidden")}>
                        <Accordion type="multiple" value={openSections} onValueChange={setOpenSections} className="w-full">
                            <Accordion type="multiple" className="w-full">
                                <AccordionItem value="bai-giang-e-learning" className="border-b border-border/50">
                                    <AccordionTrigger className="px-4 py-2">
                                        <span className="font-medium">Bài giảng E-Learning Scorm</span>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <Link href={`https://www.google.com`}>
                                            <div className="px-4 py-2 border-b border-border/50 bg-muted/50">
                                                <div className="flex items-center">
                                                    <Badge variant="secondary" className="mr-2">
                                                        <FileText className="h-3 w-3 mr-1" />
                                                        Bài giảng
                                                    </Badge>

                                                </div>
                                                <div className="pl-2 mt-2 font-medium">
                                                    Kế hoạch bài dạy Unit 7: Television - Lesson 2: A Closer Look 1
                                                </div>
                                            </div>
                                        </Link>

                                        <Link href={`https://www.google.com`}>
                                            <div className="px-4 py-2 border-b border-border/50 bg-muted/50">
                                                <div className="flex items-center">
                                                    <Badge variant="secondary" className="mr-2">
                                                        <FileVideo className="h-3 w-3 mr-1" />
                                                        Bài giảng
                                                    </Badge>

                                                </div>
                                                <div className="pl-2 mt-2 font-medium">
                                                    Kế hoạch bài dạy Unit 7: Television - Lesson 2: A Closer Look 1
                                                </div>
                                            </div>
                                        </Link>
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="ke-hoach-bai-day" className="border-b border-border/50">
                                    <AccordionTrigger className="px-4 py-2">
                                        <span className="font-medium">Kế hoạch bài dạy</span>
                                    </AccordionTrigger>
                                    <AccordionContent className="pl-6">
                                        <div className="flex items-center text-sm text-muted-foreground py-1">
                                            <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                                            <span>1 Học liệu</span>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>


                                <AccordionItem value="video-thuyet-minh" className="border-b border-border/50">
                                    <AccordionTrigger className="px-4 py-2">
                                        <span className="font-medium">Video Thuyết minh, hướng dẫn sử dụng bài giảng</span>
                                    </AccordionTrigger>
                                    <AccordionContent className="pl-6">
                                        <div className="flex items-center text-sm text-muted-foreground py-1">
                                            <Video className="h-4 w-4 mr-2 text-muted-foreground" />
                                            <span>1 Học liệu</span>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </Accordion>
                    </div>
                </div>

                <div className={cn("flex-1 overflow-auto transition-all duration-300", mobileMenuOpen && "md:ml-0")}>
                    <div className="px-0 md:px-6">

                        {/* {`https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent('https://pub-e96712ffb5c644eab6d6682c1ebe8bf3.r2.dev/note-02042025.txt')} */}
                        <iframe
                            src={`https://pub-e96712ffb5c644eab6d6682c1ebe8bf3.r2.dev/WebServices_notes_by_Sekhar_Sir_JavabynataraJ.pdf`}
                            // src={`https://m3u8player.org/player.html?url=https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8`}
                            title="YouTube video player" frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin" allowFullScreen
                            style={{
                                width: '100%',
                                height: '85dvh',
                                maxWidth: '100%',
                                maxHeight: '85dvh',
                                border: 'none',
                                overflow: 'hidden',
                            }}
                        >
                        </iframe>
                    </div>
                </div>
            </div >
        </>

    )
}
