import { format, isToday, isYesterday } from "date-fns";
import { Doc, Id } from "../../convex/_generated/dataModel";
import dynamic from "next/dynamic";
import { FloatNote } from "./FloatNote";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { UploadImage } from "./uploadImage";
import { Toolbar } from "./toolbar";
import { messageUpdater } from "@/features/messages/api/messageUpdater";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { messageRemover } from "@/features/messages/api/messageRemover";
import { confirmation } from "@/hooks/confirmation";
import { toggleReaction } from "@/features/reactions/api/toggleReaction";
import { Reactions } from "./reactions";
import { Panel } from "@/hooks/panel";
import { ThreadBar } from "./threadBar";

const Renderer = dynamic(() => import("@/components/renderer"), { ssr: false });
const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

interface MessageProps {
    id: Id<"messages">;
    memberId: Id<"members">;
    authorName?: string;
    authorImage?: string;
    isAuthor: boolean;
    reactions: Array<
        Omit<Doc<"reactions">, "memberId"> & {
            count: number;
            memberIds: Id<"members">[];
        }
    >;
    image: string | null | undefined;
    body: Doc<"messages">["body"];
    updatedAt: Doc<"messages">["updatedAt"];
    createdAt: Doc<"messages">["_creationTime"];
    isCompact?: boolean;
    isEditing: boolean;
    setEditingId: (id: Id<"messages"> | null) => void;
    threadName?: string;
    threadImage?: string;
    threadCount?: number;
    threadTimestamp?: number;
    hideThreadButton?: boolean;
};

const formatFullTime = (date: Date) => {
    return `${isToday(date) ? "Today" : isYesterday(date) ? "Yesterday" : format(date, "MMM d, yyyy")} at ${format(date, "h:mm:ss a")}`;
};

