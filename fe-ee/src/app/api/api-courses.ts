import { url_backend_default } from "@/lib/public-var";
import { CourseContainerModel } from "@/models/CourseContainerModel";
import { CourseFileModel } from "@/models/CourseFileModel";
import axios from "axios";
axios.defaults.withCredentials = true;
axios.defaults.baseURL = url_backend_default;

export default async function getAllCourses() {
    return await axios.get("/api/courses/getAll")
}

export async function getFeaturesSummary() {
    return await axios.get("/api/courses/getFeatures")
}


export async function getSearchCourses(pageIndex: number, keyword: string, sort: string, descending: boolean) {
    return await axios.get("/api/courses/search", {
        params: {
            pageIndex: pageIndex,
            keyword: keyword,
            sort: sort,
            descending: descending
        }
    })
}

export async function getCourse(id: string | null) {
    return await axios.get("/api/courses/get/" + id)
}

export async function getCourseReview(id: string | null, currentPage: any) {
    return await axios.get("/api/courses/review/get/" + id, {
        params: {
            pageIndex: currentPage
        }
    })
}

export async function getSumAllStarReview(id: string | null) {
    return await axios.get("/api/courses/review/get/getTotalStar/" + id)
}

export async function getAverageStarReview(id: string | null) {
    return await axios.get("/api/courses/review/get/getAverageStar/" + id)
}

export async function getCourseData(id: string | null) {
    return await axios.get("/api/courses/getCourseData/" + id)
}
export async function getCourseDataWithUrl(id: string | null) {
    return await axios.get("/api/courses/getCourseDataWithUrl/" + id)
}
export async function getReviewByUserAndCourse(courseId: string, username: string) {
    return await axios.get("/api/courses/review/get", {
        params: {
            courseId,
            username
        }
    })
}
export async function submitReview(reviewId: number | undefined, courseId: string, comment: string, star: number) {
    return await axios.post("/api/courses/review/add", { reviewId, courseId, comment, star })
}

export async function getSubscriptionCardSummary(username: string, courseId: string) {
    return await axios.get("/api/courses/subscription/getSummary", {
        params: {
            username,
            courseId
        }
    })
}


export async function deleteReview(reviewId: number) {
    return await axios.post("/api/courses/review/delete", { reviewId })
}

export async function deleteCourse(idSet: string[] | []) {
    const params = new URLSearchParams();
    idSet.forEach(id => params.append('idSet', id));
    return await axios.delete("/api/courses/delete", {
        data: idSet
    })
}

export async function getCategories(keyword: string, sort: string, descending: boolean) {
    return await axios.get("/api/categories", {
        params: {
            keyword,
            sort,
            descending
        }
    })
}

export async function deleteCategories(id: string[]) {
    return await axios.delete("/api/categories", {
        data: {
            id
        }
    })
}

export async function submitCourseInfo({
    id,
    bannerFile,
    name,
    description,
    price,
    isAvailable,
    isFeatured,
    categoryId
}: {
    id: string | null;
    bannerFile: File | null;
    name: string;
    description: string;
    price: number | 0;
    isAvailable: boolean;
    isFeatured: boolean;
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
    formData.append("isFeatured", String(isFeatured));
    formData.append("categoryId", categoryId);

    return await axios.post("/api/courses/info/add", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

};

export async function addContainer(id: string, container: CourseContainerModel) {
    const postObject = {
        courseId: id,
        container: container
    }
    return await axios.post("/api/courses/data/container/add", postObject, {
        headers: { "Content-Type": "application/json", },
    })
}

export async function addFile(id: string, file: CourseFileModel) {
    const postObject = {
        containerId: id,
        file: file
    }
    return await axios.post("/api/courses/data/file/add", postObject, {
        headers: { "Content-Type": "application/json", },
    })
}

export async function deleteContainer(id: string) {
    return await axios.post("/api/courses/data/container/delete", id, {
        headers: { "Content-Type": "application/json", },
    })
}

export async function deleteFile(id: string) {
    return await axios.post("/api/courses/data/file/delete", id, {
        headers: { "Content-Type": "application/json", },
    })
}

// export async function addAllContainer(id: string, containers: CourseContainerModel[]) {
//     const postObject = {
//         courseId: id,
//         object: containers
//     }
//     return await axios.post("/api/courses/add/data", postObject, {
//         headers: { "Content-Type": "application/json", },
//     })
// }

export async function getSignedUrl(fileKey: string) {
    return await axios.get("/api/files/uploadSigned", {
        params: { fileKey },
    });
}

export async function uploadFileToSignedUrl(
    file: File,
    signedUrl: string,
    onProgress?: (percent: number) => void,
    signal?: AbortSignal
) {
    try {
        await axios.put(signedUrl, file, {
            headers: {
                "Content-Type": file.type || "application/octet-stream",
            },
            onUploadProgress: (progressEvent) => {
                if (progressEvent.total) {
                    const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    onProgress?.(percent);
                }
            },
            withCredentials: false,
            signal
        });
        console.log("✅ Upload completed");
    } catch (error: any) {
        if (axios.isCancel(error) || error?.name === 'CanceledError') {
            console.warn("aborted");
        } else {
            console.error("failed", error);
            throw error;
        }
    }
}

export async function isSubscribedByUser(courseId: string | undefined) {
    return await axios.get("/api/courses/isSubscribedByUser", {
        params: { courseId },
    });
}


