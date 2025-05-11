import ClientHeaderWrapper from "@/components/ClientHeaderWrapper"
import ClientFooterWrapper from "@/components/ClientFooterWrapper"
import { ToastContainer } from "react-toastify"

export default function CoursePageLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <ClientHeaderWrapper color="blue" />
            {children}
            <ToastContainer />
            <br />
            <ClientFooterWrapper />
        </>
    )
}