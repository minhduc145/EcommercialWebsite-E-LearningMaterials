'use client'
import axios from 'axios'
axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://localhost:8080";
import { useEffect, useState } from 'react'
import { Dialog, DialogPanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { Popover, PopoverButton, PopoverPanel} from '@headlessui/react'
import { PhoneIcon, PlayCircleIcon,AcademicCapIcon } from '@heroicons/react/20/solid'
import { UserModel } from "../app/models/UserModel";
import Image from "next/image";
import Logo from "@/app/logo.svg"

import {
    Avatar,
    Dropdown,
    DropdownDivider,
    DropdownHeader,
    DropdownItem,
} from "flowbite-react";

const navigation = [
    { name: 'Trang chủ', href: '/' },
    { name: 'Khám phá', href: '/Courses' },
]

const solutions = [
    { name: 'Đã đăng ký', description: 'Đến danh sách các khóa học đã đăng ký', href: '#', icon: AcademicCapIcon },
]

const callsToAction = [
    { name: 'Watch demo', href: '#', icon: PlayCircleIcon },
    { name: 'Contact sales', href: '#', icon: PhoneIcon },
]

interface IHeaderProps {
    color: string
}
export default function Header(props: IHeaderProps) {
    const [userLoginCookie, setUserLoginCookie] = useState<UserModel | null>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    var bg_color = props.color === "blue" ? "bg-blue-900" : ""
    var txt_color = props.color === "blue" ? "text-white" : "text-gray-900"

    useEffect(function () {
        console.log("Component re-rendered")
        axios.get('/api/accounts/get_user_login_info_by_cookie')
            .then(function (response) {
                setUserLoginCookie(response.data)
            }).catch(function () {
                setUserLoginCookie(null)
            })
    }, [])

    return (
        <header className={`absolute inset-x-0 top-0 z-50 sticky ${bg_color}`}>
            <nav aria-label="Global" className="flex items-center justify-between p-3 lg:px-5">
                <div className="flex lg:flex-1">
                    <a href="#" className="-m-1 p-1">
                        <Image src={Logo} alt="Logo" width={50} height={50} />
                    </a>
                </div>
                <div className="flex lg:hidden">
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(true)}
                        className={`-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 ${txt_color}`}
                    >
                        <Bars3Icon aria-hidden="true" className="size-6" />
                    </button>
                </div>
                <div className="hidden lg:flex lg:gap-x-12">
                    {navigation.map((item) => (
                        <Link key={item.name} href={item.href} className={`text-sm/6 font-semibold ${txt_color}`}>
                            {item.name}
                        </Link>
                    ))}
                    <Popover className="relative">
                        <PopoverButton className={`inline-flex text-sm/6 font-semibold ${txt_color}`}>
                            <span>Tùy chọn</span>
                            <ChevronDownIcon aria-hidden="true" className="size-5" />
                        </PopoverButton>

                        <PopoverPanel
                            transition
                            className="absolute left-1/2 z-10 mt-5 flex w-screen max-w-max -translate-x-1/2 px-4 transition data-closed:translate-y-1 data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in"
                        >
                            <div className="w-screen max-w-md flex-auto overflow-hidden rounded-3xl bg-white text-sm/6 ring-1 shadow-lg ring-gray-900/5">
                                <div className="p-4">
                                    {solutions.map((item) => (
                                        <div key={item.name} className="group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-50">
                                            <div className="mt-1 flex size-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                                                <item.icon aria-hidden="true" className="size-6 text-gray-600 group-hover:text-indigo-600" />
                                            </div>
                                            <div>
                                                <a href={item.href} className="font-semibold text-gray-900">
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
                                            <item.icon aria-hidden="true" className="size-5 flex-none text-gray-400" />
                                            {item.name}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </PopoverPanel>
                    </Popover>

                </div>

                <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                    {!userLoginCookie ? (
                        <a href="/User/Login" className={`text-sm/6 font-semibold ${txt_color}`}>
                            <span>Đăng nhập</span>&nbsp;<span aria-hidden="true">&rarr;</span>
                        </a>)
                        :
                        (
                            <UserDropDown userModel={userLoginCookie}/>
                        )
                    }
                </div>
            </nav>
            <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
                <div className="fixed inset-0 z-50" />
                <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                    <div className="flex items-center justify-between">
                        <a href="#" className="-m-1.5 p-1.5">
                            <span className="sr-only">Your Company</span>
                            <Image
                                alt=""
                                src={Logo}
                                className="h-8 w-auto"
                            />
                        </a>
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(false)}
                            className="-m-2.5 rounded-md p-2.5 text-gray-700"
                        >
                            <span className="sr-only">Close menu</span>
                            <XMarkIcon aria-hidden="true" className="size-6" />
                        </button>
                    </div>
                    <div className="mt-6 flow-root">
                        <div className="-my-6 divide-y divide-gray-500/10">
                            <div className="space-y-2 py-6">
                                {navigation.map((item) => (
                                    <a
                                        key={item.name}
                                        href={item.href}
                                        className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                                    >
                                        {item.name}
                                    </a>
                                ))}
                                <div className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50">
                                   Solutions
                                </div>
                            </div>
                            <div className="py-6">
                                {!userLoginCookie ? (
                                    <a
                                        href="/User/Login"
                                        className="-mx-3 block rounded-lg px-3 py-2.5  text-gray-900 hover:bg-gray-50"
                                    >
                                        Đăng nhập
                                    </a>
                                ) : (
                                    <UserDropDown userModel={userLoginCookie} />
                                )}
                            </div>
                        </div>
                    </div>
                </DialogPanel>
            </Dialog>
        </header>
    )
}

import { ChevronDownIcon } from '@heroicons/react/20/solid'
import Link from 'next/link';
interface IUserDropDownProps{
    userModel : UserModel
}
export function UserDropDown(props: IUserDropDownProps) {
    const userModel = props.userModel
    return (
        <div className="transition duration-300 ease-in transform hover:-translate-y-2 p-4">
            <Dropdown
                arrowIcon={false}
                inline
                label={
                    <Avatar alt="User settings" img={userModel.avatarUrl} rounded />
                }
            >
                <DropdownHeader>
                    <span className="block text-sm">{userModel.lastName + " " + userModel.firstName}</span>
                    <span className="block truncate text-sm font-medium">{userModel.email}</span>
                </DropdownHeader>
                <DropdownDivider />
                <DropdownItem>Dashboard</DropdownItem>
                <DropdownItem>Settings</DropdownItem>
                <DropdownItem>Earnings</DropdownItem>
                <DropdownDivider />
                <Link href='User/Logout'><DropdownItem>Đăng xuất</DropdownItem></Link>
            </Dropdown>
        </div>

    )
}