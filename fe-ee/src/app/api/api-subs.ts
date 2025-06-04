import { url_backend_default } from "@/lib/public-var";
import axios from "axios";
axios.defaults.withCredentials = true;
axios.defaults.baseURL = url_backend_default;
export async function getSubsByUser(keyword?:string,sort?:string,descending?:boolean,page?:number) {
    return await axios.post("/api/search/courses/subscriptions",{
        keyword,sort,descending,page
    })
}

export async function submitReturnReq(subId:string,reason:string) {
    return await axios.post("/api/subscriptions/returnRequest",{
       subId,reason
    })
}
