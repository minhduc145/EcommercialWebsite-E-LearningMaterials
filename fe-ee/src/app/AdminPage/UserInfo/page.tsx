import { Card } from "@/components/ui/card";
import EditProfilePage from "@/components/user-info-edit";
import EditUserPassword from "@/components/user-password-edit";

export default function Page() {
    return (
        <div>
            <Card className="p-10">
                <EditProfilePage />
                <hr />
                <EditUserPassword />
            </Card>
        </div>
    );
}