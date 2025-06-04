
import { url_backend_default } from "@/lib/public-var";
import { UserModel } from "@/models/UserModel";
import axios from "axios";
import { format } from "date-fns";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = url_backend_default;

export async function getAccountInfo() {
    return await axios.post("/api/accounts/get_user_login_info_by_cookie");
}

export async function submitSignUp(formData: any) {
    return await axios.post("/api/accounts/signup", formData);
}

export async function editProfile(userModel: UserModel, avatarFile: File | null) {
    if (!userModel.firstName || !userModel.lastName || !userModel.email) {
        alert("Vui lòng nhập đầy đủ thông tin bắt buộc");
        return;
    }

    const formData = new FormData();
    { avatarFile && formData.append("avatarFile", avatarFile); }
    formData.append("id", userModel.id)
    formData.append("firstName", userModel.firstName);
    formData.append("lastName", userModel.lastName);
    formData.append("email", userModel.email);
    formData.append("phone", userModel.phone);
    formData.append("birthDate", format(userModel.birthDate, 'yyyy-MM-dd'));
    formData.append("isMale", String(userModel.isMale));

    return await axios.post("/api/accounts/profile/edit", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
}

export async function editPassword(userId: string, formData: any) {
    return await axios.post("/api/accounts/password/edit", {
        userId: userId,
        ...formData
    });
}