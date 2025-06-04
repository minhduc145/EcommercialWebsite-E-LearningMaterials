import { url_backend_default } from "@/lib/public-var";
import axios from "axios";
axios.defaults.withCredentials = true;
axios.defaults.baseURL = url_backend_default;

export async function getSearchProps() {
    return await axios.get("/api/user/search/courses/getSearchProps")
}

export async function searchCoursesForUser(title?: string, categories?: number[], price1?: number, price2?: number, startDate?: string, endDate?: string, takeFeatures?:boolean,sort?:string,descending?:boolean,page?:number) {
    return await axios.post("/api/user/search/courses", {
        title,
        categories,
        price1,
        price2,
        startDate,
        endDate,
        takeFeatures,
        sort,
        descending,
        page:page&&page-1
    })
}