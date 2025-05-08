import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export const activeUser = () => {
    const data = useQuery(api.users.current);
    const isLoading = data === undefined;

    return { data, isLoading };
};