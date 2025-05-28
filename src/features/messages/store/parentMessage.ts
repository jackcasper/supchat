import { useQueryState } from "nuqs";

export const parentMessage = () => {
    return useQueryState("parentMessageId");
};