"use client";

import { conversationCreator } from "@/features/conversations/api/conversationCreator";
import { memberIdParam } from "@/hooks/memberIdParam";
import { workspaceIdParam } from "@/hooks/workspaceIdParam";
import { LoaderCircle, TriangleAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { toast } from "sonner";
import { Conversation } from "./conversation";

const MemberIdPage = () => {
    const workspaceId = workspaceIdParam();
    const memberId = memberIdParam();

    const [conversationId, setConversationId] = useState<Id<"conversations"> | null>(null);

    const { mutate, isPending } = conversationCreator();

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