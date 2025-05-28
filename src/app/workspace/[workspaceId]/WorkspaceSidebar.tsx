import { Hash, Loader, MessageSquareText, Send, TriangleAlert } from "lucide-react";
import { WorkspaceHeader } from "./WorkspaceHeader";
import { SidebarItem } from "./SidebarItem";
import { WorkspaceSection } from "./WorkspaceSection";
import { UserItem } from "./userItem";
import { useChannelList } from "@/features/channels/api/channelList";
import { useChannelModal } from "@/features/channels/store/channelModal";
import { useActiveMember } from "@/features/members/api/activeMember";
import { useMemberList } from "@/features/members/api/memberList";
import { useWorkspaceById } from "@/features/workspaces/api/workspaceById";
import { usechannelIdParam } from "@/hooks/channelIdParam";
import { useMemberIdParam } from "@/hooks/memberIdParam";
import { useWorkspaceIdParam } from "@/hooks/workspaceIdParam";

export const WorkspaceSidebar = () => {
    const channelId = usechannelIdParam();
    const workspaceId = useWorkspaceIdParam();
    const memberId = useMemberIdParam();

    const [_open, setOpen] = useChannelModal();

    const { data: member, isLoading: memberLoading } = useActiveMember({ workspaceId });
    const { data: workspace, isLoading: workspaceLoading } = useWorkspaceById({ id: workspaceId });
    const { data: channels, isLoading: channelsLoading } = useChannelList({ workspaceId });
    const { data: members, isLoading: membersLoading } = useMemberList({ workspaceId });

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
            <div className="flex flex-col px-2 mt-3">
                <SidebarItem
                    label="Threads"
                    icon={MessageSquareText}
                    id="threads"
                />
                <SidebarItem
                    label="Sent & Drafts"
                    icon={Send}
                    id="drafts"
                />    
            </div>
                <WorkspaceSection
                    label="Channels"
                    hint="New channel"
                    onNew={member.role === "admin" ? () => setOpen(true) : undefined}
                >
                    {channels?.map((item) => (
                        <SidebarItem
                            key={item._id}
                            icon={Hash}
                            label={item.name}
                            id={item._id}
                            variant={channelId === item._id ? "active" : "default"}
                        />
                    ))}
            </WorkspaceSection>
            <WorkspaceSection
                label="Direct Messages"
                hint="New Dm"
                onNew={() => { }}   
            >
                {members?.map((item) => (
                    <UserItem
                        key={item._id}
                        id={item._id}
                        label={item.user.name}
                        image={item.user.image}
                        variant={item._id === memberId ? "active" : "default"}
                    />
                ))}
            </WorkspaceSection>
        </div>
    )
};