import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface UseWorkspaceByIdProps {
    id: Id<"workspaces">;
};

export const useWorkspaceById = ({ id }: UseWorkspaceByIdProps) => {
    const data = useQuery(api.workspaces.getById, { id });
    const isLoading = data === undefined;

    return { data, isLoading };
};