"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

import { Sidebar } from "./sidebar";
import { Toolbar } from "./toolbar";
import { WorkspaceSidebar } from "./WorkspaceSidebar";

interface WorkspaceShellProps {
    children: React.ReactNode
};

const WorkspaceShell = ({ children }: WorkspaceShellProps) => {
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
                    <ResizablePanel minSize={20}>
                        {children}
                    </ResizablePanel>
                </ResizablePanelGroup>
            </div>
        </div>
    );
};
 
export default WorkspaceShell;