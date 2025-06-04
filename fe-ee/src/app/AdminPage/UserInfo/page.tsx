'use client'
import { Card } from "@/components/ui/card";
import EditProfilePage from "@/components/user-info-edit";
import EditUserPassword from "@/components/user-password-edit";
import { useUserInfo } from "@/lib/user-info";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";

export default function Page() {
    const { user, isLoading, isError, logout, refresh } = useUserInfo({ redirectToLogin: false })
    useEffect(()=>{
        refresh()
    },[user])

    if(user)
    return (
        <div>
            <Card className="p-10">
                <EditProfilePage currentUser={user} mutate={refresh}/>
                <hr />
                <EditUserPassword currentUser={user}/>
            </Card>
        </div>
    );
}