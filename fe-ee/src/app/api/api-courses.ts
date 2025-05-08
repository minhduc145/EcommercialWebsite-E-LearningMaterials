import { url_backend_default } from "@/lib/public-var";
import { CourseContainerModel } from "@/models/CourseContainerModel";
import axios from "axios";
axios.defaults.withCredentials = true;
axios.defaults.baseURL = url_backend_default;

export default async function getAllCourses() {
    return await axios.get("/api/courses/getAll")
}

export async function getSearchCourses(keyword: string, pageIndex: number) {
    return await axios.get("/api/courses/search", {
        params: {
            pageIndex: pageIndex || 1,
            keyWord: keyword
        }
    })
}

export async function getCourse(id: string | null) {
    return await axios.get("/api/courses/get/" + id)
}

export async function getCourseReview(id: string | null, currentPage: any) {
    return await axios.get("/api/courses/getReview/" + id, {
        params: {
            pageIndex: currentPage
        }
    })
}

export async function getSumAllStarReview(id: string | null) {
    return await axios.get("/api/courses/getReview/getTotalStar/" + id)
}

export async function getAverageStarReview(id: string | null) {
    return await axios.get("/api/courses/getReview/getAverageStar/" + id)
}

export async function getCourseData(id: string | null) {
    return await axios.get("/api/courses/getCourseData/" + id)
}

export async function deleteCourse(idSet: string[] | []) {
    const params = new URLSearchParams();
    idSet.forEach(id => params.append('idSet', id));
    return await axios.delete("/api/courses/delete", {
        data: idSet
    })
}

export async function getCategories() {
    return await axios.get("/api/categories")
}

export async function submitCourseInfo({
    id,
    bannerFile,
    name,
    description,
    price,
    isAvailable,
    categoryId
}: {
    id: string | null;
    bannerFile: File | null;
    name: string;
    description: string;
    price: number | 0;
    isAvailable: boolean;
    categoryId: string;
}) {
    if (!name || !categoryId || !description) {
        alert("Vui lòng nhập đầy đủ thông tin bắt buộc");
        return;
    }

    const formData = new FormData();
    { id && formData.append("id", id); }
    { bannerFile && formData.append("bannerFile", bannerFile); }
    formData.append("title", name);
    formData.append("description", description);
    formData.append("price", String(price ?? 0));
    formData.append("isAvailable", String(isAvailable));
    formData.append("categoryId", categoryId);

    return await axios.post("/api/courses/add/info", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

};

export async function addContainer(id: string, container: CourseContainerModel) {
    const postObject = {
        courseId: id,
        container : container
    }
    return await axios.post("/api/courses/add/data/folder", postObject, {
        headers: { "Content-Type": "application/json", },
    })
}

export function uploadToR2SignedUrl(
    file: File,
    signedUrl: string,
    onProgress?: (percent: number) => void
) {
    const controller = new AbortController();

    const promise = axios.put(signedUrl, file, {
        headers: {
            "Content-Type": file.type,
        },
        signal: controller.signal,
        onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
                const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                onProgress?.(percent);
            }
        },
    });

    return {
        promise,
        abort: () => controller.abort(),
    };
}

