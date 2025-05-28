import { useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface UseMemberListProps {
    workspaceId: Id<"workspaces">;
}

export const useMemberList = ({ workspaceId }: UseMemberListProps) => {
    const data = useQuery(api.members.get, { workspaceId });
    const isLoading = data === undefined;

    return { data, isLoading };
};