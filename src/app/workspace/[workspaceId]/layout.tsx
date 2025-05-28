"use client";

import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";

import { Sidebar } from "./sidebar";
import { Toolbar } from "./toolbar";
import { WorkspaceSidebar } from "./WorkspaceSidebar";
import { Panel } from "@/hooks/panel";
import { LoaderCircle } from "lucide-react";
import { Id } from "../../../../convex/_generated/dataModel";
import { Thread } from "@/features/messages/components/thread";
import { Profile } from "@/features/members/components/profile";

interface WorkspaceShellProps {
    children: React.ReactNode
};

const WorkspaceShell = ({ children }: WorkspaceShellProps) => {
    const { profileMemberId, parentMessageId, onClose } = Panel();

    const showPanel = !!parentMessageId || !!profileMemberId;
    return (
        <div className="h-full">
            <Toolbar />
            <div className="flex h-[calc(100vh-40px)]">
                <Sidebar />
                <ResizablePanelGroup
                    direction={"horizontal"}
                    autoSaveId={"channel-workspace-layout"}
                >
                    <ResizablePanel
                        defaultSize={20}
                        minSize={11}
                        className="bg-[#E0E7FF]"
                    >
                        <WorkspaceSidebar />
                        <div>
                            Channels sidebar
                        </div>
                    </ResizablePanel>
                    <ResizableHandle withHandle />
                    <ResizablePanel minSize={20} defaultSize={80}>
                        {children}
                    </ResizablePanel>
                    {showPanel && (
                        <>
                            <ResizableHandle withHandle />
                            <ResizablePanel minSize={20} defaultSize={29}>
                                {parentMessageId ? (
                                    <Thread
                                        messageId={parentMessageId as Id<"messages">}
                                        onClose={onClose}
                                    />
                                ) : profileMemberId ? (
                                        <Profile
                                            memberId={profileMemberId as Id<"members">}
                                            onClose={onClose}
                                        />
                                    ) : (

                                        <div className="flex h-full items-center justify-center">
                                            <LoaderCircle className="size-5 animate-spin text-muted-foreground" />
                                        </div>
                                    )
                                }
                            </ResizablePanel>
                        </>
                    )}
                </ResizablePanelGroup>
            </div>
        </div>
    );
};
 
export default WorkspaceShell;