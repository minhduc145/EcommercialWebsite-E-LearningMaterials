import { url_backend_default } from "@/lib/public-var";
import { UserModel } from "@/models/UserModel";
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = url_backend_default;

export async function getUsers() {
    return await axios.get("/api/accounts/users");
}