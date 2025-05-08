import { activeMember } from "@/features/members/api/activeMember";
import { workspaceById } from "@/features/workspaces/api/workspaceById";
import { workspaceIdParam } from "@/hooks/workspaceIdParam";
import { Hash, Loader, MessageSquareText, Send, TriangleAlert } from "lucide-react";
import { WorkspaceHeader } from "./WorkspaceHeader";
import { SidebarItem } from "./SidebarItem";
import { channelList } from "@/features/channels/api/channelList";
import { WorkspaceSection } from "./WorkspaceSection";
import { memberList } from "@/features/members/api/memberList";
import { UserItem } from "./userItem";
import { channelModal } from "@/features/channels/store/channelModal";

export const WorkspaceSidebar = () => {
    const workspaceId = workspaceIdParam();

    const [_open, setOpen] = channelModal();

    const { data: member, isLoading: memberLoading } = activeMember({ workspaceId });
    const { data: workspace, isLoading: workspaceLoading } = workspaceById({ id: workspaceId });
    const { data: channels, isLoading: channelsLoading } = channelList({ workspaceId });
    const { data: members, isLoading: membersLoading } = memberList({ workspaceId });

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
                    />
                ))}
            </WorkspaceSection>
        </div>
    )
};