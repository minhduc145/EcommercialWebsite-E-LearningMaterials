import ClientHeaderWrapper from "@/components/ClientHeaderWrapper"
import ClientFooterWrapper from "@/components/ClientFooterWrapper"

export default function CoursePageLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <ClientHeaderWrapper color="blue"/>
             {children}
            <br />
            <ClientFooterWrapper/>
        </>
    )
}