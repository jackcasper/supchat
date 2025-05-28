import { useQueryState } from "nuqs";

export const profileMember = () => {
    return useQueryState("profileMemberId");
};