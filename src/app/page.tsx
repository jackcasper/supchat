"use client";

import { UserButton } from "@/features/auth/components/UserButton";
import { workspaceModal } from "@/features/workspaces/store/workspaceModal";
import { workspaceList } from "@/features/workspaces/api/workspaceList";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [open, setOpen] = workspaceModal();

  const { data, isLoading } = workspaceList();

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
