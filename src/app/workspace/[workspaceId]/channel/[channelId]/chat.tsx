import { messageCreator } from "@/features/messages/api/messageCreator";
import { generateUpload } from "@/features/upload/api/generateUpload";
import { channelIdParam } from "@/hooks/channelIdParam";
import { workspaceIdParam } from "@/hooks/workspaceIdParam";
import dynamic from "next/dynamic";
import Quill from "quill";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Id } from "../../../../../../convex/_generated/dataModel";

const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

interface ChatProps {
    placeholder: string;
};

type CreateMessageValues = {
    workspaceId: Id<"workspaces">;
    channelId: Id<"channels">;
    image: Id<"_storage"> | undefined;
    body: string;
};

export const Chat = ({ placeholder }: ChatProps) => {
    const [editorKey, setEditorKey] = useState(0);
    const [pending, setPending] = useState(false);

    const editorRef = useRef<Quill | null>(null);

    const { mutate: generateUploadUrl } = generateUpload();
    const { mutate: createMessage } = messageCreator();
    const workspaceId = workspaceIdParam();
    const channelId = channelIdParam();

    const handleSubmit = async ({
        body,
        image
    }: {
        body: string;
        image: File | null;
    }) => {
        try {
            setPending(true);
            editorRef?.current?.enable(false);

            const values: CreateMessageValues = {
                workspaceId,
                channelId,
                image: undefined,
                body,
            };

            if (image) {
                const url = await generateUploadUrl({}, { throwError: true });

                if (!url) {
                    throw new Error("URL not found");
                }

                const result = await fetch(url, {
                    method: "POST",
                    headers: { "Content-Type": image.type },
                    body: image,
                });

                if (!result.ok) {
                    throw new Error("Failed to upload the image");
                }

                const { storageId } = await result.json();

                values.image = storageId;
            }

            await createMessage(values, { throwError: true });

            setEditorKey((prevKey) => prevKey + 1);
        } catch (error) {
            toast.error("Failed to send the message");
        } finally {
            setPending(false);
            editorRef?.current?.enable(true);
        }
    };

    return (
        <div className="px-5 w-full">
            <Editor
                placeholder={placeholder}
                onSubmit={handleSubmit}
                disabled={false}
                innerRef={editorRef}
                key={editorKey}
            />
        </div>
    );
};