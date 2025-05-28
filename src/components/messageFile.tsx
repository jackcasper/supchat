import { MessageReturnType } from "@/features/messages/api/messageList";
import { differenceInMinutes, format, isToday, isYesterday, parse } from "date-fns";
import { Message } from "./message";
import { ChannelDetail } from "./channelDetail";
import { useState } from "react";
import { Id } from "../../convex/_generated/dataModel";
import { workspaceIdParam } from "@/hooks/workspaceIdParam";
import { activeMember } from "@/features/members/api/activeMember";
import { LoaderCircle } from "lucide-react";
import { ConversationDetail } from "./conversationDetail";

const TIME_THRESHOLD = 5;

interface MessageFileProps {
    channelName?: string;
    channelCreationTime?: number;
    memberImage?: string;
    memberName?: string;
    variant?: "channel" | "thread" | "conversation";
    data: MessageReturnType | undefined;
    loadMore: () => void;
    canLoadMore: boolean;
    isLoadingMore: boolean;
};

const formatDateLabel = (dateStr: string) => {
    const date = parse(dateStr, "dd-MM-yyyy", new Date());
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "EEEE, MMMM d");
};

export const MessageFile = ({
    channelName,
    channelCreationTime,
    memberImage,
    memberName,
    variant = "channel",
    data,
    loadMore,
    canLoadMore,
    isLoadingMore,
}: MessageFileProps) => {
    const [editingId, setEditingId] = useState<Id<"messages"> | null>(null);

    const workspaceId = workspaceIdParam();

    const { data: currentMember } = activeMember({ workspaceId });

    const groupMessages = data?.reduce(
        (groups, message) => {
            const date = new Date(message._creationTime);
            const dateKey = format(date, "dd-MM-yyyy");
            if (!groups[dateKey]) {
                groups[dateKey] = [];
            }
            groups[dateKey].unshift(message);
            return groups;
        },
        {} as Record<string, typeof data>
    );
    
    return (
        <div className="flex-1 flex flex-col-reverse pb-4 overflow-auto messages-scrollbar">
            {Object.entries(groupMessages || {}).map(([dateKey, messages]) => (
                <div key={dateKey}>
                    <div className="text-center my-2 relative">
                        <hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300" />
                        <span className="relative inline-block bg-white px-4 py-1 rounded-full text-xs border border-gray-300 shadow-sm">
                            {formatDateLabel(dateKey)}
                        </span>
                    </div>
                    {messages.map((message, index) => {
                        const prevMessage = messages[index - 1];
                        const isCompact =
                            prevMessage &&
                            prevMessage.user?._id === message.user._id &&
                            differenceInMinutes(
                                new Date(message._creationTime),
                                new Date(prevMessage._creationTime)
                            ) < TIME_THRESHOLD;
                        
                        return (
                            <Message
                                key={message._id}
                                id={message._id}
                                memberId={message.memberId}
                                authorName={message.user.name}
                                authorImage={message.user.image}
                                isAuthor={message.memberId === currentMember?._id}
                                body={message.body}
                                image={message.image}
                                reactions={message.reactions}
                                createdAt={message._creationTime}
                                updatedAt={message.updatedAt}
                                isEditing={editingId === message._id}
                                setEditingId={setEditingId}
                                isCompact={isCompact}
                                hideThreadButton={variant === "thread"}
                                threadCount={message.threadCount}
                                threadTimestamp={message.threadTimestamp}
                                threadName={message.threadName}
                                threadImage={message.threadImage}
                            />
                        )
                    })}
                </div>
            ))}
            <div
                className="h-1"
                ref={(el) => {
                    if (el) {
                        const observer = new IntersectionObserver(
                            ([entry]) => {
                                if (entry.isIntersecting && canLoadMore) {
                                    loadMore();
                                }
                            },
                            { threshold: 1.0 }
                        );

                        observer.observe(el)
                        return () => observer.disconnect();
                    }
                }}
            />
            {isLoadingMore && (
                <div className="text-center my-2 relative">
                        <hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300" />
                        <span className="relative inline-block bg-white px-4 py-1 rounded-full text-xs border border-gray-300 shadow-sm">
                            <LoaderCircle className="size-4 animate-spin" />
                        </span>
                </div>
            )}
            {variant === "channel" && channelName && channelCreationTime && (
                <ChannelDetail
                    name={channelName}
                    creationTime={channelCreationTime}
                />
            )}
            {variant === "conversation" && (
                <ConversationDetail
                    name={memberName}
                    image={memberImage}
                />
            )}
        </div>
    );
};