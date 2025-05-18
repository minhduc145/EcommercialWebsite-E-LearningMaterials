"use client"

import type React from "react"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Upload, User } from "lucide-react"
import { UserModel } from "@/models/UserModel"
import { editProfile } from "@/app/api/api-account"
import MyToaster from "./ui/toastify-template"

export default function EditProfilePage({ currentUser, isForAdmin = false }: { currentUser: UserModel, isForAdmin?:boolean }) {
  const [user, setUser] = useState<UserModel>(currentUser)
  const [file, setFile] = useState<File | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUser((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    editProfile(user, file)
      .then(res => {
        if (res?.data?.result === 1) {
          MyToaster("success", "Thay đổi thông tin thành công")
        } else if (res?.data?.result === 0) {
          MyToaster("error", JSON.stringify(res.data?.details))
        }
      })
      .catch(error => {
        const message = error.response?.data?.details || "Lỗi không xác định";
        MyToaster("error", JSON.stringify(message));
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
