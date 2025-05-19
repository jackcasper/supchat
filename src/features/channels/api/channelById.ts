import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface ChannelByIdProps {
    id: Id<"channels">;
};

export const channelById = ({ id }: ChannelByIdProps) => {
    const data = useQuery(api.channels.getById, { id });
    const isLoading = data === undefined;

    return { data, isLoading };  
};