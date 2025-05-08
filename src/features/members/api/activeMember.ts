import { useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface ActiveMemberProps {
    workspaceId: Id<"workspaces">;
}

export const activeMember = ({ workspaceId }: ActiveMemberProps) => {
    const data = useQuery(api.members.getActive, { workspaceId });
    const isLoading = data === undefined;

    return { data, isLoading };
};