import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useWorkspaceRemover } from "@/features/workspaces/api/workspaceRemover";
import { useWorkspaceUpdater } from "@/features/workspaces/api/workspaceUpdater";
import { useConfirmation } from "@/hooks/confirmation";
import { useWorkspaceIdParam } from "@/hooks/workspaceIdParam";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface PreferencesProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    initialValue: string;
};

export const Preferences = ({
    open,
    setOpen,
    initialValue,
}: PreferencesProps) => {
    const workspaceId = useWorkspaceIdParam();
    const router = useRouter();
    const [ConfirmDialog, confirm] = useConfirmation(
        "Are you sure?",
        "This action is irreversible."
    );

    const [value, setValue] = useState(initialValue);
    const [editOpen, setEditOpen] = useState(false);

    const { mutate: workspaceUpdate, isPending: isWorkspaceUpdating } = useWorkspaceUpdater();
    const { mutate: workspaceRemove, isPending: isWorkspaceRemoving } = useWorkspaceRemover();

    const handleRemove = async () => {
        const ok = await confirm();

        if (!ok) return;

        workspaceRemove(
            {
                id: workspaceId,
                name: value,
            },
            {
            onSuccess: () => {
                toast.success("Workspace removed");
                router.replace("/");
            },
            onError: () => {
                toast.error("Failed to remove workspace");
            }
        })
    }

    const handleEdit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        workspaceUpdate({
            id: workspaceId,
            name: value,
        }, {
            onSuccess: () => {
                toast.success("Workspace updated");
                setEditOpen(false)
            },
            onError: () => {
                toast.error("Failed to update workspace");
            }
        })
    }

    return (
        <>
            <ConfirmDialog />
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="p-0 bg-gray-50 overflow-hidden">
                    <DialogHeader className="p-4 border-b bg-white">
                        <DialogTitle>
                            {value}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="px-4 pb-4 flex flex-col gap-y-2">
                        <Dialog open={editOpen} onOpenChange={setEditOpen}>
                            <DialogTrigger asChild>
                                <div className="px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-semibold">
                                            Workspace name
                                        </p>
                                        <p className="text-sm text-[#1264a3] hover:underline font-semibold">
                                            Edit
                                        </p>
                                    </div>
                                    <p className="text-sm">
                                        {value}
                                    </p>
                                </div>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Rename this workspace</DialogTitle>
                                </DialogHeader>
                                <form className="space-y-4" onSubmit={handleEdit}>
                                    <Input
                                        value={value}
                                        disabled={isWorkspaceUpdating}
                                        onChange={(e) => setValue(e.target.value)}
                                        required
                                        autoFocus
                                        minLength={3}
                                        maxLength={80}
                                        placeholder="Workspace name e.g. 'Work', 'Class', 'Personal'"
                                    />
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button variant="outline" disabled={isWorkspaceUpdating}>
                                                Cancel
                                            </Button>
                                        </DialogClose>
                                        <Button disabled={isWorkspaceUpdating}>
                                            Save
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                        <button
                            disabled={isWorkspaceRemoving}
                            onClick={handleRemove}
                            className="flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50 text-rose-600"
                        >
                            <Trash2 className="size-4" />
                            <p className="text-sm font-semibold">Delete workspace</p>
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};