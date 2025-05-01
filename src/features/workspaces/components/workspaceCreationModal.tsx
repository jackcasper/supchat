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

export const WorkspaceCreationModal = () => {
    const [open, setOpen] = useWorkspaceModal();

    const handleClose = () => {
        setOpen(false);
        // TODO: clear form
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create a new Workspace</DialogTitle>
                    <DialogDescription>
                        Please provide the necessary details to create a new workspace.
                    </DialogDescription>
                </DialogHeader>
                <form className="space-y-4">
                    <Input
                        value=""
                        disabled={false}
                        required
                        autoFocus
                        minLength={3}
                        placeholder="e.g. 'Work', 'Class', 'Personal'"
                    />
                    <div className="flex justify-end">
                        <Button disabled={false}>
                            Create
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};