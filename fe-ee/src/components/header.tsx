"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Logo from "@/app/logo.svg";
import type { UserModel } from "@/models/UserModel";

import { Menu } from "lucide-react";
import { ChevronDown, Phone, Play, GraduationCap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import SockJS from "sockjs-client";
import { Client, IMessage } from "@stomp/stompjs";
import MyToaster from "./ui/toastify-template";
import { ToastContainer } from "react-toastify";
import { getUserInfo } from "@/app/api/api-account";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://localhost:8080";

const navigation = [
  { name: "Trang chủ", href: "/" },
  { name: "Khám phá", href: "/Courses" },
];

const solutions = [
  {
    name: "Đã đăng ký",
    description: "Đến danh sách các khóa học đã đăng ký",
    href: "#",
    icon: GraduationCap,
  },
];

const callsToAction = [
  { name: "Watch demo", href: "#", icon: Play },
  { name: "Contact sales", href: "#", icon: Phone },
];

interface IHeaderProps {
  color: string;
}

export default function Header(props: IHeaderProps) {
  const [userLoginCookie, setUserLoginCookie] = useState<UserModel | null>(
    null
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const bgColor = props.color === "blue" ? "bg-[#001d74]" : "border-b  supports-[backdrop-filter]:bg-background/60";
  const txtColor = props.color === "blue" ? "text-white" : "text-gray-900";

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setUserLoginCookie(JSON.parse(storedUser));
    } else {
      getUserInfo().then(response => {
        setUserLoginCookie(response.data);
        localStorage.setItem("currentUser", JSON.stringify(response.data));
      }).catch(() => console.log("null"));
    }
  }, []);


  useEffect(() => {
    const newMessageSocket = new SockJS(
      "http://localhost:8080/ws/notification"
    );
    const newMessageClient = new Client({
      webSocketFactory: () => newMessageSocket,
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("✅ Connected to WebSocket");
        newMessageClient.subscribe(
          `/topic/receive/${JSON.parse(String(localStorage.getItem("currentUser")))?.id
          }`,
          (message: IMessage) => {
            console.log("📩 Message received:", message.body);
            MyToaster({ variant: "", message: message.body });
          },
          {
            username: JSON.parse(String(localStorage.getItem("currentUser")))
              ?.id,
          }
        );
      },
      onStompError: (frame) => {
        console.error("❌ Broker error:", frame.headers["message"]);
      },
    });
    newMessageClient.activate();
    return () => {
      newMessageClient.deactivate();
    };
  }, []);

  return (
    <header className={`z-50 sticky top-0 w-full ${bgColor}`}>
      <nav
        aria-label="Global"
        className="flex items-center justify-between lg:px-5 p-2"
      >
        <div className="flex lg:flex-1">
          <a href="#" className="-m-1 p-1">
            <Image src={Logo} alt="Logo" width={50} height={50} />
          </a>
        </div>

        <div className="flex lg:hidden">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={txtColor}
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-sm">
              <SheetTitle className="hidden">hi</SheetTitle>
              <div className="flex p-5 items-center justify-between">
                <a href="#" className="-m-1.5 p-1.5">
                  <Image alt="" src={Logo} className="h-8 w-auto" />
                </a>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileMenuOpen(false)}
                ></Button>
              </div>
              <div className="mt-6 flow-root">
                <div className="-my-6 divide-y divide-gray-500/10">
                  <div className="space-y-2 p-6">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                      >
                        {item.name}
                      </Link>
                    ))}
                    <div className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50">
                      Solutions
                    </div>
                  </div>
                  <div className="pl-5 pt-5 lg:px-0 lg:pt-0">
                    {!userLoginCookie ? (
                      <Link
                        href="/User/Login"
                        className="mx-3 block rounded-lg px-3 py-2.5 text-gray-900 hover:bg-gray-50"
                      >
                        Đăng nhập
                      </Link>
                    ) : (
                      <UserDropDown userModel={userLoginCookie} />
                    )}
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="hidden items-center lg:flex lg:gap-x-12">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`text-sm/6 font-semibold ${txtColor}`}
            >
              {item.name}
            </Link>
          ))}

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="link"
                className={`p-0 font-semibold ${txtColor} flex items-center gap-1`}
              >
                <span>Tùy chọn</span>
                <ChevronDown className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-screen max-w-md p-0" align="center">
              <div className="w-full overflow-hidden rounded-md bg-white text-sm/6 shadow-lg">
                <div className="p-4">
                  {solutions.map((item) => (
                    <div
                      key={item.name}
                      className="group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-50"
                    >
                      <div className="mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                        <item.icon className="h-6 w-6 text-gray-600 group-hover:text-primary" />
                      </div>
                      <div>
                        <a
                          href={item.href}
                          className="font-semibold text-gray-900"
                        >
                          {item.name}
                          <span className="absolute inset-0" />
                        </a>
                        <p className="mt-1 text-gray-600">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 divide-x divide-gray-900/5 bg-gray-50">
                  {callsToAction.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="flex items-center justify-center gap-x-2.5 p-3 font-semibold text-gray-900 hover:bg-gray-100"
                    >
                      <item.icon className="h-5 w-5 flex-none text-gray-400" />
                      {item.name}
                    </a>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          {!userLoginCookie ? (
            <Link
              href="/User/Login"
              className={`text-sm/6 font-semibold ${txtColor}`}
            >
              <span>Đăng nhập</span>&nbsp;<span aria-hidden="true">&rarr;</span>
            </Link>
          ) : (
            <UserDropDown userModel={userLoginCookie} />
          )}
        </div>
      </nav>
      <div>
        <ToastContainer />
      </div>
    </header>
  );
}

interface IUserDropDownProps {
  userModel: UserModel;
}

export function UserDropDown(props: IUserDropDownProps) {
  const userModel = props.userModel;

  return (
    <div className="transition duration-300 ease-in transform hover:-translate-y-1">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="p-0">
            <Avatar>
              <AvatarImage src={userModel.avatarUrl} alt="User settings" />
              <AvatarFallback>{userModel.firstName.charAt(0)}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>
            <span className="block text-sm">
              {userModel.lastName + " " + userModel.firstName}
            </span>
            <span className="block truncate text-sm font-medium">
              {userModel.email}
            </span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Dashboard</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem>Earnings</DropdownMenuItem>
          <DropdownMenuSeparator />
          {userModel?.account.role.toLowerCase() === "admin" && <>
            <a href="/AdminPage">
              <DropdownMenuItem>Dành cho ADMIN</DropdownMenuItem>
            </a>
          </>}
          <Link href="/User/Logout">
            <DropdownMenuItem>Đăng xuất</DropdownMenuItem>
          </Link>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
