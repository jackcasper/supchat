import { useQuery } from "convex/react"
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

interface UseActiveMemberProps {
    workspaceId: Id<"workspaces">;
}

export const useActiveMember = ({ workspaceId }: UseActiveMemberProps) => {
    const data = useQuery(api.members.getActive, { workspaceId });
    const isLoading = data === undefined;

    return { data, isLoading };
};