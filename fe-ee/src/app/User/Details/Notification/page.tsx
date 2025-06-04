import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Star,  Settings,} from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Page() {
    return (
        <div>
             {/* Tab Navigation */}
                        <div className="flex gap-2 mb-6">
                            <Button variant="outline" className="rounded-full">
                                Đã đăng ký
                            </Button>
                            <Button variant="default" className="rounded-full bg-blue-600 hover:bg-blue-700">
                                Đã thêm vào yêu thích
                            </Button>
                        </div>

                        {/* Search and Filter */}
                        <div className="flex items-center gap-4 mb-6">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input placeholder="Nhập từ khoá ..." className="pl-10" />
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">Trạng thái:</span>
                                <Select defaultValue="all">
                                    <SelectTrigger className="w-32">
                                        <SelectValue placeholder="Tất cả" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Tất cả</SelectItem>
                                        <SelectItem value="active">Đang học</SelectItem>
                                        <SelectItem value="completed">Hoàn thành</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Course Card */}
                        <div className="grid gap-6">
                            <Card className="overflow-hidden">
                                <div className="relative">
                                    <img
                                        src="/placeholder.svg?height=200&width=400"
                                        alt="Course thumbnail"
                                        className="w-full h-48 object-cover"
                                    />
                                    <Badge className="absolute top-3 right-3 bg-orange-500 hover:bg-orange-600">Nổi bật</Badge>
                                    <div className="absolute bottom-3 left-3 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                                        <Settings className="w-4 h-4 inline mr-1" />
                                        Khối 6 - Khoa học tự nhiên
                                    </div>
                                </div>
                                <CardContent className="p-6">
                                    <h3 className="font-bold text-lg mb-4">BÀI GIẢNG E-LEARNING</h3>

                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-sm text-gray-600">Tiến độ</span>
                                                <span className="text-sm font-semibold">33.33%</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-200">
                                                Đang diễn ra
                                            </Badge>
                                            <div className="flex items-center gap-1">
                                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                <span className="font-semibold">4.0</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
        </div>
    );
}