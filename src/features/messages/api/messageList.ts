import { usePaginatedQuery } from "convex/react";
import { Id } from "../../../../convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";

const BATCH_SIZE = 20;

interface MessageListProps {
    channelId?: Id<"channels">;
    parentMessageId?: Id<"messages">;
    conversationId?: Id<"conversations">;
};

export type MessageReturnType = typeof api.messages.get._returnType["page"];

export const messageList = ({
    channelId,
    parentMessageId,
    conversationId,
}: MessageListProps) => {
    const { results, status, loadMore } = usePaginatedQuery(
        api.messages.get,
        { channelId, parentMessageId, conversationId },
        { initialNumItems: BATCH_SIZE },
    );

    return {
        results,
        status,
        loadMore: () => loadMore(BATCH_SIZE)
    }
};