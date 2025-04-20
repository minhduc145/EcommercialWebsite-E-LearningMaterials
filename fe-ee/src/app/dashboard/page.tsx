"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  BarChart,
  FolderKanban,
  Users,
  FileText,
  Database,
  FileBarChart,
  MessageSquareText,
  MoreHorizontal,
  Settings,
  HelpCircle,
  Search,
  ChevronLeft,
  ChevronRight,
  Building2,
  type LucideIcon,
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

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

export default function Dashboard() {
  const [title, setTitle] = useState("Chi tiết")
  const [collapsed, setCollapsed] = useState(false)
  const [activeItem, setActiveItem] = useState("Dashboard")

  // Main navigation items
  const mainNavItems: NavItemType[] = [
    { icon: LayoutDashboard, label: "Dashboard", url: "/dashboard", isActive: activeItem === "Dashboard" },
    { icon: FileText, label: "Khóa học", url: "/courses", isActive: activeItem === "Khóa học" },
    { icon: BarChart, label: "Analytics", url: "/analytics", isActive: activeItem === "Analytics" },
    { icon: FolderKanban, label: "Projects", url: "/projects", isActive: activeItem === "Projects" },
    { icon: Users, label: "Người dùng", url: "/users", isActive: activeItem === "Người dùng" },
  ]

  // Document section items
  const documentItems: NavItemType[] = [
    { icon: Database, label: "Data Library", url: "/data-library", isActive: activeItem === "Data Library" },
    { icon: FileBarChart, label: "Reports", url: "/reports", isActive: activeItem === "Reports" },
    {
      icon: MessageSquareText,
      label: "Word Assistant",
      url: "/word-assistant",
      isActive: activeItem === "Word Assistant",
    },
    { icon: MoreHorizontal, label: "More", url: "/more", isActive: activeItem === "More" },
  ]

  // Settings and help items
  const settingsItems: NavItemType[] = [
    { icon: Settings, label: "Settings", url: "/settings", isActive: activeItem === "Settings" },
    { icon: HelpCircle, label: "Get Help", url: "/help", isActive: activeItem === "Get Help" },
    { icon: Search, label: "Search", url: "/search", isActive: activeItem === "Search" },
  ]

  // All navigation groups
  const navGroups: NavGroupType[] = [{ items: mainNavItems }, { title: "Documents", items: documentItems }]

  // User profile data
  const userProfile = {
    initials: "CN",
    name: "shadcn",
    email: "m@example.com",
  }

  // Company data
  const company = {
    name: "Acme Inc.",
    icon: Building2,
  }

  const toggleSidebar = () => {
    setCollapsed(!collapsed)
  }

  const handleNavItemClick = (label: string) => {
    setActiveItem(label)
    setTitle(label)
  }

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
        <div className="p-3.5 border-b bg-slate-100 flex items-center justify-between">
          <div className={cn("flex items-center", collapsed ? "justify-center w-full" : "")}>
            <company.icon className="h-5 w-5 text-blue-600 flex-shrink-0" />
            {!collapsed && <span className="ml-2 font-semibold text-slate-800">{company.name}</span>}
          </div>
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
                    onClick={() => handleNavItemClick(item.label)}
                  />
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Settings section */}
        <div className={cn("border-t p-2 bg-slate-100", collapsed ? "px-1" : "")}>
          <div className="space-y-1">
            {settingsItems.map((item, index) => (
              <NavItem
                key={index}
                icon={<item.icon className="h-4 w-4" />}
                label={item.label}
                url={item.url}
                active={item.isActive}
                collapsed={collapsed}
                onClick={() => handleNavItemClick(item.label)}
              />
            ))}
          </div>
        </div>

        {/* User profile */}
        <div
          className={cn(
            "border-t p-4 flex items-center bg-slate-100",
            collapsed ? "justify-center p-2" : "justify-between",
          )}
        >
          <div className={cn("flex items-center", collapsed ? "" : "gap-2")}>
            <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-medium">
              {userProfile.initials}
            </div>
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
          <h1 className="text-lg font-medium text-slate-800 text-center">{title}</h1>
        </header>
        <main className="p-4">{/* Content goes here */}</main>
      </div>
    </div>
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
      onClick={(e) => {
        e.preventDefault() // Prevent actual navigation
        if (onClick) onClick()
      }}
    >
      {icon}
      {!collapsed && <span>{label}</span>}
    </Link>
  )
}
