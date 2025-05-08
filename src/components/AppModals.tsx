"use client";

import { WorkspaceCreationModal } from "@/features/workspaces/components/workspaceCreationModal";
import { useEffect, useState } from "react";
import { ChannelCreationModal } from "@/features/channels/components/channelCreationModal";

export const AppModals = () => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <>
            <ChannelCreationModal />
            <WorkspaceCreationModal />
        </>
    );
};