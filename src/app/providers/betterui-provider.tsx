"use client";
import type { ReactNode } from "react";
import { AuthUIWrapper } from "./auth-ui-wrapper";

export function BetterUiProviders({ children }: { children: ReactNode }) {
  return <AuthUIWrapper>{children}</AuthUIWrapper>;
}