import axios from "axios";
axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://localhost:8080";

export default async function getAllCourses() {
    return await axios.get("/api/courses/getAll")
}

export async function getCourse(id: string | null) {
    return await axios.get("/api/courses/get/" + id)
}

export async function getCourseReview(id: string | null, currentPage: any) {
    return await axios.get("/api/courses/getReview/" + id,{
        params:{
            pageIndex:currentPage
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