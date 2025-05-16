import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { UserModel } from "@/models/UserModel"
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"
import { editPassword } from "@/app/api/api-account"
import MyToaster from "./ui/toastify-template"


interface ChangePasswordInterface {
    oldPassword: string,
    newPassword: string,
    confirmPassword: string,
}

const schema = yup.object({
    oldPassword: yup.string().min(3, 'Mật khẩu ít nhất 3 ký tự').required('Vui lòng nhập mật khẩu cũ'),
    newPassword: yup
        .string().min(3, 'Mật khẩu ít nhất 3 ký tự').required('Vui lòng nhập mật khẩu mới').test('not-same-as-old', 'Mật khẩu mới không được trùng với mật khẩu cũ', function (value) {
            const { oldPassword } = this.parent;
            return value !== oldPassword;
        }),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref('newPassword')], 'Mật khẩu không khớp')
        .required('Vui lòng xác nhận mật khẩu'),
});
export default function EditUserPassword({ currentUser, isNewAccount = false, isForAdmin = false }: { currentUser: UserModel, isNewAccount?: boolean, isForAdmin?: boolean }) {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = (data: ChangePasswordInterface) => {
        editPassword(currentUser.id, data).then(res => {
            MyToaster("success", "Thay đổi mật khẩu thành công")
        }).catch(error => {
            MyToaster("error", error?.response?.data?.message )
        });
    }
    return (
        <form onSubmit={handleSubmit(onSubmit)} className="w-full mx-auto border-0">
            <CardHeader className="pb-10">
                <CardTitle>Thay đổi mật khẩu:</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pb-10">
                <div className="space-y-2">
                    <Label htmlFor="current-password">Mật khẩu hiện tại</Label>
                    <Input id="current-password" type="password"  {...register("oldPassword")} required />
                    {errors.oldPassword && (
                        <p className="text-red-500 text-[12px]">{errors.oldPassword.message}</p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="new-password">Mật khẩu mới</Label>
                    <Input id="new-password" type="password"  {...register("newPassword")} required />
                    {errors.newPassword && (
                        <p className="text-red-500 text-[12px]">{errors.newPassword.message}</p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="confirm-password">Xác nhận lại mật khẩu mới</Label>
                    <Input id="confirm-password" type="password"  {...register("confirmPassword")} required />
                    {errors.confirmPassword && (
                        <p className="text-red-500 text-[12px]">{errors.confirmPassword.message}</p>
                    )}
                </div>
            </CardContent>
            <CardFooter>
                <Button className="w-full">Thay đổi</Button>
            </CardFooter>
        </form>
    )
}