"use client";

import { channelById } from "@/features/channels/api/channelById";
import { channelIdParam } from "@/hooks/channelIdParam";
import { AlertTriangle, LoaderCircle } from "lucide-react";
import { Header } from "./header";
import { Chat } from "./chat";
import { messageList } from "@/features/messages/api/messageList";

const ChannelIdScreen = () => {
    const channelId = channelIdParam();

    const { results } = messageList({ channelId });
    const { data: channel, isLoading: channelLoading } = channelById({ id: channelId });

    console.log({ results });

    if (channelLoading) {
        return (
            <div className="h-full flex-1 flex items-center justify-center">
                <LoaderCircle className="animate-spin size-5 text-muted-foreground" />
            </div>
        );
    }

    if (!channel) {
        return (
            <div className="h-full flex-1 flex flex-col gap-y-2 items-center justify-center">
                <AlertTriangle className="size-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                    Channel not found
                </span>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            <Header channelName={channel.name} />
            <div className="flex-1">
                {JSON.stringify(results)}
            </div>
            <Chat placeholder={`Message # ${channel.name}`} />
        </div>
    );
};

export default ChannelIdScreen