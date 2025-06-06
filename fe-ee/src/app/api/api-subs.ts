import { url_backend_default } from "@/lib/public-var";
import axios from "axios";
axios.defaults.withCredentials = true;
axios.defaults.baseURL = url_backend_default;
export async function getSubsByUser(keyword?:string,sort?:string,descending?:boolean,page?:number) {
    return await axios.post("/api/search/subscriptions",{
        keyword,sort,descending,page
    })
}

export async function submitReturnReq(subId:string,reason:string) {
    return await axios.post("/api/subscriptions/returnRequest",{
       subId,reason
    })
}

export async function getRefundsByUser(keyword?:string,sort?:string) {
    return await axios.post("/api/search/refundRequests",{keyword,sort})
}


export async function getRefundRequests(sort?:string) {
    return await axios.get("/api/admin/subscriptions/returnRequest",{
        params:{sort}
    })
}

export async function submitHandleReturnReq(reqId:string,reason:string,action:string) {
    return await axios.post("/api/admin/subscriptions/handleReturnRequest",{
       reqId,reason,action
    })
}