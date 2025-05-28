"use client";

import { LoaderCircle, TriangleAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { toast } from "sonner";
import { Conversation } from "./conversation";
import { useConversationCreator } from "@/features/conversations/api/conversationCreator";
import { useMemberIdParam } from "@/hooks/memberIdParam";
import { useWorkspaceIdParam } from "@/hooks/workspaceIdParam";

const MemberIdPage = () => {
    const workspaceId = useWorkspaceIdParam();
    const memberId = useMemberIdParam();

    const [conversationId, setConversationId] = useState<Id<"conversations"> | null>(null);

    const { mutate, isPending } = useConversationCreator();

    useEffect(() => {
        mutate({
            workspaceId,
            memberId,
        }, {
            onSuccess(data) {
                setConversationId(data);
            },
            onError() {
                toast.error("Failed to get or create conversation");
            },
        })
    }, [workspaceId, memberId, mutate]);

    if (isPending) {
        return (
            <div className="h-full flex items-center justify-center">
                <LoaderCircle className="size-6 animate-spin text-muted-foreground" />
            </div>
        )
    }

    if (!conversationId) {
        return (
            <div className="h-full flex flex-col gap-y-2 items-center justify-center">
                <TriangleAlert className="size-6 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                    Conversation not found
                </span>
            </div>
        );
    }

    return <Conversation id={conversationId} />
};
 
export default MemberIdPage;