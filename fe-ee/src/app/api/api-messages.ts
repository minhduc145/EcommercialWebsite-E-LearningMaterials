import { url_backend_default } from "@/lib/public-var";
import { UserModel } from "@/models/UserModel";
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = url_backend_default;

export async function getPreviewByCookie() {
    return await axios.get("/api/notifications/getPreviewByCookie",);
}

export async function getAllMessages(pageIndex: number, sort?: string | undefined, descending?: boolean | false, keyword?: string) {
    return await axios.get("/api/admin/notifications", {
        params: {
            page: pageIndex,
            sort: sort,
            descending: descending,
            keyword: keyword
        }
    });
}

export async function deleteMessage(id: number[]) {
    return await axios.delete("/api/admin/notifications", {
        data: {
            id
        }
    }
    );
}

export async function sendMessage(messageBody: any) {
    return await axios.post("/api/admin/notifications", messageBody);
}


