import { Button } from "@/components/ui/button";
import { Id } from "../../../../convex/_generated/dataModel";
import { LoaderCircle, TriangleAlert, X } from "lucide-react";
import { Message } from "@/components/message";
import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import Quill from "quill";
import { toast } from "sonner";
import { differenceInMinutes, format, isToday, isYesterday, parse } from "date-fns";
import { useActiveMember } from "@/features/members/api/activeMember";
import { useMessageById } from "../api/messageById";
import { useMessageCreator } from "../api/messageCreator";
import { useMessageList } from "../api/messageList";
import { useGenerateUpload } from "@/features/upload/api/generateUpload";
import { useChannelIdParam } from "@/hooks/channelIdParam";
import { useWorkspaceIdParam } from "@/hooks/workspaceIdParam";

const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

const TIME_THRESHOLD = 5;

interface ThreadProps {
    messageId: Id<"messages">;
    onClose: () => void;
};

type CreateMessageValues = {
    parentMessageId: Id<"messages">;
    workspaceId: Id<"workspaces">;
    channelId: Id<"channels">;
    image: Id<"_storage"> | undefined;
    body: string;
};

const formatDateLabel = (dateStr: string) => {
    const date = parse(dateStr, "dd-MM-yyyy", new Date());
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "EEEE, MMMM d");
};

export const Thread = ({ messageId, onClose }: ThreadProps) => {
    const workspaceId = useWorkspaceIdParam();
    const channelId = useChannelIdParam();

    const [editingId, setEditingId] = useState<Id<"messages"> | null>(null);
    const [editorKey, setEditorKey] = useState(0);
    const [pending, setPending] = useState(false);

    const editorRef = useRef<Quill | null>(null);

    const { data: currentMember } = useActiveMember({ workspaceId });
    const { data: message, isLoading: messageLoading } = useMessageById({ id: messageId });
    const { results, loadMore, status } = useMessageList({
        channelId,
        parentMessageId: messageId,
    });

    const canLoadMore = status === "CanLoadMore";
    const isLoadingMore = status === "LoadingMore";

    const { mutate: generateUploadUrl } = useGenerateUpload();
    const { mutate: createMessage } = useMessageCreator();

    const handleSubmit = async ({
        body,
        image
    }: {
        body: string;
        image: File | null;
    }) => {
        try {
            setPending(true);
            editorRef?.current?.enable(false);

            const values: CreateMessageValues = {
                parentMessageId: messageId,
                workspaceId,
                channelId,
                image: undefined,
                body,
            };

            if (image) {
                const url = await generateUploadUrl({ throwError: true });

                if (!url) {
                    throw new Error("URL not found");
                }

                const result = await fetch(url, {
                    method: "POST",
                    headers: { "Content-Type": image.type },
                    body: image,
                });

                if (!result.ok) {
                    throw new Error("Failed to upload the image");
                }

                const { storageId } = await result.json();

                values.image = storageId;
            }

            await createMessage(values, { throwError: true });

            setEditorKey((prevKey) => prevKey + 1);
        } catch {
            toast.error("Failed to send the message");
        } finally {
            setPending(false);
            editorRef?.current?.enable(true);
        }
    };

    const groupMessages = results?.reduce(
        (groups, message) => {
            const date = new Date(message._creationTime);
            const dateKey = format(date, "dd-MM-yyyy");
            if (!groups[dateKey]) {
                groups[dateKey] = [];
            }
            groups[dateKey].unshift(message);
            return groups;
        },
        {} as Record<string, typeof results>
    );

    if (messageLoading || status === "LoadingFirstPage") {
        return (
            <div className="h-full flex flex-col">
                <div className="flex justify-between items-center px-4 border-b h-[49px]">
                    <p className="text-lg font-bold">
                        Thread
                    </p>
                    <Button
                        onClick={onClose}
                        size="iconSm"
                        variant="ghost"
                    >
                        <X className="size-5 stroke-[1.5]" />
                    </Button>
                </div>
                <div className="flex flex-col gap-y-2 h-full items-center justify-center">
                    <LoaderCircle className="animate-spin size-5 text-muted-foreground" />
                </div>
            </div>
        );
    }

    if (!message) {
        return (
            <div className="h-full flex flex-col">
                <div className="flex justify-between items-center px-4 border-b h-[49px]">
                    <p className="text-lg font-bold">
                        Thread
                    </p>
                    <Button
                        onClick={onClose}
                        size="iconSm"
                        variant="ghost"
                    >
                        <X className="size-5 stroke-[1.5]" />
                    </Button>
                </div>
                <div className="flex flex-col gap-y-2 h-full items-center justify-center">
                    <TriangleAlert className="size-5 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                        Message not found
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-center px-4 border-b h-[49px]">
                <p className="text-lg font-bold">
                    Thread
                </p>
                <Button
                    onClick={onClose}
                    size="iconSm"
                    variant="ghost"
                >
                    <X className="size-5 stroke-[1.5]" />
                </Button>
            </div>
            <div>
                <div className="flex-1 flex flex-col-reverse pb-4 overflow-y-auto messages-scrollbar">
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
                                        hideThreadButton
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
                    <Message
                        hideThreadButton
                        memberId={message.memberId}
                        isAuthor={message.memberId === currentMember?._id}
                        authorName={message.user.name}
                        authorImage={message.user.image}
                        image={message.image}
                        body={message.body}
                        updatedAt={message.updatedAt}
                        createdAt={message._creationTime}
                        id={message._id}
                        reactions={message.reactions}
                        isEditing={editingId === message._id}
                        setEditingId={setEditingId}
                    />
                </div>
            </div>
            <div className="px-4">
                <Editor
                    key={editorKey}
                    innerRef={editorRef}
                    onSubmit={handleSubmit}
                    disabled={pending}
                    placeholder="Reply..."
                />
            </div>
        </div>
    );
 };