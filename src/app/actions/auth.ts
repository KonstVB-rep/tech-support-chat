"use server"

import { APIError } from "better-auth"
import { updateTag } from "next/cache"
import { isRedirectError } from "next/dist/client/components/redirect-error"
import { headers } from "next/headers"
import type z from "zod"
import {
  passwordSchema,
  validationSchemaResetPassword,
  validationSchemaResetPasswordConfirm,
} from "@/app/(auth)/auth/model/schema"
import { prisma } from "@/prisma/prisma-client"
import { getSession } from "@/shared/lib/server-current-user"
import { triggerSocketEvent } from "@/shared/lib/socket-trigger"
import { auth } from "../lib/auth"

type ActionState =
  | {
      success: true
      error?: never
    }
  | {
      success?: never
      error: string | null
    }
  | undefined

export async function signInActionsignInAction() {
  await auth.api.signOut({
    headers: await headers(),
  })
}

export async function resetPasswordAction(_: unknown, formData: FormData): Promise<ActionState> {
  const data = Object.fromEntries(formData)

  const validated = validationSchemaResetPassword.safeParse(data)

  if (!validated.success) {
    const errorMessage = validated.error.issues
      .map((issue: z.core.$ZodIssue) => issue.message)
      .join(", ")

    return {
      error: errorMessage || "Ошибка валидации данных",
    }
  }

  const { email } = validated.data
  try {
    await auth.api.requestPasswordReset({
      body: {
        email,
        redirectTo: "/auth/reset-password",
      },
    })
    return { success: true }
  } catch (error) {
    if (isRedirectError(error)) {
      throw error
    }

    let errorMessage: string | null = null

    if (error instanceof APIError) {
      errorMessage =
        typeof error.body === "string"
          ? error.body
          : (error.body?.message ?? "Ошибка при смене пароля")
    } else if (error instanceof Error) {
      errorMessage = error.message
    } else {
      errorMessage = "Произошла непредвиденная ошибка. Попробуйте ещё раз."
    }

    return {
      error: errorMessage,
    }
  }
}

export async function resetPasswordConfirmAction(
  _: unknown,
  formData: FormData,
): Promise<ActionState> {
  const token = formData.get("token") as string
  const password = formData.get("password") as string
  const confirmPassword = formData.get("confirmPassword") as string

  const validated = validationSchemaResetPasswordConfirm.safeParse({
    token,
    password,
    confirmPassword,
  })

  if (!validated.success) {
    const errorMessage = validated.error.issues
      .map((issue: z.core.$ZodIssue) => issue.message)
      .join(", ")
    console.log(errorMessage, "errorMessage")
    return {
      error: errorMessage || "Ошибка валидации данных",
    }
  }
  try {
    await auth.api.resetPassword({
      body: {
        newPassword: password, // required
        token, // required
      },
    })

    return {
      success: true,
    }
  } catch (error: unknown) {
    if (isRedirectError(error)) {
      throw error
    }

    console.log("resetPasswordConfirmAction", error)

    let errorMessage: string | null = null

    if (error instanceof APIError) {
      errorMessage =
        typeof error.body === "string"
          ? error.body
          : (error.body?.message ?? "Ошибка при смене пароля")
    } else if (error instanceof Error) {
      errorMessage = error.message
    } else {
      errorMessage = "Произошла непредвиденная ошибка. Попробуйте ещё раз."
    }

    return {
      error: errorMessage,
    }
  }
}

export const changeEmail = async (email: string, profileId: string): Promise<{ email: string }> => {
  const requestHeaders = await headers()

  await auth.api.changeEmail({
    body: { newEmail: email },
    headers: requestHeaders,
  })

  updateTag(`profile-${profileId}`)

  const [isStaffMember, membership] = await Promise.all([
    prisma.staffMember.findUnique({ where: { profileId } }),
    prisma.organizationMember.findFirst({
      where: { profileId },
      select: { organizationId: true },
    }),
  ])

  if (isStaffMember) updateTag("staff-members")
  if (membership) updateTag(`employees-${membership.organizationId}`)

  const session = await getSession()
  if (session?.user) {
    await triggerSocketEvent("srv:user:updated", {
      userId: session.user.id,
      profileId,
      organizationId: membership?.organizationId ?? null,
      email,
      isStaffMember: !!isStaffMember,
    })
  }
  return { email }
}
export const changePassword = async (_prevState: unknown, formData: FormData) => {
  const requestHeaders = await headers() // ← Добавить

  const data = Object.fromEntries(formData)
  const validated = passwordSchema.safeParse(data)

  if (!validated.success) {
    const errorMessage = validated.error.issues
      .map((issue: z.core.$ZodIssue) => issue.message)
      .join(", ")
    return { error: errorMessage || "Ошибка валидации данных" }
  }

  const { newPassword, currentPassword } = validated.data

  try {
    await auth.api.changePassword({
      body: {
        newPassword,
        currentPassword,
        revokeOtherSessions: true,
      },
      headers: requestHeaders, // ← Критично!
    })

    return { success: true, error: null }
  } catch (error) {
    if (error instanceof APIError) {
      return { success: false, error: error.message }
    }
    return { success: false, error: "Произошла системная ошибка" }
  }
}
// export const deleteAccount = async (
//   password: string,
// ): Promise<{ success: true }> => {
//   const requestHeaders = await headers();

//   await auth.api.deleteUser({
//     body: { password },
//     headers: requestHeaders,
//   });

//   return { success: true };
// };

export const sendVerificationEmail = async (_prevState: unknown, formData: FormData) => {
  const email = formData.get("email") as string
  try {
    await auth.api.sendVerificationEmail({
      body: { email },
    })
    return {
      success: true,
      error: null,
    }
  } catch (error) {
    if (error instanceof APIError) {
      return { success: false, error: error.message }
    }

    return { success: false, error: "Произошла системная ошибка" }
  }
}
