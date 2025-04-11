'use client'
import { House } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ToastContainer, toast } from 'react-toastify';
import * as yup from "yup";
import axios from "axios";
import { useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { link_google_login } from "@/datadto/public-var"
axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://localhost:8080";
const schema = yup.object({
	id: yup.string().required("Vui lòng nhập username"),
	password: yup.string().min(3, "Mật khẩu ít nhất 3 ký tự").required("Vui lòng nhập mật khẩu"),
});

export default function LoginPage() {

	const { register, handleSubmit, formState: { errors } } = useForm({
		resolver: yupResolver(schema),
	});

	const onSubmit = (data: any) => {
		console.log(errors)
		const userLogin = {
			"id": data.id,
			"password": data.password
		}
		axios.post(
			"/api/accounts/login",
			userLogin
		).then(function (response) {
			if (response.data.result === 0)
				throw new Error("Đăng nhập lỗi")
			window.location.href = "/"
		}).catch(function (error) {
			var msg = error.response? error.response.data.message : error.message
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
	const searchParams = useSearchParams()
	const isSuccess = searchParams.has('success')
	const isFail = searchParams.has('fail')
	useEffect(() => {
		if (isSuccess) {
			toast.success(<div>
				Đăng nhập thành công! <br />
			</div>, {
				position: "top-right", autoClose: 5000, hideProgressBar: false, closeOnClick: false, pauseOnHover: true, draggable: true, progress: undefined, theme: "light",
			});
			window.location.href = "/"
		} else if (isFail) {
			toast.error(<div>
				Đăng nhập không thành công! <br />
			</div>, {
				position: "top-right", autoClose: 5000, hideProgressBar: false, closeOnClick: false, pauseOnHover: true, draggable: true, progress: undefined, theme: "light",
			});
		}
	}, [])

	return (
		<>
			<Notify />
			<a className="absolute p-5 float-left" href="/">
				<House aria-hidden className="size-6" />
			</a>
			<div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
				<div className="flex w-full max-w-sm flex-col gap-6">
					<Card>
						<CardHeader className="text-center">
							<CardTitle className="text-xl">Welcome</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-6">
								<div className="grid gap-6">
									<form onSubmit={handleSubmit(onSubmit)}>
										<div className="grid gap-6">
											<div className="grid gap-3">
												<Label htmlFor="email">Email or Username</Label>
												<Input
													{...register("id")}
													id="id"
													name="id"
													type="text"
													autoComplete="username"
												/>
												{errors.id && (
													<p className="text-red-500 text-sm">{errors.id.message}</p>
												)}
											</div>
											<div className="grid gap-3">
												<div className="flex items-center">
													<Label htmlFor="password">Password</Label>
													<a
														href="#"
														className="ml-auto text-sm underline-offset-4 hover:underline"
													>
														Forgot your password?
													</a>
												</div>
												<Input id="password" {...register("password")}
													name="password"
													type="password"
													autoComplete="current-password" required />
												{errors.password && (
													<p className="text-red-500 text-sm">{errors.password.message}</p>
												)}
											</div>
											<Button type="submit" className="w-full bg-blue-600">
												Login
											</Button>
										</div>
									</form>
									<div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
										<span className="bg-card text-muted-foreground relative z-10 px-2">
											Or continue with
										</span>
									</div>
									<div className="flex flex-col gap-4">
										<a href={link_google_login}>
											<Button variant="outline" className="w-full">
												<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 48 48">
													<path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
												</svg>
												Login with Google Account
											</Button>
										</a>
									</div>
									<div className="text-center text-sm">
										Don't have an account?{" "}
										<Link href="/User/Signup" className="underline underline-offset-4">
											Sign up
										</Link>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
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