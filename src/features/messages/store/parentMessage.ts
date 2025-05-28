import { useQueryState } from "nuqs";

export const useParentMessage = () => {
    return useQueryState("parentMessageId");
};