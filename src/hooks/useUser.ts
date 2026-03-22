"use client";

import { useSession, signOut } from "next-auth/react";

export function useUser() {
  const { data: session, status, update } = useSession();

  return {
    user: session?.user ?? null,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
    signOut: () => signOut({ callbackUrl: "/" }),
    update,
  };
}