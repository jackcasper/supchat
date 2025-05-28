import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface UseWorkspaceInfoProps {
    id: Id<"workspaces">;
};

export const useWorkspaceInfo = ({ id }: UseWorkspaceInfoProps) => {
    const data = useQuery(api.workspaces.getInfoById, { id });
    const isLoading = data === undefined;

    return { data, isLoading };
};