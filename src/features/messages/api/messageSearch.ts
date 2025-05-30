import { useQuery } from "convex/react";
import { Id } from "../../../../convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";

type MessageSearchResult = {
    _id: Id<"messages">;
    body: string;
    channelId: Id<"channels">;
};

export const useMessageSearch = (
    workspaceId: Id<"workspaces">,
    search: string
): MessageSearchResult[] | undefined => {
    const result = useQuery(api.messages.search, { workspaceId, search });

    return result as MessageSearchResult[] | undefined;
};