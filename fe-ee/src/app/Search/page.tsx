'use client'
import Link from "next/link"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ArrowUpDownIcon, ChevronRightIcon, DatabaseZapIcon } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { vi } from "date-fns/locale"
import { DateRange } from "react-day-picker"
import { addDays } from "date-fns"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { formatDate } from "@/lib/utils"

export default function Component() {
    const [priceRange, setPriceRange] = useState([0, 800])
    const [date, setDate] = useState<DateRange | undefined>({
        from: new Date(2022, 0, 20),
        to: addDays(new Date(2022, 0, 20), 20),
    })
    return (
        <>
            <div className="text-center p-5"><h2 className="text-3xl font-bold">TÌM KIẾM HỌC LIỆU</h2></div>
            <div className="grid md:grid-cols-[280px_1fr] gap-6 p-4 md:p-6">
                <div className="bg-gray-100/40 rounded-lg p-4 md:p-6 dark:bg-gray-800/40">
                    <div className="grid gap-6">
                        <div>
                            <h3 className="text-lg font-semibold">Tìm kiếm:</h3>
                            <div className="grid gap-2 mt-4">
                                <Input type="search" placeholder="Nhập từ khóa tìm kiếm ..." />
                            </div>
                        </div>
                        <div>
                            <RadioGroup defaultValue="false" className="flex ">
                                <div className="flex items-center gap-3">
                                    <RadioGroupItem value="false" id="r1" />
                                    <Label htmlFor="r1">Tất cả</Label>
                                </div>
                                <div className="flex items-center gap-3">
                                    <RadioGroupItem value="true" id="r2" />
                                    <Label htmlFor="r2">Nổi bật</Label>
                                </div>
                            </RadioGroup>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">Danh mục</h3>
                            <div className="grid gap-2 mt-4">

                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">Tầm giá</h3>
                            <div className="grid gap-4 mt-4">
                                <Slider
                                    id="range-slider"
                                    min={0}
                                    max={100000}
                                    step={1000}
                                    value={priceRange}
                                    defaultValue={priceRange}
                                    onValueChange={v => setPriceRange(v)}
                                />
                                <div className="flex items-center justify-center">
                                    <Input type="number" value={priceRange[0]} onChange={(v) =>
                                        setPriceRange([v.currentTarget.valueAsNumber, priceRange[1]])
                                    } />
                                    <p>-</p>
                                    <Input type="number" value={priceRange[1]} onChange={(v) => setPriceRange([priceRange[0], v.currentTarget.valueAsNumber])} />
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">Brands</h3>
                            <div className="grid gap-2 mt-4">
                                <Label className="flex items-center gap-2 font-normal">
                                    <Checkbox id="brand-1" /> Nike
                                </Label>
                                <Label className="flex items-center gap-2 font-normal">
                                    <Checkbox id="brand-2" /> Adidas
                                </Label>
                                <Label className="flex items-center gap-2 font-normal">
                                    <Checkbox id="brand-3" /> Apple
                                </Label>
                                <Label className="flex items-center gap-2 font-normal">
                                    <Checkbox id="brand-4" /> Samsung
                                </Label>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">Ngày tạo</h3>
                            <div className="grid grid-cols-3 gap-2 mt-4">
                                <Calendar
                                    captionLayout="dropdown"
                                    fromYear={2010}
                                    toYear={new Date().getFullYear()}
                                    locale={vi}
                                    mode="range"
                                    defaultMonth={date?.from}
                                    selected={date}
                                    onSelect={setDate}
                                    disabled={(date) => date > new Date()}
                                    initialFocus
                                />
                            </div>
                            {date?.from && formatDate(date?.from?.toISOString())} {date?.to && "đến"} {date?.to && formatDate(date?.to?.toISOString())}
                        </div>
                    </div>
                </div>
                <div className="grid gap-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold">Kết quả:</h2>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                    <ArrowUpDownIcon className="w-4 h-4 mr-2" />
                                    Sắp xếp theo
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[200px]">
                                <DropdownMenuRadioGroup value="featured">
                                    <DropdownMenuRadioItem value="featured">Nổi bật trước</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="newest">Mới nhất trước</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="low-to-high">Giá thấp - cao</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="high-to-low">Giá cao - thấp</DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden dark:bg-gray-950">
                            <Link href="#" className="block" prefetch={false}>
                                <img
                                    src="https://t3.ftcdn.net/jpg/02/48/42/64/360_F_248426448_NVKLywWqArG2ADUxDq6QprtIzsF82dMF.jpg"
                                    alt="Product Image"
                                    width={400}
                                    height={400}
                                    className="w-full h-56 object-cover"
                                    style={{ aspectRatio: "400/400", objectFit: "cover" }}
                                />
                            </Link>
                            <div className="p-4">
                                <Link href="#" className="block" prefetch={false}>
                                    <h3 className="text-lg font-semibold truncate">Wireless Headphones</h3>
                                </Link>
                                <p className="text-gray-500 dark:text-gray-400 text-sm">$99.99</p>
                                <Button size="sm" className="mt-4 w-full">
                                    Add to Cart
                                </Button>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden dark:bg-gray-950">
                            <Link href="#" className="block" prefetch={false}>
                                <img
                                    src="/placeholder.svg"
                                    alt="Product Image"
                                    width={400}
                                    height={400}
                                    className="w-full h-56 object-cover"
                                    style={{ aspectRatio: "400/400", objectFit: "cover" }}
                                />
                            </Link>
                            <div className="p-4">
                                <Link href="#" className="block" prefetch={false}>
                                    <h3 className="text-lg font-semibold truncate">Fitness Tracker</h3>
                                </Link>
                                <p className="text-gray-500 dark:text-gray-400 text-sm">$49.99</p>
                                <Button size="sm" className="mt-4 w-full">
                                    Add to Cart
                                </Button>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden dark:bg-gray-950">
                            <Link href="#" className="block" prefetch={false}>
                                <img
                                    src="/placeholder.svg"
                                    alt="Product Image"
                                    width={400}
                                    height={400}
                                    className="w-full h-56 object-cover"
                                    style={{ aspectRatio: "400/400", objectFit: "cover" }}
                                />
                            </Link>
                            <div className="p-4">
                                <Link href="#" className="block" prefetch={false}>
                                    <h3 className="text-lg font-semibold truncate">Smart TV</h3>
                                </Link>
                                <p className="text-gray-500 dark:text-gray-400 text-sm">$499.99</p>
                                <Button size="sm" className="mt-4 w-full">
                                    Add to Cart
                                </Button>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden dark:bg-gray-950">
                            <Link href="#" className="block" prefetch={false}>
                                <img
                                    src="/placeholder.svg"
                                    alt="Product Image"
                                    width={400}
                                    height={400}
                                    className="w-full h-56 object-cover"
                                    style={{ aspectRatio: "400/400", objectFit: "cover" }}
                                />
                            </Link>
                            <div className="p-4">
                                <Link href="#" className="block" prefetch={false}>
                                    <h3 className="text-lg font-semibold truncate">Outdoor Gear</h3>
                                </Link>
                                <p className="text-gray-500 dark:text-gray-400 text-sm">$79.99</p>
                                <Button size="sm" className="mt-4 w-full">
                                    Add to Cart
                                </Button>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden dark:bg-gray-950">
                            <Link href="#" className="block" prefetch={false}>
                                <img
                                    src="/placeholder.svg"
                                    alt="Product Image"
                                    width={400}
                                    height={400}
                                    className="w-full h-56 object-cover"
                                    style={{ aspectRatio: "400/400", objectFit: "cover" }}
                                />
                            </Link>
                            <div className="p-4">
                                <Link href="#" className="block" prefetch={false}>
                                    <h3 className="text-lg font-semibold truncate">Kitchen Appliance</h3>
                                </Link>
                                <p className="text-gray-500 dark:text-gray-400 text-sm">$149.99</p>
                                <Button size="sm" className="mt-4 w-full">
                                    Add to Cart
                                </Button>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden dark:bg-gray-950">
                            <Link href="#" className="block" prefetch={false}>
                                <img
                                    src="/placeholder.svg"
                                    alt="Product Image"
                                    width={400}
                                    height={400}
                                    className="w-full h-56 object-cover"
                                    style={{ aspectRatio: "400/400", objectFit: "cover" }}
                                />
                            </Link>
                            <div className="p-4">
                                <Link href="#" className="block" prefetch={false}>
                                    <h3 className="text-lg font-semibold truncate">Laptop</h3>
                                </Link>
                                <p className="text-gray-500 dark:text-gray-400 text-sm">$799.99</p>
                                <Button size="sm" className="mt-4 w-full">
                                    Add to Cart
                                </Button>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden dark:bg-gray-950">
                            <Link href="#" className="block" prefetch={false}>
                                <img
                                    src="/placeholder.svg"
                                    alt="Product Image"
                                    width={400}
                                    height={400}
                                    className="w-full h-56 object-cover"
                                    style={{ aspectRatio: "400/400", objectFit: "cover" }}
                                />
                            </Link>
                            <div className="p-4">
                                <Link href="#" className="block" prefetch={false}>
                                    <h3 className="text-lg font-semibold truncate">Camping Gear</h3>
                                </Link>
                                <p className="text-gray-500 dark:text-gray-400 text-sm">$59.99</p>
                                <Button size="sm" className="mt-4 w-full">
                                    Add to Cart
                                </Button>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden dark:bg-gray-950">
                            <Link href="#" className="block" prefetch={false}>
                                <img
                                    src="/placeholder.svg"
                                    alt="Product Image"
                                    width={400}
                                    height={400}
                                    className="w-full h-56 object-cover"
                                    style={{ aspectRatio: "400/400", objectFit: "cover" }}
                                />
                            </Link>
                            <div className="p-4">
                                <Link href="#" className="block" prefetch={false}>
                                    <h3 className="text-lg font-semibold truncate">Smartphone</h3>
                                </Link>
                                <p className="text-gray-500 dark:text-gray-400 text-sm">$599.99</p>
                                <Button size="sm" className="mt-4 w-full">
                                    Add to Cart
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