export const Message = ({
    id,
    memberId,
    isAuthor,
    authorName = "Member",
    authorImage,
    reactions,
    image,
    body,
    updatedAt,
    createdAt,
    isCompact,
    isEditing,
    setEditingId,
    threadName,
    threadImage,
    threadCount,
    threadTimestamp,
    hideThreadButton,
}: MessageProps) => {
    const { parentMessageId, onOpenMessage, onClose, onOpenProfile } = Panel();

    const [ConfirmDialogue, confirm] = confirmation(
        "Delete message",
        "Are you sure you want to delete this message? This action is irreversible."
    );

    const { mutate: updateMessage, isPending: updatingMessage } = messageUpdater();
    const { mutate: removeMessage, isPending: removingMessage } = messageRemover();
    const { mutate: isToggleReaction, isPending: isTogglingReaction } = toggleReaction();

    const isPending = updatingMessage || isTogglingReaction;

    const handleReaction = (value: string) => {
        isToggleReaction({ messageId: id, value }, {
            onError: () => {
                toast.error("Failed to toggle reaction");
            },
        });
    };

    const handleRemove = async () => {
        const ok = await confirm();

        if (!ok) return;

        removeMessage({ id }, {
            onSuccess: () => {
                toast.success("Message deleted");

                if (parentMessageId === id) {
                    onClose();
                }
            },
            onError: () => {
                toast.error("Failed to delete the message");
            },
        });
    };

    const handleUpdate = ({ body }: { body: string }) => {
        updateMessage({ id, body }, {
            onSuccess: () => {
                toast.success("Message updated");
                setEditingId(null);
            },
            onError: () => {
                toast.error("Failed to update the message");
            }
        });
    };

    if (isCompact) {
        return (
            <>
                <ConfirmDialogue />
                <div className={cn(
                    "flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative",
                    isEditing && "bg-[#f2c74433] hover:bg-[#f2c74433]",
                    removingMessage &&
                    "bg-rose-500/50 transform transition-all scale-y-0 origin-bottom duration-200"
                )}>
                    <div className="flex items-start gap-2">
                        <FloatNote label={formatFullTime(new Date(createdAt))}>
                            <button className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 w-[40px] leading-[22px] text-center hover:underline">
                                {format(new Date(createdAt), "hh:mm")}
                            </button>
                        </FloatNote>
                        {isEditing ? (
                            <div className="h-full w-full">
                                <Editor
                                    onSubmit={handleUpdate}
                                    disabled={isPending}
                                    defaultValue={JSON.parse(body)}
                                    onCancel={() => setEditingId(null)}
                                    variant="update"
                                />
                            </div>
                        ) : (
                                <div className="flex flex-col w-full">
                                    <Renderer value={body} />
                                    {updatedAt ? (
                                        <span className="text-xs text-muted-foreground">
                                            (edited)
                                        </span>
                                    ) : null}
                                    <Reactions data={reactions} onChange={handleReaction} />
                                    <ThreadBar
                                        count={threadCount}
                                        name={threadName}
                                        image={threadImage}
                                        timestamp={threadTimestamp}
                                        onClick={() => onOpenMessage(id)}
                                    />
                            </div>
                        )}
                    </div>
                    {!isEditing && (
                        <Toolbar
                            isAuthor={isAuthor}
                            isPending={false}
                            hideThreadButton={hideThreadButton}
                            handleThread={() => onOpenMessage(id)}
                            handleDelete={handleRemove}
                            handleReaction={handleReaction}
                            handleEdit={() => setEditingId(id)}
                        />
                    )}
                </div>
            </>
        );
    }

    const avatarFallBack = authorName.charAt(0).toUpperCase();

    return (
        <>
            <ConfirmDialogue />
            <div className={cn(
                "flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative",
                isEditing && "bg-[#f2c74433] hover:bg-[#f2c74433]",
                removingMessage &&
                "bg-rose-500/50 transform transition-all scale-y-0 origin-bottom duration-100"
            )}>
                <div className="flex items-start gap-2">
                    <button
                        onClick={() => onOpenProfile(memberId)}
                    >
                        <Avatar className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full">
                            <AvatarImage className="aspect-square size-full object-cover" src={authorImage} />
                            <AvatarFallback className="bg-muted flex size-full items-center justify-center rounded-full">
                                {avatarFallBack}
                            </AvatarFallback>
                        </Avatar>
                    </button>
                    {isEditing ? (
                        <div className="w-full h-full">
                            <Editor
                                onSubmit={handleUpdate}
                                disabled={isPending}
                                defaultValue={JSON.parse(body)}
                                onCancel={() => setEditingId(null)}
                                variant="update"
                            />
                        </div>
                    ) : (
                            <div className="flex flex-col w-full overflow-hidden">
                                <div className="text-sm">
                                    <button
                                        onClick={() => onOpenProfile(memberId)}
                                        className="font-bold text-primary hover:underline"
                                    >
                                        {authorName}
                                    </button>
                                    <span>&nbsp;&nbsp;</span>
                                    <FloatNote label={formatFullTime(new Date(createdAt))}>
                                        <button className="text-xs text-muted-foreground hover:underline">
                                            {format(new Date(createdAt), "h:mm a")}
                                        </button>
                                    </FloatNote>
                                </div><Renderer value={body} />
                                <UploadImage url={image} />
                                {updatedAt ? (
                                    <span className="text-xs text-muted-foreground">
                                        (edited)
                                    </span>
                                ) : null}
                                <Reactions data={reactions} onChange={handleReaction} />
                                <ThreadBar
                                    count={threadCount}
                                    name={threadName}
                                    image={threadImage}
                                    timestamp={threadTimestamp}    
                                    onClick={() => onOpenMessage(id)}
                                />
                            </div>
                    )}
                </div>
                {!isEditing && (
                    <Toolbar
                        isAuthor={isAuthor}
                        isPending={isPending}
                        hideThreadButton={hideThreadButton}
                        handleThread={() => onOpenMessage(id)}
                        handleDelete={handleRemove}
                        handleReaction={handleReaction}
                        handleEdit={() => setEditingId(id)}
                    />
                )}
            </div>
        </>
    );
};