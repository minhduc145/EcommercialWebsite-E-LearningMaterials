"use client"

import type React from "react"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { CalendarIcon, Upload, User } from "lucide-react"
import { UserModel } from "@/models/UserModel"
import { editProfile } from "@/app/api/api-account"
import MyToaster from "./ui/toastify-template"
import { Calendar } from "./ui/calendar"
import { vi } from "date-fns/locale"
import { format } from "date-fns"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { cn } from "@/lib/utils"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"

export default function EditProfilePage({ currentUser, isForAdmin = false,mutate }: { currentUser: UserModel, isForAdmin?: boolean,mutate?:()=>void }) {
  const [user, setUser] = useState<UserModel>(currentUser)
  const [file, setFile] = useState<File | null>(null)

  const handleChange = (e?: React.ChangeEvent<HTMLInputElement>, d?: Date,g?:boolean) => {
    if (e) {
      console.log(e)
      const { name, value } = e.target
      setUser((prev) => ({ ...prev, [name]: value }))
    } else if (d) {
      console.log(d)
      setUser((prev) => ({ ...prev, ['birthDate']: d }))
    }else if(g!=null){
      console.log(g)
      setUser((prev) => ({ ...prev, ['isMale']: g }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    editProfile(user, file)
      .then(res => {
        if (res?.data?.result === 1) {
          MyToaster("success", "Thay đổi thông tin thành công")
          mutate
        } else if (res?.data?.result === 0) {
          MyToaster("error", JSON.stringify(res.data?.details))
        }
      })
      .catch(error => {
        const messages: string[] = Object.values(error?.response?.data?.details) || ["Lỗi không xác định"];
        MyToaster("error", undefined, messages);
      });
  }

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const tempUrl = URL.createObjectURL(file)
      setUser((prev) => ({ ...prev, ["avatarUrl"]: tempUrl }))
      setFile(file)
    }
  }

  if (user)
    return (
      <div>
        <div className="w-full mx-auto border-0">
          <CardHeader className="pb-10">
            <CardTitle>Sửa thông tin:</CardTitle>
            <CardDescription>Xem và cập nhật thông tin tài khoản, ảnh đại diện</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col items-center gap-4">
                  <Avatar className="h-32 w-32">
                    <AvatarImage src={user.avatarUrl} alt={`${user.firstName} ${user.lastName}`} />
                    <AvatarFallback className="text-2xl">
                      <User className="h-12 w-12" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <Label htmlFor="avatar-upload" className="cursor-pointer">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                        <Upload className="h-4 w-4" />
                        <span>Cập nhật ảnh đại diện</span>
                      </div>
                    </Label>
                    <Input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarUpload}
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <div className="grid gap-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Họ</Label>
                        <Input id="lastName" name="lastName" value={user.lastName} onChange={handleChange} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="firstName">Tên</Label>
                        <Input id="firstName" name="firstName" value={user.firstName} onChange={handleChange} />
                      </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" value={user.email} onChange={handleChange} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">SĐT</Label>
                        <Input id="phone" name="phone" type={"number"} value={user.phone ?? ''} onChange={handleChange} />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Giới tính</Label>
                        <RadioGroup defaultValue={String(user.isMale)} className="flex" name="isMale" onValueChange={g => handleChange(undefined,undefined,g==="true")}>
                          <div className="flex items-center gap-3">
                            <RadioGroupItem value="true" id="r1" />
                            <Label htmlFor="r1">Nam</Label>
                          </div>
                          <div className="flex items-center gap-3">
                            <RadioGroupItem value="false" id="r2" />
                            <Label htmlFor="r2">Nữ</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Ngày sinh</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[240px] justify-start text-left font-normal",
                                !user.birthDate && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon />
                              {user.birthDate ? format(user.birthDate, "PPP", { locale: vi }) : <span>Chọn ngày sinh</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              captionLayout="dropdown"
                              fromYear={1900}
                              toYear={new Date().getFullYear()}
                              locale={vi}
                              mode="single"
                              selected={new Date(user.birthDate)}
                              onSelect={v => handleChange(undefined, v)}
                              disabled={(date) => date > new Date()}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2 pt-10">
              <Button variant="outline" type="button" onClick={() => setUser(currentUser)}>
                Hủy
              </Button>
              <Button type="submit" className="bg-green-500">Lưu</Button>
            </CardFooter>
          </form>
        </div>
      </div>
    )
}
