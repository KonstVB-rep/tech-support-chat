"use client"

import { adminClient, inferAdditionalFields } from "better-auth/client/plugins"
import { twoFactorClient } from "better-auth/plugins"
import { createAuthClient } from "better-auth/react"
import type { auth } from "./auth"
export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL,
  plugins: [inferAdditionalFields<typeof auth>(), twoFactorClient(), adminClient()],
})

// export const { signIn, signUp, useSession, signOut, resetPassword } =
//   createAuthClient();
