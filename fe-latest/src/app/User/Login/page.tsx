'use client'
import axios from "axios";
import Image from "next/image";
import pLogo from "@/app/logo.svg"
import gLogo from "./google_icon.ico"
import { ToastContainer, toast } from 'react-toastify';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/navigation";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://localhost:8080";

const schema = yup.object({
    id: yup.string().required("Vui lòng nhập username"),
    password: yup.string().min(3, "Mật khẩu ít nhất 3 ký tự").required("Vui lòng nhập mật khẩu"),
});


export default function UserLogin() {
    const router = useRouter();
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });
    const onSubmit = (data: any) => {
        const userLogin = {
            "id": data.id,
            "password": data.password
        }
        axios.post(
            "/users/login",
            userLogin
        )
            .then(function (response) {
                window.location.href = "/"
            })
            .catch(function (error) {
                var msg = error.message
                if (error.status === 404) msg = "Tài khoản hoặc mật khẩu không đúng"
                toast.error(<div>
                    Đăng nhập Thất bại! <br /> {msg}
                </div>, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            });
    }

    return (
        <>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <Image src={pLogo} alt="" className="mx-auto h-20" />

                    <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
                        Sign in to your account
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                                Username
                            </label>
                            <div className="mt-2">
                                <input  {...register("id")}
                                    id="id"
                                    name="id"
                                    type="text"
                                    autoComplete="username"
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                />
                                <p className="text-red-500">{errors.id?.message}</p>
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                                    Password
                                </label>
                                <div className="text-sm">
                                    <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                                        Forgot password?
                                    </a>
                                </div>
                            </div>
                            <div className="mt-2">
                                <input {...register("password")}
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                />
                                <p className="text-red-500">{errors.password?.message}</p>
                            </div>
                        </div>

                        <div>
                            <button
                                id="login-submit-btn"
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Sign in
                            </button>
                        </div>
                    </form>

                    <p className="mt-10 text-center text-sm/6 text-gray-500">
                        Not a member?{' '}
                        <a href="Signup" className="font-semibold text-indigo-600 hover:text-indigo-500">
                            Sign up.
                        </a>
                    </p>
                    <p className="text-center my-4">
                        or
                    </p>
                    <div>
                        <button
                            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 hover:cursor-pointer"
                        >
                            Sign in with Google Account &nbsp; <span><Image className={"pt-1"} src={gLogo} width={16} height={16} alt="Logo"></Image></span>
                        </button>
                    </div>
                </div>

            </div>
            <Notify />
        </>
    )
}
function Notify() {
    return (
        <div>
            <ToastContainer />
        </div>
    );
}