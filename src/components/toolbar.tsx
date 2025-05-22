import { MessageCirclePlus, Pen, SmilePlus, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { FloatNote } from "./FloatNote";
import { EmojiInsert } from "./emojiInsert";

interface ToolbarProps {
    isPending: boolean;
    isAuthor: boolean;
    handleThread: () => void;
    handleDelete: () => void;
    handleEdit: () => void;
    handleReaction: (value: string) => void;
    hideThreadButton?: boolean;
};

export const Toolbar = ({
    isPending,
    isAuthor,
    handleThread,
    handleDelete,
    handleEdit,
    handleReaction,
    hideThreadButton,
}: ToolbarProps) => { 
    return (
        <div className="absolute top-0 right-5">
            <div className="group-hover:opacity-100 opacity-0 transition-opacity border bg-white rounded-md shadow-sm">
                <EmojiInsert
                    hint="Add reaction"
                    onEmojiSelect={(emoji) => handleReaction(emoji.native)}
                >
                    <Button
                        variant="ghost"
                        size="iconSm"
                        disabled={isPending}
                    >
                        <SmilePlus className="size-4" />
                    </Button>
                </EmojiInsert>
                {!hideThreadButton && (
                    <FloatNote label="Add a thread">
                        <Button
                            variant="ghost"
                            size="iconSm"
                            disabled={isPending}
                            onClick={handleThread}
                        >
                            <MessageCirclePlus className="size-4" />
                        </Button>
                    </FloatNote>
                )}
                {isAuthor && (
                    <FloatNote label="Edit message">
                        <Button
                            variant="ghost"
                            size="iconSm"
                            disabled={isPending}
                            onClick={handleEdit}
                        >
                            <Pen className="size-4" />
                        </Button>
                    </FloatNote>
                )}
                {isAuthor && (
                    <FloatNote label="Delete message">
                        <Button
                            variant="ghost"
                            size="iconSm"
                            disabled={isPending}
                            onClick={handleDelete}
                        >
                            <Trash2 className="size-4" />
                        </Button>
                    </FloatNote>
                )}
            </div>
        </div>
    )
};