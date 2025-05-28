import { useProfileMember } from "@/features/members/store/profileMember";
import { useParentMessage } from "@/features/messages/store/parentMessage";

export const Panel = () => {
    const [parentMessageId, setParentMessageId] = useParentMessage();
    const [profileMemberId, setProfileMemberId] = useProfileMember();

    const onOpenMessage = (messageId: string) => {
        setParentMessageId(messageId);
        setProfileMemberId(null);
    };

    const onOpenProfile = (memberId: string) => {
        setProfileMemberId(memberId);
        setParentMessageId(null);
    };

    const onClose = () => {
        setParentMessageId(null);
        setProfileMemberId(null);
    };

    return {
        parentMessageId,
        onClose,
        onOpenMessage,
        profileMemberId,
        onOpenProfile,
    };
};