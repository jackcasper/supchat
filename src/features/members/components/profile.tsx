import { Button } from "@/components/ui/button";
import { Id } from "../../../../convex/_generated/dataModel";
import { memberById } from "../api/memberById";
import { AtSign, ChevronDownCircle, LoaderCircle, TriangleAlert, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { memberUpdater } from "../api/memberUpdater";
import { memberRemover } from "../api/memberRemover";
import { activeMember } from "../api/activeMember";
import { workspaceIdParam } from "@/hooks/workspaceIdParam";
import { toast } from "sonner";
import { confirmation } from "@/hooks/confirmation";
import { useRouter } from "next/navigation";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProfileProps {
    memberId: Id<"members">;
    onClose: () => void;
};

export const Profile = ({ memberId, onClose }: ProfileProps) => {
    const router = useRouter();
    const workspaceId = workspaceIdParam();

    const [LeaveDialog, confirmLeave] = confirmation(
        "Leave workspace",
        "Are you sure you want to leave this workspace?",
    );

    const [RemoveDialog, confirmRemove] = confirmation(
        "Remove member",
        "Are you sure you want to remove this member?",
    );

    const [UpdateDialog, confirmUpdate] = confirmation(
        "Change role",
        "Are you sure you want to change this member's role?",
    );

    const { data: member, isLoading: memberLoading } = memberById({ id: memberId });
    const { data: currentMember, isLoading: currentMemberLoading } = activeMember({
        workspaceId
    });

    const { mutate: updateMember, isPending: updatingMember } = memberUpdater();
    const { mutate: removeMember, isPending: removingMember } = memberRemover();

    const onRemove = async () => {
        const ok = await confirmRemove();

        if (!ok) return;

        removeMember({ id: memberId }, {
            onSuccess: () => {
                toast.success("Member removed successfully");
                onClose();
            },
            onError: () => {
                toast.error("Failed to remove member");
            }
        })
    };

    const onLeave = async () => {
        const ok = await confirmLeave();

        if (!ok) return;

        removeMember({ id: memberId }, {
            onSuccess: () => {
                router.replace("/");
                toast.success("You left the workspace");
                onClose();
            },
            onError: () => {
                toast.error("Failed to leave the workspace");
            }
        })
    };

    const onUpdate = async (role: "admin" | "member") => {
        const ok = await confirmUpdate();

        if (!ok) return;

        updateMember({ id: memberId, role }, {
            onSuccess: () => {
                toast.success("Role changed successfully");
                onClose();
            },
            onError: () => {
                toast.error("Failed to change the role");
            }
        });
    };

    if (memberLoading || currentMemberLoading) {
        return (
            <div className="h-full flex flex-col">
                <div className="flex justify-between items-center px-4 border-b h-[49px]">
                    <p className="text-lg font-bold">
                        Profile
                    </p>
                    <Button
                        onClick={onClose}
                        size="iconSm"
                        variant="ghost"
                    >
                        <X className="size-5 stroke-[1.5]" />
                    </Button>
                </div>
                <div className="flex flex-col gap-y-2 h-full items-center justify-center">
                    <LoaderCircle className="animate-spin size-5 text-muted-foreground" />
                </div>
            </div>
        );
    }

    if (!member) {
        return (
            <div className="h-full flex flex-col">
                <div className="flex justify-between items-center px-4 border-b h-[49px]">
                    <p className="text-lg font-bold">
                        Profile
                    </p>
                    <Button
                        onClick={onClose}
                        size="iconSm"
                        variant="ghost"
                    >
                        <X className="size-5 stroke-[1.5]" />
                    </Button>
                </div>
                <div className="flex flex-col gap-y-2 h-full items-center justify-center">
                    <TriangleAlert className="size-5 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                        Profile not found
                    </p>
                </div>
            </div>
        );
    }

    const avatarFallback = member.user.name?.[0] ?? "M";

    return (
        <>
            <UpdateDialog />
            <RemoveDialog />
            <LeaveDialog />
            <div className="h-full flex flex-col">
                <div className="flex justify-between items-center px-4 border-b h-[49px]">
                    <p className="text-lg font-bold">
                        Profile
                    </p>
                    <Button
                        onClick={onClose}
                        size="iconSm"
                        variant="ghost"
                    >
                        <X className="size-5 stroke-[1.5]" />
                    </Button>
                </div>
                <div className="flex flex-col items-center justify-center">
                    <Avatar className="max-w-[256px] max-h-[256px] size-full">
                        <AvatarImage src={member.user.image} />
                        <AvatarFallback className="aspect-square text-6xl">
                            {avatarFallback}
                        </AvatarFallback>
                    </Avatar>
                </div>
                <div className="flex flex-col p-4">
                    <p className="text-xl font-bold">
                        {member.user.name}
                    </p>
                    {currentMember?.role === "admin" &&
                        currentMember._id !== memberId ? (
                            <div className="flex items-center gap-2 mt-4">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" className="w-full capitalize">
                                            {member.role} <ChevronDownCircle className="size-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-full">
                                        <DropdownMenuRadioGroup
                                            value={member.role}
                                            onValueChange={(role) => onUpdate(role as "admin" | "member")}
                                        >
                                            <DropdownMenuRadioItem value="admin">
                                                Admin
                                            </DropdownMenuRadioItem>
                                            <DropdownMenuRadioItem value="member">
                                                Member
                                            </DropdownMenuRadioItem>
                                        </DropdownMenuRadioGroup>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <Button onClick={onRemove} variant="outline" className="w-full">
                                    Remove
                                </Button>
                            </div>
                    ) : currentMember?._id === memberId &&
                            currentMember?.role !== "admin" ? (
                                <div className="mt-4">
                                    <Button onClick={onLeave} variant="outline" className="w-full">
                                        Leave
                                    </Button>
                                </div>
                        ) : null
                    }
                </div>
                <Separator />
                <div className="flex flex-col p-4">
                    <p className="text-sm font-bold mb-4">Contact Info</p>
                    <div className="flex items-center gap-2">
                        <div className="size-9 rounded-md bg-muted flex items-center justify-center">
                            <AtSign className="size-4" />
                        </div>
                        <div className="flex flex-col">
                            <p className="text-[13px] font-semibold text-muted-foreground">Email Address</p>
                        </div>
                        <Link
                            href={`mailto:${member.user.email}`}
                            className="text-sm hover:underline text-[#1264a3]"
                        >
                            {member.user.email}
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};