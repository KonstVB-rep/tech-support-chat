"use client";

import { useEffect } from "react";
import { authClient } from "@/app/lib/auth-client";
import { useMyProfile } from "@/entities/profile/api/useMyProfile";
import { connectSocket } from "@/shared/lib/socket";

export const SocketInitializer = () => {
  const { data: session } = authClient.useSession();
  const { data: profile } = useMyProfile();

  useEffect(() => {
    if (!session?.user?.id || !profile?.id) return;

    connectSocket(session.user.id, profile.id);
  }, [session?.user?.id, profile?.id]);

  return null;
};
