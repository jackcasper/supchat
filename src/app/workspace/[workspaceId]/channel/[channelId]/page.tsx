"use client";

import { AlertTriangle, LoaderCircle } from "lucide-react";
import { Header } from "./header";
import { Chat } from "./chat";
import { MessageFile } from "@/components/messageFile";
import { useChannelById } from "@/features/channels/api/channelById";
import { useMessageList } from "@/features/messages/api/messageList";
import { useChannelIdParam } from "@/hooks/channelIdParam";

const ChannelIdScreen = () => {
    const channelId = useChannelIdParam();

    const { results, status, loadMore } = useMessageList({ channelId });
    const { data: channel, isLoading: channelLoading } = useChannelById({ id: channelId });

    if (channelLoading || status === "LoadingFirstPage") {
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
            <MessageFile
                channelName={channel.name}
                channelCreationTime={channel._creationTime}
                data={results}
                loadMore={loadMore}
                isLoadingMore={status === "LoadingMore"}
                canLoadMore={status === "CanLoadMore"}
            />
            <Chat placeholder={`Message # ${channel.name}`} />
        </div>
    );
};

export default ChannelIdScreen