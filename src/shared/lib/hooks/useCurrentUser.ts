"use client";

import { authClient } from "@/app/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const useCurrentUser = () => {
  const { data: session, isPending } = authClient.useSession();

  return {
    user: session?.user ?? null,
    isLoading: isPending,
    isAuthenticated: !!session?.user,
    role: session?.user?.role ?? null,
  };
};

export const useRequireAuth = (redirectUrl = "/auth/sign-in") => {
  const { user, isLoading } = useCurrentUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push(redirectUrl);
    }
  }, [user, isLoading, router, redirectUrl]);

  return { user, isLoading };
};

export const useRequireRole = (allowedRoles: string[], redirectUrl = "/") => {
  const { user, isLoading } = useCurrentUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user && !allowedRoles.includes(user.role)) {
      router.push(redirectUrl);
    }
  }, [user, isLoading, router, redirectUrl, allowedRoles]);

  return { user, isLoading };
};
