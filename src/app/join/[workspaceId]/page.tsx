"use client";

import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import VerificationInput from "react-verification-input";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useMemo, useEffect } from "react";
import { useWorkspaceInfo } from "@/features/workspaces/api/workspaceInfo";
import { useWorkspaceJoin } from "@/features/workspaces/api/workspaceJoin";
import { useWorkspaceIdParam } from "@/hooks/workspaceIdParam";

const JoinScreen = () => {
    const router = useRouter();
    const workspaceId = useWorkspaceIdParam();

    const { data, isLoading } = useWorkspaceInfo({ id: workspaceId });
    const { mutate, isPending } = useWorkspaceJoin();

    const isMember = useMemo(() => data?.isMember, [data?.isMember]);

    useEffect(() => {
        if (isMember) {
            router.push(`/workspace/${workspaceId}`);
        }
    }, [isMember, router, workspaceId]);

    const handleComplete = (value: string) => {
        mutate({ workspaceId, joinCode: value }, {
            onSuccess: (id) => {
                router.replace(`/workspace/${id}`)
                toast.success("Workspace joined successfully");
            },
            onError: () => {
                toast.error("Failed to join the workspace")
            }
        })
    };

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center">
                <LoaderCircle className="size-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return ( 
        <div className="h-full flex flex-col gap-y-8 items-center justify-center bg-white p-8 rounded-lg shadow-md">
            <Image src="/logo.svg" width={60} height={60} alt="Logo" />
            <div className="flex flex-col gap-y-4 items-center justify-center max-w-md">
                <div className="flex flex-col gap-y-2 items-center justify-center">
                    <h1 className="text-2xl font-bold">
                        Join {data?.name}
                    </h1>
                    <p className="text-md text-muted-foreground">
                        Enter the workspace code to join
                    </p>
                </div>
                <VerificationInput
                    onComplete={handleComplete}
                    length={6}
                    classNames={{
                        container: cn("flex gap-x-2", isPending && "opacity-50 cursor-not-allowed"),
                        character: "uppercase h-auto rounded-md border border-gray-300 flex items-center justify-center text-lg font-medium text-gray-500",
                        characterInactive: "bg-muted",
                        characterSelected: "bg-white text-black",
                        characterFilled: "bg-white text-black"
                    }}
                    autoFocus
                />
            </div>
            <div className="flex gap-x-4">
                <Button
                    size="lg"
                    variant="outline"
                    asChild
                >
                    <Link href="/">
                        Home
                    </Link>
                </Button>
            </div>
        </div>
     );
}
 
export default JoinScreen;