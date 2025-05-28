/* eslint-disable @next/next/no-img-element */
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface UploadImageProps {
    url: string | null | undefined;
};

export const UploadImage = ({ url }: UploadImageProps) => { 
    if (!url) return null;

    return (
        <Dialog>
            <DialogTrigger>
                <div className="relative overflow-hidden max-w-[360px] border rounded-lg my-2 cursor-zoom-in">
                    <img
                        src={url}
                        alt="Message image"
                        className="rounded-md object-cover size-full"
                    />
                </div>
            </DialogTrigger>
            <DialogContent className="max-w-[800px] border-none bg-transparent p-0 shadow-none">
                {/* Hidden title for accessibility*/}
                <DialogHeader>
                    <DialogTitle>
                        <VisuallyHidden>Expanded message image</VisuallyHidden>
                    </DialogTitle>
                </DialogHeader>
                <img
                    src={url}
                    alt="Message image"
                    className="rounded-md object-cover size-full"
                />
            </DialogContent>
        </Dialog>
    );
};