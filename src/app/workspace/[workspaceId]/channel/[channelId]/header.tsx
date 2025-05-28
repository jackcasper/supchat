import { Button } from "@/components/ui/button";
import { CircleChevronDown, Trash2 } from "lucide-react";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useChannelRemover } from "@/features/channels/api/channelRemover";
import { useChannelUpdater } from "@/features/channels/api/channelUpdater";
import { useActiveMember } from "@/features/members/api/activeMember";
import { usechannelIdParam } from "@/hooks/channelIdParam";
import { useConfirmation } from "@/hooks/confirmation";
import { useWorkspaceIdParam } from "@/hooks/workspaceIdParam";

interface HeaderProps {
    channelName: string;
};

export const Header = ({ channelName }: HeaderProps) => {
    const router = useRouter();
    const channelId = usechannelIdParam();
    const workspaceId = useWorkspaceIdParam();
    const [ConfirmDialog, confirm] = useConfirmation(
        "Delete this channel?",
        "You are about to delete this channel. This action cannot be undone",
    );

    const [value, setValue] = useState(channelName);
    const [editOpen, setEditOpen] = useState(false);

    const { data: member } = useActiveMember({ workspaceId });
    const { mutate: updateChannel, isPending: updatingChannel } = useChannelUpdater();
    const { mutate: removeChannel, isPending: removingChannel } = useChannelRemover();

    const handleEditOpen = (value: boolean) => {
        if (member?.role !== "admin") return;

        setEditOpen(value);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\s+/g, "-").toLowerCase();
        setValue(value);
    };

    const handleDelete = async () => {
        const ok = await confirm();

        if (!ok) return;

        removeChannel({ id: channelId }, {
            onSuccess: () => {
                toast.success("Channel removed");
                router.push(`/workspace/${workspaceId}`)
            },
            onError: () => {
                toast.error("Failed to remove channel");
            }
        });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        updateChannel({ id: channelId, name: value }, {
            onSuccess: () => {
                toast.success("Channel updated");
                setEditOpen(false);
            },
            onError: () => {
                toast.error("Failed to update channel")
            }
        });
    };

    return (
        <div className="bg-white border-b h-[49px] flex items-center px-4 overflow-hidden">
            <ConfirmDialog />
            <Dialog>
                <DialogTrigger asChild>
                    <Button
                        variant="ghost"
                        className="text-lg font-semibold px-2 overflow-hidden w-auto"
                        size="sm"
                    >
                        <span className="truncate"># {channelName}</span>
                        <CircleChevronDown className="size-4 ml-2" />
                    </Button>
                </DialogTrigger>
                <DialogContent className="p-0 bg-gray-50 overflow-hidden">
                    <DialogHeader className="p-4 border-b bg-white">
                        <DialogTitle>
                            # {channelName}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="px-4 pb-4 flex flex-col gap-y-2">
                        <Dialog open={editOpen} onOpenChange={handleEditOpen}>
                            <DialogTrigger asChild>
                                <div className="px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-semibold">
                                            Channel name
                                        </p>
                                        {member?.role === "admin" && (
                                            <p className="text-sm text-[#1264a3] hover:underline font-semibold">
                                                Edit
                                            </p>
                                        )}
                                    </div>
                                    <p className="text-sm">
                                        # {channelName}
                                    </p>
                                </div>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>
                                        Change the name of channel
                                    </DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <Input
                                        value={value}
                                        disabled={updatingChannel}
                                        onChange={handleChange}
                                        required
                                        autoFocus
                                        minLength={3}
                                        maxLength={80}
                                        placeholder="e.g. 5-webd"
                                    />
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button variant="outline" disabled={updatingChannel}>
                                                Cancel
                                            </Button>
                                        </DialogClose>
                                        <Button disabled={updatingChannel}>
                                            Save
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                        {member?.role === "admin" && (
                            <button
                                onClick={handleDelete}
                                disabled={removingChannel}
                                className="flex items-center gap-x-2 py-4 px-5 bg-white rounded-lg cursor-point border hover:bg-gray-50 text-rose-600"
                            >
                                <Trash2 className="size-4" />
                                <p className="text-sm font-semibold">
                                    Delete channel
                                </p>
                            </button>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};