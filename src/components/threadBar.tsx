import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { ChevronRightCircle } from "lucide-react";

interface ThreadBarProps {
    name?: string;
    image?: string;
    timestamp?: number;
    count?: number;
    onClick?: () => void;
};

export const ThreadBar = ({
    name = "Member",
    image,
    timestamp,
    count,
    onClick,
}: ThreadBarProps) => {
    const avatarFallBack = name.charAt(0).toUpperCase();

    if (!timestamp || !count) return null;

    return (
        <button
            onClick={onClick}
            className="p-1 rounded-md hover:bg-white border border-transparent hover:border-border flex items-center justify-start group/thread-bar transition max-w-[600px]"
        >
            <div className="flex items-center gap-2 overflow-hidden">
                <Avatar className="size-6 shrink-0">        
                    <AvatarImage
                        className="aspect-square size-full object-cover"
                        src={image} />        
                    <AvatarFallback>
                        {avatarFallBack}
                    </AvatarFallback>
                </Avatar>
                <span className="text-xs text-sky-700 hover:underline font-bold truncate">
                    {count} {count > 1 ? "replies" : "reply"}
                </span>
                <span className="text-xs text-muted-foreground truncate group-hover/thread-bar:hidden block">
                    Last reply {formatDistanceToNow(timestamp, { addSuffix: true })}
                </span>
                <span className="text-xs text-muted-foreground truncate group-hover/thread-bar:block hidden">
                    View thread
                </span>
            </div>
            <ChevronRightCircle className="size-4 text-muted-foreground ml-auto opacity-0 group-hover/thread-bar:opacity-100 transition shrink-0" />
        </button>
    )
  };