'use client'
import { Card } from "@/components/ui/card";
import EditProfilePage from "@/components/user-info-edit";
import EditUserPassword from "@/components/user-password-edit";
import { useUserInfo } from "@/lib/user-info"

export default function Page() {
    const { user, isLoading, isError, logout,refreshUser } = useUserInfo({ redirectToLogin: false })
    if(user)
    return (
        <Card>
            <EditProfilePage currentUser={user} mutate={refreshUser}/>
            <hr className="p-2 mt-2"/>
            <EditUserPassword currentUser={user}/>
        </Card>
    );
}