import { url_backend_default } from "@/lib/public-var";
import { UserModel } from "@/models/UserModel";
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = url_backend_default;

export async function getAllMessages(pageIndex: number, pageSize?: number | 5, sort?: string | undefined, descending?: boolean | false, keyword?: string) {
    return await axios.get("/api/messages", {
        params: {
            page: pageIndex,
            size: pageSize,
            sort: sort,
            descending: descending,
            keyword: keyword
        }
    });
}

export async function deleteMessage(id:number[]) {
    return await axios.delete("/api/messages", {
        data: {
            id
        }
    }
    );
}


export async function getPreviewByCookie() {
    return await axios.get("/api/messages/getPreviewByCookie",);
}

export async function sendMessage(messageBody: any) {
    return await axios.post("/api/messages", messageBody);
}