"use client";

import { UserButton } from "@/features/auth/components/UserButton";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useWorkspaceList } from "@/features/workspaces/api/workspaceList";
import { useWorkspaceModal } from "@/features/workspaces/store/workspaceModal";
import { Loader2 } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [open, setOpen] = useWorkspaceModal();

  const { data, isLoading } = useWorkspaceList();

  const workspaceId = useMemo(() => data?.[0]?._id, [data]);

  useEffect(() => {
    if (isLoading) return;

    if (workspaceId) {
      router.replace(`/workspace/${workspaceId}`)
    } else if (!open) {
      setOpen(true);
    }
  }, [workspaceId, isLoading, open, setOpen, router]);
  return (
    <div className="h-full flex items-center justify-center">
      <Loader2 className="size-6 animate-spin text-muted-foreground" />
    </div>
  );
};
