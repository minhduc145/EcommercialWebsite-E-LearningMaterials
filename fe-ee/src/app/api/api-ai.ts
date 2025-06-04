
import { url_backend_default } from "@/lib/public-var";
import axios from "axios";
axios.defaults.withCredentials = true;

axios.defaults.baseURL = url_backend_default;

export async function askAI(message: string, model?: string) {
    return axios.post("http://localhost:3000/api/groq", {
        message: message,
        model: model ?? "gemma2-9b-it"
    }, {
        headers: {
            "Content-Type": "application/json"
        }
    });
};
