import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { workspaceNewJoinCode } from "@/features/workspaces/api/workspaceNewJoinCode";
import { confirmation } from "@/hooks/confirmation";
import { workspaceIdParam } from "@/hooks/workspaceIdParam";
import { Link, RotateCw } from "lucide-react";
import { toast } from "sonner";

interface InviteModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    name: string;
    joinCode: string;
};


export const InviteModal = ({
    open,
    setOpen,
    name,
    joinCode,
}: InviteModalProps) => {
    const workspaceId = workspaceIdParam();
    const [ConfirmDialog, confirm] = confirmation(
        "Are you sure?",
        "This action will replace your existing invite code with a new one.",
    );

    const { mutate, isPending } = workspaceNewJoinCode();

    const handleNewCode = async () => {
        const ok = await confirm();

        if (!ok) return;

        mutate({ workspaceId }, {
            onSuccess: () => {
                toast.success("Invite code updated");
            },
            onError: () => {
                toast.error("Failed to update invite code");
            }
        });
    };

    const handleCopy = () => {
        const inviteLink = `${window.location.origin}/join/${workspaceId}`;

        navigator.clipboard
            .writeText(inviteLink)
            .then(() => toast.success("Invite link copied to clipboard"));
    };

    return (
        <>
            <ConfirmDialog />
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Invite people to {name}</DialogTitle>
                        <DialogDescription>
                            Use the code below to invite people in your workspace
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-y-4 items-center justify-center py-10">
                        <p className="text-4xl font-bold tracking-widest uppercase">
                            {joinCode}
                        </p>
                        <Button
                            onClick={handleCopy}
                            variant="ghost"
                            size="sm"
                        >
                            Copy invite link
                            <Link className="size-4 ml-2" />
                        </Button>
                    </div>
                    <div className="flex items-center justify-between w-full">
                        <Button disabled={isPending} onClick={handleNewCode} variant="outline">
                            New Code
                            <RotateCw className="size-4 ml-2" />
                        </Button>
                        <DialogClose asChild>
                            <Button>
                                Close
                            </Button>
                        </DialogClose>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};