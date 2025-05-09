"use client";

import { channelList } from "@/features/channels/api/channelList";
import { channelModal } from "@/features/channels/store/channelModal";
import { activeMember } from "@/features/members/api/activeMember";
import { workspaceById } from "@/features/workspaces/api/workspaceById";
import { workspaceIdParam } from "@/hooks/workspaceIdParam";
import { AlertTriangle, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

const WorkspaceIdView = () => {
    const workspaceId = workspaceIdParam();
    const router = useRouter();
    const [open, setOpen] = channelModal();

    const { data: member, isLoading: memberLoading } = activeMember({ workspaceId });
    const { data: workspace, isLoading: workspaceLoading } = workspaceById({ id: workspaceId });
    const { data: channels, isLoading: channelsLoading } = channelList({
        workspaceId,
    });

    const channelId = useMemo(() => channels?.[0]?._id, [channels]);
    const isAdmin = useMemo(() => member?.role === "admin", [member?.role]);

    useEffect(() => {
        if (workspaceLoading || channelsLoading || memberLoading || !member || !workspace) return;

        if (channelId) {
            router.push(`/workspace/${workspaceId}/channel/${channelId}`);
        } else if (!open && isAdmin) {
            setOpen(true)
        }
    }, [
        member,
        memberLoading,
        isAdmin,
        channelId,
        workspaceLoading,
        channelsLoading,
        workspace,
        open,
        setOpen,
        router,
        workspaceId,
    ]);

    if (workspaceLoading || channelsLoading) {
        return (
            <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
                <LoaderCircle className="size-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!workspace) {
        return (
            <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
                <AlertTriangle className="size-6 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                    Workspace not found.
                </span>
            </div>
        );
    }

    return (
            <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
                <AlertTriangle className="size-6 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                    Channel not found.
                </span>
            </div>
        );
    
};
 
export default WorkspaceIdView;