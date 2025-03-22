import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar";
import { Navbar } from "./components/nav-bar"
import { isAuthenticatedOrRedirect } from "@/services/session.action"

const URL = "http://127.0.0.1:8000/"

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {

    await isAuthenticatedOrRedirect()


    return (
        <SidebarProvider>
            <AppSidebar />
            <div className="flex-1 flex flex-col">
                <Navbar />
                <div className="flex-1 overflow-auto">
                    <main className="container py-6">{children}</main>
                </div>
            </div>
        </SidebarProvider>
    )
}