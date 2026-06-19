"use client";

import { inferAdditionalFields } from "better-auth/client/plugins";
import { twoFactorClient } from "better-auth/plugins";
import { createAuthClient } from "better-auth/react";
import type { auth } from "./auth";
export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL: process.env.BETTER_AUTH_URL,
  plugins: [inferAdditionalFields<typeof auth>(), twoFactorClient()],
});

export const { signIn, signUp, useSession, signOut, resetPassword } =
  createAuthClient();
