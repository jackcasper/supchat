import { Button } from "@/components/ui/button";
import { useWorkspaceIdParam } from "@/hooks/workspaceIdParam";
import { Info, Search } from "lucide-react";
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useChannelList } from "@/features/channels/api/channelList";
import { useMemberList } from "@/features/members/api/memberList";
import { useWorkspaceById } from "@/features/workspaces/api/workspaceById";
import { useMessageSearch } from "@/features/messages/api/messageSearch";

type QuillInsertOp = {
    insert: string | object;
};

type QuillDelta = {
    ops: QuillInsertOp[];
};

const extractPlainText = (body: string | QuillDelta): string => {
    try {
        const delta =
            typeof body === "string" ? (JSON.parse(body) as QuillDelta) : body;
        
        if (!delta?.ops) return "";

        return delta.ops
            .map((op: QuillInsertOp) => (typeof op.insert === "string" ? op.insert : ""))
            .join("")
            .trim();
    } catch {
        return "";
    }
};

export const Toolbar = () => {
    const workspaceId = useWorkspaceIdParam();
    const router = useRouter();

    const { data } = useWorkspaceById({ id: workspaceId });
    const { data: channels } = useChannelList({ workspaceId });
    const { data: members } = useMemberList({ workspaceId });

    const [open, setOpen] = useState(false);
    const [query] = useState("");

    const searchedMessages = useMessageSearch(workspaceId, query);

    const onChannelClick = (channelId: string) => {
        setOpen(false);

        router.push(`/workspace/${workspaceId}/channel/${channelId}`);
    };
    
    const onMemberClick = (memberId: string) => {
        setOpen(false);

        router.push(`/workspace/${workspaceId}/member/${memberId}`);
    };

    const onMessageClick = (channelId: string, messageId: string) => {
        setOpen(false);
        router.push(`/workspace/${workspaceId}/channel/${channelId}#${messageId}`);
    };

    return (
        <nav className="bg-[#3D2683] flex items-center justify-between h-10 p-1.5">
            <div className="flex-1" />
            <div className="min-w-[280px] max-[642px] grow-[2] shrink">
                <Button onClick={() => setOpen(true)} size="sm" className="bg-accent/25 hover:bg-accent-25 w-full justify-start h-7 px-2">
                    <Search className="size-4 text-white mr-2" />
                    <span className="text-white text-xs">
                        Search {data?.name}
                    </span>
                </Button>
                <CommandDialog open={open} onOpenChange={setOpen}>
                    <CommandInput placeholder="Type a command or search..." />
                    <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>

                        <CommandGroup heading="Channels">
                            {channels?.map((channel) => (
                                <CommandItem key={channel._id} onSelect={() => onChannelClick(channel._id)}>
                                    {channel.name}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                        <CommandSeparator />

                        <CommandGroup heading="Members">
                            {members?.map((member) => (
                                <CommandItem key={member._id} onSelect={() => onMemberClick(member._id)}>
                                    {member.user.name}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                        <CommandSeparator />

                        <CommandGroup heading="Messages">
                            {searchedMessages?.map((message) => {
                                const text = extractPlainText(message.body);
                                return (
                                    <CommandItem
                                        key={message._id}
                                        onSelect={() =>
                                            onMessageClick(message.channelId, message._id)
                                        }
                                    >
                                        {text ? text.slice(0, 50) : "[No readable text]"}
                                    </CommandItem>
                                );
                            })}
                        </CommandGroup>
                    </CommandList>
                </CommandDialog>
            </div>
            <div className="mt-auto flex-1 flex items-center justify-end">
                <Button variant="transparent" size="iconSm">
                    <Info className="size-5 text-white" />
                </Button>
            </div>
        </nav>
    );
};