import { parentMessage } from "@/features/messages/store/parentMessage";
import { profileMember } from "@/features/members/store/profileMember";

export const Panel = () => {
    const [parentMessageId, setParentMessageId] = parentMessage();
    const [profileMemberId, setProfileMemberId] = profileMember();

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