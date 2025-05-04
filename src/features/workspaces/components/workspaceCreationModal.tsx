import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useWorkspaceModal } from "../store/useWorkspaceModal"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useWorkspaceCreator } from "../api/useWorkspaceCreator";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const WorkspaceCreationModal = () => {
    const router = useRouter();
    const [open, setOpen] = useWorkspaceModal();
    const [name, setName] = useState("");

    const { mutate, isPending } = useWorkspaceCreator();

    const handleClose = () => {
        setOpen(false);
        setName("");
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        mutate({ name }, {
            onSuccess(id) {
                toast.success("Workspace created");
                router.push(`/workspace/${id}`);
                handleClose();
            },
        })
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create a new Workspace</DialogTitle>
                    <DialogDescription>
                        Please provide the necessary details to create a new workspace.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={isPending}
                        required
                        autoFocus
                        minLength={3}
                        placeholder="e.g. 'Work', 'Class', 'Personal'"
                    />
                    <div className="flex justify-end">
                        <Button disabled={isPending}>
                            Create
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};