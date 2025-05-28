import { Id } from "../../../../../../convex/_generated/dataModel";
import { LoaderCircle } from "lucide-react";
import { Header } from "./header";
import { Chat } from "./chat";
import { MessageFile } from "@/components/messageFile";
import { Panel } from "@/hooks/panel";
import { useMemberById } from "@/features/members/api/memberById";
import { useMessageList } from "@/features/messages/api/messageList";
import { useMemberIdParam } from "@/hooks/memberIdParam";

interface ConversationProps {
    id: Id<"conversations">;
};

export const Conversation = ({ id }: ConversationProps) => { 
    const memberId = useMemberIdParam();

    const { onOpenProfile } = Panel();

    const { data: member, isLoading: memberLoading } = useMemberById({ id: memberId });
    const { status, loadMore, results } = useMessageList({
        conversationId: id,
    });

    if (memberLoading || status === "LoadingFirstPage") {
        return (
            <div className="h-full flex items-center justify-center">
                <LoaderCircle className="animate-spin size-6 text-muted-foreground" />
            </div>
        )
    }

    return (
        <div className="flex flex-col h-full">
            <Header
                memberImage={member?.user.image}
                memberName={member?.user.name}
                onClick={() => onOpenProfile(memberId)}
            />
            <Chat
                conversationId={id}
                placeholder={`Message ${member?.user.name}`}
            />
            <MessageFile
                data={results}
                variant="conversation"
                memberName={member?.user.name}
                memberImage={member?.user.image}
                loadMore={loadMore}
                canLoadMore={status === "CanLoadMore"}
                isLoadingMore={status === "LoadingMore"}
            />
        </div>
    );
};