"use client";

import { UserButton } from "@/features/auth/components/UserButton";
import { useWorkspaceModal } from "@/features/workspaces/store/useWorkspaceModal";
import { useWorkspaceList } from "@/features/workspaces/api/useWorkspaceList";
import { useEffect, useMemo } from "react";

export default function Home() {
  const [open, setOpen] = useWorkspaceModal();

  const { data, isLoading } = useWorkspaceList();

  const workspaceId = useMemo(() => data?.[0]?._id, [data]);

  useEffect(() => {
    if (isLoading) return;

    if (workspaceId) {
      console.log("Redirect to workspace")
    } else if (!open) {
      setOpen(true);
    }
  }, [workspaceId, isLoading, open, setOpen]);
  return (
    <div>
      <UserButton />
    </div>
  );
};
