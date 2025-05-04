"use client";

import { UserButton } from "@/features/auth/components/UserButton";
import { useWorkspaceModal } from "@/features/workspaces/store/useWorkspaceModal";
import { useWorkspaceList } from "@/features/workspaces/api/useWorkspaceList";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

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
    <div>
      <UserButton />
    </div>
  );
};
