import { useQueryState } from "nuqs";

export const useProfileMember = () => {
    return useQueryState("profileMemberId");
};