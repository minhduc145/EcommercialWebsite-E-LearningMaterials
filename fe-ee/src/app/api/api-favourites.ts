import { url_backend_default } from "@/lib/public-var";
import axios from "axios";
axios.defaults.withCredentials = true;
axios.defaults.baseURL = url_backend_default;

export async function markAsFavourite(courseId: string) {
    return await axios.put("/api/favourites/add", {
        courseId
    }
    )
}

export async function deleteFromFavourite(courseId: string) {
    return await axios.delete("/api/favourites/delete", {
        data: {courseId}
    })
}