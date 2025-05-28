"use client";

import { useChannelList } from "@/features/channels/api/channelList";
import { useChannelModal } from "@/features/channels/store/channelModal";
import { useActiveMember } from "@/features/members/api/activeMember";
import { useWorkspaceById } from "@/features/workspaces/api/workspaceById";
import { useWorkspaceIdParam } from "@/hooks/workspaceIdParam";
import { AlertTriangle, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

const WorkspaceIdView = () => {
    const workspaceId = useWorkspaceIdParam();
    const router = useRouter();
    const [open, setOpen] = useChannelModal();

    const { data: member, isLoading: memberLoading } = useActiveMember({ workspaceId });
    const { data: workspace, isLoading: workspaceLoading } = useWorkspaceById({ id: workspaceId });
    const { data: channels, isLoading: channelsLoading } = useChannelList({
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

    if (workspaceLoading || channelsLoading || memberLoading) {
        return (
            <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
                <LoaderCircle className="size-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!workspace || !member) {
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