import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { UserModel } from "@/models/UserModel"

export default function EditUserPassword({currentUser}:{currentUser:UserModel}) {
    return (
        <div className="w-full mx-auto border-0">
            <CardHeader className="pb-10">
                <CardTitle>Thay đổi mật khẩu:</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pb-10">
                <div className="space-y-2">
                    <Label htmlFor="current-password">Mật khẩu hiện tại</Label>
                    <Input id="current-password" type="password" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="new-password">Mật khẩu mới</Label>
                    <Input id="new-password" type="password" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="confirm-password">Xác nhận lại mật khẩu mới</Label>
                    <Input id="confirm-password" type="password" required />
                </div>
            </CardContent>
            <CardFooter>
                <Button className="w-full">Thay đổi</Button>
            </CardFooter>
        </div>
    )
}