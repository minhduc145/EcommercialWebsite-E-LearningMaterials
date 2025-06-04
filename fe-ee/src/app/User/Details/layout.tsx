'use client'
import ClientHeaderWrapper from "@/components/ClientHeaderWrapper"
import ClientFooterWrapper from "@/components/ClientFooterWrapper"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { BookOpen, FileText, UserCircleIcon, MessageSquare, LucideIcon, CreditCard } from "lucide-react"
import { useUserInfo } from "@/lib/user-info"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
interface NavItemType {
    icon: LucideIcon
    label: string
    url: string
    isActive?: boolean
}

export default function UserPageLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [activeItem, setActiveItem] = useState("")
    const pathname = usePathname();
    const navItems: NavItemType[] = [
        { icon: UserCircleIcon, label: "Thông tin cá nhân", url: "/User/Details/Info", isActive: activeItem === "/User/Details/Info" || pathname.startsWith("/User/Details/Info") },
        { icon: BookOpen, label: "Học liệu", url: "/User/Details/Courses", isActive: activeItem === "/User/Details/Courses" || pathname.startsWith("/User/Details/Courses") },
        { icon: CreditCard, label: "Yêu cầu hoàn tiền", url: "/User/Details/Return", isActive: activeItem === "/User/Details/Return" || pathname.startsWith("/User/Details/Return") },
        { icon: MessageSquare, label: "Tất cả thông báo", url: "/User/Details/Notification", isActive: activeItem === "/User/Details/Notification" || pathname.startsWith("/User/Details/Notification") },
    ]
    const { user } = useUserInfo({ redirectToLogin: false })
    return (
        <>
            <ClientHeaderWrapper color="" />
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
                    <div className="flex items-center justify-between max-w-7xl mx-auto">
                        <h1 className="text-2xl font-bold">CHI TIẾT TÀI KHOẢN</h1>
                        <div className="flex items-center gap-4">
                            <div className="bg-white text-gray-800 rounded-lg p-3 relative">
                                <div className="text-sm">Chào mừng bạn đến với hệ thống!</div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center text-2xl">😊</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex mx-auto container pt-5">
                    {/* Left Sidebar */}
                    <div className="w-80 h-auto hidden lg:block">
                        {/* User Profile */}
                        <div className="p-6 border-b bg-white shadow-sm">
                            <div className="flex items-center gap-3">
                                <Avatar className="w-16 h-16">
                                    <AvatarImage src={user?.avatarUrl} />
                                    <AvatarFallback className="bg-green-500 text-white">{user?.firstName}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="font-semibold text-gray-900">{`${user?.lastName} ${user?.firstName}`}</h3>
                                    <h4 className="font-semibold text-gray-700">{user?.email}</h4>
                                </div>
                            </div>
                        </div>

                        {/* Navigation Menu */}
                        <div className="p-4">
                            <nav className="space-y-2 flex flex-col gap-2">
                                {
                                    navItems.map((nav, index) => (
                                        <Link key={index} href={nav.url} onClick={() => setActiveItem(nav.url)}>
                                            <Button variant={nav.isActive ? 'default' : 'ghost'} className={`w-full justify-start gap-3 ${nav.isActive ? 'bg-blue-500' : ''}`}>
                                                <nav.icon className="w-5 h-5" />
                                                {nav.label}
                                            </Button>
                                        </Link>
                                    ))
                                }
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 p-6 pt-0">
                        {children}
                    </div>
                </div>
            </div>
            <ClientFooterWrapper />
        </>
    )
}

