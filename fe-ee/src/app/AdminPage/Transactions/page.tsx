'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingDown, TrendingUp } from "lucide-react";

export default function Page() {
    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                <Card className="bg-green-500 border-green-600 shadow-lg hover:shadow-xl transition-shadow duration-300 h-[200px]">
                    <CardHeader className="text-center ">
                        <div className="flex justify-center ">
                            <div className="p-3 bg-white/20 rounded-full">
                                <TrendingUp className="w-8 h-8 text-white" />
                            </div>
                        </div>
                        <CardTitle className="text-xl font-bold text-white">Tiền vào</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                        <div className="text-3xl font-bold text-white">₫15,500,000</div>
                    </CardContent>
                </Card>

                <Card className="bg-red-500 border-red-600 shadow-lg hover:shadow-xl transition-shadow duration-300 h-[200px]">
                    <CardHeader className="text-center ">
                        <div className="flex justify-center ">
                            <div className="p-3 bg-white/20 rounded-full">
                                <TrendingDown className="w-8 h-8 text-white" />
                            </div>
                        </div>
                        <CardTitle className="text-xl font-bold text-white">Tiền ra</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                        <div className="text-3xl font-bold text-white ">₫8,750,000</div>
                    </CardContent>
                </Card>

                <Card className="bg-white shadow-lg">
                    <CardContent className="p-6">
                        <div className="text-center">
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Số dư hiện tại</h3>
                            <div className="text-3xl font-bold text-blue-600">₫6,750,000</div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

