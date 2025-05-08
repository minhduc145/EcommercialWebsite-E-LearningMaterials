import useSWR from "swr"
import axios from "axios"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { UserModel } from "@/models/UserModel"

const fetcher = (url: string) => axios.post(url).then(res => res.data)

export function useUserInfo(options?: { redirectToLogin?: boolean }) {
  const router = useRouter()
  const { data: user, error, isLoading, mutate } = useSWR<UserModel>(
    "/api/accounts/get_user_login_info_by_cookie",
    fetcher,
    {
      dedupingInterval: 10 * 60 * 1000,
    }
  )

  useEffect(() => {
    if (error && options?.redirectToLogin) {
      router.push("/login")
    }
  }, [error])

  return {
    user,
    isLoading,
    isError: !!error,
    refresh: mutate,
    logout: () => mutate(undefined), 
  }
}
