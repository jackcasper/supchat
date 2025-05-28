import { useParams } from "next/navigation";
import { Id } from "../../convex/_generated/dataModel";

export const usechannelIdParam = () => {
    const params = useParams();

    return params.channelId as Id<"channels">;
};