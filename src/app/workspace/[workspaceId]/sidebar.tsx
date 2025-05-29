import { UserButton } from "@/features/auth/components/UserButton";
import { WorkspaceSelector } from "./WorkspaceSelector";
import { SidebarButton } from "./SidebarButton";
import { Home } from "lucide-react";
import { usePathname } from "next/navigation";

export const Sidebar = () => {
    const pathname = usePathname();
    
    return (
        <aside className="w-[70px] h-full bg-[#3D2683] flex flex-col gap-y-4 items-center pt-[9px] pb-4">
            <WorkspaceSelector />
            <SidebarButton icon={Home} label="Home" isActive={pathname.includes("/workspace")} />
            <div className="flex flex-col items-center justify-center gap-y-1 mt-auto">
                <UserButton />
            </div>
        </aside>
    );
};