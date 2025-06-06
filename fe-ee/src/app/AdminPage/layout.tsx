"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  FileText,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Building2,
  type LucideIcon,
  CreditCard,
  User2Icon,
  TypeIcon,
  UserCircle2,
  MessageCircleMoreIcon,
  MessageCirclePlusIcon,
  Undo2Icon,
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { usePathname } from "next/navigation"
import { useUserInfo } from "@/lib/user-info"

// Define types for our navigation items
interface NavItemType {
  icon: LucideIcon
  label: string
  url: string
  isActive?: boolean
}

interface NavGroupType {
  title?: string
  items: NavItemType[]
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const { user, isLoading, isError, logout } = useUserInfo({ redirectToLogin: false })

  const [title, setTitle] = useState("Chi tiết")
  const [collapsed, setCollapsed] = useState(false)
  const [activeItem, setActiveItem] = useState("")

  const infoItems: NavItemType[] = [
    { icon: UserCircle2, label: "Thông tin tài khoản", url: "/AdminPage/UserInfo", isActive: activeItem === "/AdminPage/UserInfo" || pathname.startsWith("/AdminPage/UserInfo") },
  ]
  const mainNavItems: NavItemType[] = [
    { icon: FileText, label: "Quản lý học liệu", url: "/AdminPage/Courses", isActive: activeItem === "/AdminPage/Courses" || pathname.startsWith("/AdminPage/Courses") },
    { icon: TypeIcon, label: "Quản lý Loại học liệu", url: "/AdminPage/Categories", isActive: activeItem === "/AdminPage/Categories" || pathname.startsWith("/AdminPage/Categories") },
  ]
  const userItems: NavItemType[] = [
    { icon: User2Icon, label: "Quản lý Người dùng", url: "/AdminPage/Users", isActive: activeItem === "/AdminPage/Users" || pathname.startsWith("/AdminPage/Users") },
  ]
  const messeageItems: NavItemType[] = [
    { icon: MessageCirclePlusIcon, label: "Gửi thông báo", url: "/AdminPage/SendNotification", isActive: activeItem === "/AdminPage/SendNotification" || pathname.startsWith("/AdminPage/SendNotification") },
    { icon: MessageCircleMoreIcon, label: "Danh sách thông báo", url: "/AdminPage/NotificationList", isActive: activeItem === "/AdminPage/Transaction" || pathname.startsWith("/AdminPage/NotificationList") },
  ]

  const paymentItems: NavItemType[] = [
    { icon: CreditCard, label: "Lịch sử giao dịch", url: "/AdminPage/Transactions", isActive: activeItem === "/AdminPage/Transactions" || pathname.startsWith("/AdminPage/Transactions") },
    { icon: Undo2Icon, label: "Yêu cầu hoàn trả", url: "/AdminPage/RefundRequests", isActive: activeItem === "/AdminPage/RefundRequests" || pathname.startsWith("/AdminPage/RefundRequests") },
  ]

  const navGroups: NavGroupType[] = [
    {
      title: "Tài khoản",
      items: infoItems
    },
    {
      title: "Học liệu",
      items: mainNavItems
    },
    {
      title: "Người dùng",
      items: userItems
    },
    {
      title: "Thông báo",
      items: messeageItems
    },

    {
      title: "Thanh toán",
      items: paymentItems
    }
  ]

  // User profile data
  const userProfile = {
    name: user?.lastName + " " + user?.firstName,
    email: user?.email,
  }

  const toggleSidebar = () => {
    setCollapsed(!collapsed)
  }

  const handleNavItemClick = (label: string, url: string) => {
    setActiveItem(url)
    setTitle(label)
  }

  useEffect(()=>{
    console.log(user)
  },[user])

  if (user && user.account.role.toLowerCase() === "admin")
    return (
      <div className="flex h-screen w-full">
        {/* Sidebar */}
        <div
          className={cn(
            "border-r bg-slate-50 flex flex-col h-full transition-all duration-300 ease-in-out",
            collapsed ? "w-16" : "w-60",
          )}
        >
          {/* Company header */}
          <div className="p-3.5 border-b bg-slate-100 flex items-center justify-between gap-1">
            <a href="/">
              <div className={cn("flex items-center", collapsed ? "justify-center w-full" : "")}>
                <Building2 className="h-5 w-5 text-blue-600 flex-shrink-0" />
                {!collapsed && <span className="ml-2 font-semibold text-slate-800">eEdu</span>}
              </div>
            </a>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="h-8 w-8 text-slate-500 hover:text-slate-700 hover:bg-slate-200"
            >
              {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-auto p-2">
            {/* Render all navigation groups */}
            {navGroups.map((group, groupIndex) => (
              <div key={groupIndex} className={groupIndex > 0 ? "mt-6" : ""}>
                {/* Group title (if any) */}
                {!collapsed && group.title && (
                  <div className="text-xs font-medium text-slate-500 px-2 py-1.5">{group.title}</div>
                )}

                {/* Group items */}
                <div className="space-y-1 mt-1">
                  {group.items.map((item, itemIndex) => (
                    <NavItem
                      key={itemIndex}
                      icon={<item.icon className="h-4 w-4" />}
                      label={item.label}
                      url={item.url}
                      active={item.isActive}
                      collapsed={collapsed}
                      onClick={() => handleNavItemClick(item.label, item.url)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </nav>

          {/* User profile */}
          <div
            className={cn(
              "border-t p-4 flex items-center bg-slate-100",
              collapsed ? "justify-center p-2" : "justify-between",
            )}
          >
            <div className={cn("flex items-center", collapsed ? "" : "gap-2")}>
              <Avatar>
                <AvatarImage src={user.avatarUrl} alt="User settings" />
                <AvatarFallback>{user.firstName.charAt(0)}</AvatarFallback>
              </Avatar>
              {!collapsed && (
                <div>
                  <div className="text-sm font-medium">{userProfile.name}</div>
                  <div className="text-xs text-slate-500">{userProfile.email}</div>
                </div>
              )}
            </div>
            {!collapsed && (
              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-slate-700">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-auto bg-white">
          <header className="border-b p-4 bg-white shadow-sm">
            <h1 className="text-xl font-bold text-center">{title}</h1>
          </header>
          <main className="p-4">

            {children}

          </main>
        </div>

      </div>
    )
  return (
    <>Cần một admin <a className="text-blue-500 underline" href="/User/Login">Đăng nhập tài khoản ADMIN</a></>
  )
}

interface NavItemProps {
  icon: React.ReactNode
  label: string
  url: string
  active?: boolean
  collapsed?: boolean
  onClick?: () => void
}

function NavItem({ icon, label, url, active, collapsed, onClick }: NavItemProps) {
  return (
    <Link
      href={url}
      className={cn(
        "flex items-center rounded-md text-sm",
        collapsed ? "justify-center p-2" : "gap-2 px-2 py-1.5",
        active ? "bg-blue-100 text-blue-700 font-medium" : "text-slate-600 hover:bg-slate-200 hover:text-slate-800",
      )}
      title={collapsed ? label : undefined}
      onClick={() => {
        if (onClick) onClick()
      }}
    >
      {icon}
      {!collapsed && <span>{label}</span>}
    </Link>
  );
}
