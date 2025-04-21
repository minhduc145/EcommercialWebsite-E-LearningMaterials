
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://localhost:8080";

export async function isAdmin() {
    return await axios.post("/api/accounts/isAdmin");
}

export async function getAccountInfo(){
    return await axios.post("/api/accounts/get_user_login_info_by_cookie");
}

export async function getUserInfo(){
    return await axios.post("/api/accounts/get_user_login_info_by_cookie");
}