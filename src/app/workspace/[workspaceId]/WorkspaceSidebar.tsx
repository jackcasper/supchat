import { useActiveMember } from "@/features/api/useActiveMember";
import { useWorkspaceById } from "@/features/workspaces/api/useWorkspaceById";
import { useWorkspaceIdParam } from "@/hooks/useWorkspaceIdParam";
import { Loader, TriangleAlert } from "lucide-react";
import { WorkspaceHeader } from "./WorkspaceHeader";

export const WorkspaceSidebar = () => {
    const workspaceId = useWorkspaceIdParam();

    const { data: member, isLoading: memberLoading } = useActiveMember({ workspaceId });
    const { data: workspace, isLoading: workspaceLoading } = useWorkspaceById({ id: workspaceId });

    if (workspaceLoading || memberLoading) {
        return (
            <div className="flex flex-col bg-[#E0E7FF] h-full items-center justify-center">
                <Loader className="size-5 animate-spin text-white" />
            </div>
        );
    }

    if (!workspace || !member) {
        return (
            <div className="flex flex-col gap-y-2 bg-[#E0E7FF] h-full items-center justify-center">
                <TriangleAlert className="size-5 text-red-600" />
                <p className="text-black text-sm">
                    Workspace not found
                </p>
            </div>
        );
    }
    
    return (
        <div className="flex flex-col bg-[#E0E7FF] h-full">
            <WorkspaceHeader workspace={workspace} isAdmin={member.role === "admin"} />
        </div>
    )
};