"use client";

import { Button } from "@/components/ui/button";
import { useAuthActions } from "@convex-dev/auth/react";
//import { AuthPage } from "@/features/auth/components/AuthPage";

export default function Home() {
  const { signOut } = useAuthActions();
  return (
    //<AuthPage />
    <div>
      Logged in!
      <Button onClick={() => signOut()}>
        Sign out
      </Button>
    </div>
  );
};
