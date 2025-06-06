'use client'
import Link from "next/link"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ArrowUpDownIcon, Banknote, Search } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { fi, vi } from "date-fns/locale"
import { DateRange } from "react-day-picker"
import { format } from "date-fns"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { formatDate } from "@/lib/utils"
import { CategoryModel } from "@/models/CategoryModel"
import { getSearchProps, searchCoursesForUser } from "../api/api-search"
import { CourseModel } from "@/models/CourseModel"
import Image from "next/image"
import { Skeleton } from "@/components/ui/skeleton"
import { CourseBasicDTO } from "@/models/CourseBasicDTO"
import { StarRating } from "@/components/ui/star-rating"
import PaginationCluster from "@/components/ui/pagination-button-cluster"

interface SearchPageProps {
    maxPrice: number,
    categories: CategoryModel[]
}

export default function Component() {
    const [result, setResult] = useState<CourseBasicDTO[]>([])
    const [totalElements, setTE] = useState(0)
    const [totalPages, setTP] = useState(0)
    const [currentPage, setCP] = useState(1)

    const [searchProps, setSPs] = useState<SearchPageProps | undefined>()
    const [priceRange, setPriceRange] = useState([0, 10000000000])
    const [date, setDate] = useState<DateRange | undefined>()
    const [displayPrice1, setDisplayPrice1] = useState<string>(
        priceRange[0]?.toLocaleString("vi-VN") ?? "0"
    );
    const [displayPrice2, setDisplayPrice2] = useState<string>(
        priceRange[1]?.toLocaleString("vi-VN") ?? "0"
    );
    const [title, setTitle] = useState("")
    const [selectedCategoryIds, setSelectedCateIds] = useState<number[]>([])
    const [isFeaturedSelected, setIsFeaturedSelected] = useState(false)
    const [descending, setDescending] = useState(true)
    const [sort, setSort] = useState("createdAt")
    const [isLoading, setIsLoading] = useState(false)


    useEffect(() => {
        getSearchProps().then(res => {
            setSPs(res?.data)
            setPriceRange([0, res?.data?.maxPrice ?? 0])
            setDisplayPrice2(res?.data?.maxPrice ?? 0)
        }).catch(() => { })
    }, [])

    useEffect(() => {
        search();
    }, [sort, descending, currentPage]);
    const search = () => {
        if (priceRange[0] > priceRange[1]) {
            alert("Giá sau phải lớn hơn giá trước")
            onPriceRangeChange([0, searchProps?.maxPrice ?? 0])
        }
        else {
            setIsLoading(true)
            var startDateString;
            var endDateString;
            if (date?.from)
                startDateString = format(date.from, 'yyyy-MM-dd');
            if (date?.to)
                endDateString = format(date.to, 'yyyy-MM-dd');
            searchCoursesForUser(title, selectedCategoryIds, priceRange[0], priceRange[1], startDateString, endDateString, isFeaturedSelected, sort, descending, currentPage).then(res => {
                setResult(res?.data?.content)
                setTE(res?.data?.totalElements ?? 0)
                setTP(res?.data?.totalPages ?? 0)
            })
            setTimeout(() => setIsLoading(false), 300)
        }
    }

    const onPrice1Change = (val: string) => {
        const raw = val.replace(/\D/g, "");
        const number = parseInt(raw || "0", 10);
        setPriceRange([number, priceRange[1]]);
        const formatted = number.toLocaleString("vi-VN");
        setDisplayPrice1(formatted)
    };

    const onPrice2Change = (val: string) => {
        const raw = val.replace(/\D/g, "");
        const number = parseInt(raw || "0", 10);
        setPriceRange([priceRange[0], number]);
        const formatted = number.toLocaleString("vi-VN");
        setDisplayPrice2(formatted)
    };

    const onPriceRangeChange = (val: number[]) => {
        if (val[0] !== priceRange[0])
            onPrice1Change(String(val[0]))
        if (val[1] !== priceRange[1])
            onPrice2Change(String(val[1]))
    };
    const handleToggleCategory = (id: string, checked: boolean) => {
        setSelectedCateIds(prev =>
            checked
                ? [...prev, Number(id)]
                : prev.filter(c => c !== Number(id))
        )
    }

    const onSortChange = async (v: string) => {
        if (v === "price-l") {
            setSort("price")
            setDescending(false)
        }
        else if (v === "price-h") {
            setSort("price")
            setDescending(true)
        } else {
            setSort(v)
            setDescending(true)
        }
    }
    return (
        <>
            <div className="grid md:grid-cols-[280px_1fr] gap-6 p-4 md:p-6">
                <div className="bg-gray-100/40 rounded-lg p-4 dark:bg-gray-800/40">
                    <div className="grid gap-4">
                        <div>
                            <h3 className="text-lg font-semibold">Hiển thị</h3>
                            <div className="grid gap-4 mt-4">
                                <RadioGroup value={String(isFeaturedSelected)} onValueChange={v => setIsFeaturedSelected(v === "true")} className="flex ">
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
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold">Tầm giá (VND)</h3>
                            <div className="grid gap-4 mt-4">
                                <Slider
                                    id="range-slider"
                                    min={0}
                                    max={(searchProps && searchProps.maxPrice) ?? 0}
                                    step={1000}
                                    value={priceRange}
                                    defaultValue={priceRange}
                                    onValueChange={v => { onPriceRangeChange(v); search }}
                                />
                                <div className="flex items-center justify-center">
                                    <Input type="number" min={0} value={displayPrice1} onChange={(v) => onPrice1Change(v.currentTarget.value)} />
                                    <p>-</p>
                                    <Input type="number" min={0} value={displayPrice2} onChange={(v) => onPrice2Change(v.currentTarget.value)} />
                                </div>
                            </div>
                        </div>
                        <div className="h-[200px]">
                            <div className="flex items-center gap-5">
                                <h3 className="text-lg font-semibold">Danh mục</h3>
                                {selectedCategoryIds && selectedCategoryIds.length > 0 && <span className="font-light text-red-500 hover:cursor-pointer underline" onClick={() => setSelectedCateIds([])}>bỏ chọn</span>}
                            </div>
                            <div className="grid gap-2 mt-4 max-h-[80%] overflow-auto">
                                {searchProps && searchProps.categories?.map((category) =>
                                    <Label title={category.description ?? ""} key={category.id} className="flex items-center gap-2 font-normal">
                                        <Checkbox id={String(category.id)} checked={selectedCategoryIds.includes(category.id)} onCheckedChange={(checked) => handleToggleCategory(String(category.id), checked === true)}
                                        /> {category.name}
                                    </Label>
                                )
                                }
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center gap-5">
                                <h3 className="text-lg font-semibold">Ngày tạo</h3>
                                {date && <span className="font-light text-red-500 hover:cursor-pointer underline" onClick={() => setDate(undefined)}>bỏ chọn</span>}
                            </div>
                            <span>{date?.from && formatDate(date?.from?.toISOString())} {date?.to && "-"} {date?.to && formatDate(date?.to?.toISOString())}</span>
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
                            />
                        </div>
                    </div>
                </div>
                <div className="">
                    <div className="p-4 text-center">
                        <div className="flex gap-3">
                            <Input type="search" placeholder="Nhập từ khóa tìm kiếm ..." onChange={v => setTitle(v.currentTarget.value)} />
                            <Button className="bg-blue-500 hover:bg-blue-600" onClick={search}><Search size={5} /></Button>
                        </div>
                    </div>
                    <div className="flex justify-between mb-15">
                        <p className="text-lg font-bold">Kết&nbsp;quả&nbsp;{totalElements}</p>
                        {totalPages > 0 && <PaginationCluster currentPage={currentPage} totalPages={totalPages} onPageChange={setCP} />}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                    <ArrowUpDownIcon className="w-4 h-4 mr-2" />
                                    Sắp xếp theo
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[200px]">
                                <DropdownMenuRadioGroup value={sort.includes("price") ? (descending ? "price-h" : "price-l") : sort} defaultValue={sort} onValueChange={v => onSortChange(v)}>
                                    <DropdownMenuRadioItem value="createdAt">Mới nhất trước</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="isFeatured">Nổi bật trước</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="price-l">Giá thấp - cao</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="price-h">Giá cao - thấp</DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4  ">
                        {isLoading ?
                            (
                                <>
                                    <DummyContent />
                                    <DummyContent />
                                    <DummyContent />
                                    <DummyContent />
                                    <DummyContent />
                                    <DummyContent />
                                    <DummyContent />
                                    <DummyContent />
                                </>
                            )
                            :
                            (result && result.length > 0 ? <ResultPanel result={result} /> : <p>Không có kết quả</p>)
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export function ResultPanel({ result }: { result: CourseBasicDTO[] }) {
    if (result && result.length > 0)
        return (
            result.map(course => (
                <ResultItem key={course.id} course={course} />
            ))
        )
}

export function ResultItem({ course, loadInPage }: { course: CourseBasicDTO, loadInPage?: boolean | false }) {
    return (
        <div key={course.id} className="relative bg-white rounded-lg shadow-lg dark:bg-gray-950 overflow-hidden">
            {course.isFeatured && (
                <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                    Nổi bật
                </div>
            )}


            <Image
                src={course.thumbnailUrl}
                alt="Product Image"
                width={400}
                height={200}
                className="w-full h-35 object-cover"
                style={{ aspectRatio: "400/200", objectFit: "cover" }}
            />




            <div className="p-4">
                <h3 className="text-lg font-semibold truncate">{course.title}</h3>
                <p className="text-gray-500">{course.categoryName}</p>
                <div className="flex justify-between flex-col lg:flex-row">
                    <p className="text-sm flex items-center text-green-400">
                        <Banknote className="w-4 h-4" />&nbsp;{course.price?.toLocaleString("vi-VN") ?? 0}&nbsp;VND
                    </p>
                    <div className="flex items-center gap-1 sm:gap-2">
                        <StarRating size="sm" rating={course.averageRating} />
                        <span className="text-sm opacity-90">({course.commentCount} đánh giá)</span>
                    </div>
                </div>
                {loadInPage == true &&
                    <Link href={`/Courses/${course.id}`} >
                        <Button size="sm" className="mt-4 w-full bg-blue-500 text-white">
                            Xem chi tiết
                        </Button>
                    </Link>
                }
                {loadInPage != true && <a href={`/Courses/${course.id}`} target="_blank">
                    <Button size="sm" className="mt-4 w-full bg-blue-500 text-white">
                        Xem chi tiết
                    </Button>
                </a>}
            </div>
        </div>
    )
}

function DummyContent() {
    return (
        <div className="flex flex-col space-y-3 transition-all duration-700 ease-in-out  translate-y-4 animate-fade-in">
            <Skeleton className="h-[250px] w-[350px] rounded-xl" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
            </div>
        </div>
    )
}