import { workspaceIdParam } from "@/hooks/workspaceIdParam";
import { Doc, Id } from "../../convex/_generated/dataModel";
import { activeMember } from "@/features/members/api/activeMember";
import { cn } from "@/lib/utils";
import { FloatNote } from "./FloatNote";
import { EmojiInsert } from "./emojiInsert";
import { SmilePlus } from "lucide-react";

interface ReactionsProps {
    data: Array<
        Omit<Doc<"reactions">, "memberId"> & {
            count: number;
            memberIds: Id<"members">[]
        }
    >;
    onChange: (value: string) => void;
};

export const Reactions = ({
    data,
    onChange,
}: ReactionsProps) => {
    const workspaceId = workspaceIdParam();
    const { data: currentMember } = activeMember({ workspaceId });

    const currentMemberId = currentMember?._id;

    if (data.length === 0 || !currentMemberId) {
        return null;
    }
    return (
        <div className="flex items-center gap-1 mt-1 mb-1">
            {data.map((reaction) => (
                <FloatNote
                    key={reaction._id}
                    label={`${reaction.count} ${reaction.count === 1 ? "person" : "people"} reacted with ${reaction.value}`}
                >
                    <button
                        onClick={() => onChange(reaction.value)}
                        className={cn(
                        "h-6 px-2 rounded-full bg-slate-200 border border-transparent text-slate-800 flex items-center gap-x-1",
                        reaction.memberIds.includes(currentMemberId) &&
                        "bg-blue-100/70 border-blue-500 text-white"
                    )}>
                        {reaction.value}
                        <span className={cn(
                            "text-xs font-semibold text-muted-foreground",
                            reaction.memberIds.includes(currentMemberId) && "text-[#0000b3]"
                        )}>
                            {reaction.count}
                        </span>
                    </button>
                </FloatNote>
            ))}
            <EmojiInsert
                hint="Add reaction"
                onEmojiSelect={(emoji) => onChange(emoji)}
            >
                <button className="h-7 px-3 rounded-full bg-slate-200/70 border border-transparent hover:border-slate-500 text-slate-800 flex items-center gap-x-1">
                    <SmilePlus className="size-4" />
                </button>
            </EmojiInsert>
        </div>
    );
  };