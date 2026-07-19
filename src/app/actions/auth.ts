"use server";

import { APIError } from "better-auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type z from "zod";
import { prisma } from "@/prisma/prisma-client";

import { auth } from "../lib/auth";
import { updateTag } from "next/cache";
import { getSession } from "@/shared/lib/server-current-user";
import { triggerSocketEvent } from "@/shared/lib/socket-trigger";
import {
  passwordSchema,
  validationSchemaResetPassword,
  validationSchemaResetPasswordConfirm,
  validationSchemaSignIn,
  validationSchemaSignUp,
} from "@/app/(auth)/auth/model/schema";

type ActionState =
  | {
      success: true;
      error?: never;
    }
  | {
      success?: never;
      error: string | null;
    }
  | undefined;

export async function signUpAction(_: unknown, formData: FormData) {
  const data = Object.fromEntries(formData);

  const validated = validationSchemaSignUp.safeParse(data);

  if (!validated.success) {
    // const errorMessage = validated.error.issues
    //   .map((issue: z.core.$ZodIssue) => issue.message)
    //   .join(", ")

    return {
      error: "Не верный email или пароль",
    };
  }

  const { name, email, password } = validated.data;

  try {
    await auth.api.signUpEmail({
      body: { email, password, name },
    });
  } catch (error: unknown) {
    if (isRedirectError(error)) {
      throw error;
    }

    let errorMessage: string | null = null;

    if (error instanceof APIError) {
      errorMessage =
        typeof error.body === "string"
          ? error.body
          : (error.body?.message ?? "Ошибка при смене пароля");
    } else if (error instanceof Error) {
      errorMessage = error.message;
    } else {
      errorMessage = "Произошла непредвиденная ошибка. Попробуйте ещё раз.";
    }

    return {
      error: errorMessage,
    };
  }
  redirect("/auth/email-verify");
}

export async function signInAction(_: unknown, formData: FormData) {
  const data = Object.fromEntries(formData);

  const validated = validationSchemaSignIn.safeParse(data);

  if (!validated.success) {
    // const errorMessage = validated.error.issues
    //   .map((issue: z.core.$ZodIssue) => issue.message)
    //   .join(", ")

    return {
      error: "Не верный email или пароль",
    };
  }

  const { email, password } = validated.data;
  try {
    await auth.api.signInEmail({
      body: { email, password, rememberMe: false },
    });
  } catch (error: unknown) {
    if (isRedirectError(error)) {
      throw error;
    }

    // Строгая обработка ошибки — только string | null
    let errorMessage: string | null = null;

    if (error instanceof APIError) {
      errorMessage =
        typeof error.body === "string"
          ? error.body
          : (error.body?.message ?? "Ошибка при смене пароля");
    } else if (error instanceof Error) {
      errorMessage = "Не верный email или пароль";
    } else {
      errorMessage = "Произошла непредвиденная ошибка. Попробуйте ещё раз.";
    }
    console.log(errorMessage, "errorMessage");
    return {
      error: errorMessage,
    };
  }

  redirect("/");
}

export async function signInActionWith2FA(_: unknown, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  let isTwoFactorRequired = false;

  try {
    const res = await auth.api.signInEmail({
      body: {
        email,
        password,
      },
      headers: await headers(), // Критично для установки кук
    });

    // Better Auth на сервере возвращает twoFactorRedirect в объекте ответа
    // if (res.user.twoFactorEnabled) {
    //   isTwoFactorRequired = true;
    // }
  } catch (error: unknown) {
    // Обязательно пропускаем ошибку редиректа, иначе Next.js её заблокирует
    if (isRedirectError(error)) throw error;

    return {
      error: "Неверный email или пароль",
    };
  }

  if (isTwoFactorRequired) {
    redirect("/auth/two-factor");
  }

  redirect("/");
}

export async function signOutAction() {
  await auth.api.signOut({
    headers: await headers(),
  });
}

export async function resetPasswordAction(
  _: unknown,
  formData: FormData,
): Promise<ActionState> {
  const data = Object.fromEntries(formData);

  const validated = validationSchemaResetPassword.safeParse(data);

  if (!validated.success) {
    const errorMessage = validated.error.issues
      .map((issue: z.core.$ZodIssue) => issue.message)
      .join(", ");

    return {
      error: errorMessage || "Ошибка валидации данных",
    };
  }

  const { email } = validated.data;
  try {
    await auth.api.requestPasswordReset({
      body: {
        email,
        redirectTo: "/auth/reset-password",
      },
    });
    return { success: true };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    let errorMessage: string | null = null;

    if (error instanceof APIError) {
      errorMessage =
        typeof error.body === "string"
          ? error.body
          : (error.body?.message ?? "Ошибка при смене пароля");
    } else if (error instanceof Error) {
      errorMessage = error.message;
    } else {
      errorMessage = "Произошла непредвиденная ошибка. Попробуйте ещё раз.";
    }

    return {
      error: errorMessage,
    };
  }
}

export async function resetPasswordConfirmAction(
  _: unknown,
  formData: FormData,
): Promise<ActionState> {
  const token = formData.get("token") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  const validated = validationSchemaResetPasswordConfirm.safeParse({
    token,
    password,
    confirmPassword,
  });

  if (!validated.success) {
    const errorMessage = validated.error.issues
      .map((issue: z.core.$ZodIssue) => issue.message)
      .join(", ");
    console.log(errorMessage, "errorMessage");
    return {
      error: errorMessage || "Ошибка валидации данных",
    };
  }
  try {
    await auth.api.resetPassword({
      body: {
        newPassword: password, // required
        token, // required
      },
    });

    return {
      success: true,
    };
  } catch (error: unknown) {
    if (isRedirectError(error)) {
      throw error;
    }

    console.log(error);

    // Строгая обработка ошибки — только string | null
    let errorMessage: string | null = null;

    if (error instanceof APIError) {
      errorMessage =
        typeof error.body === "string"
          ? error.body
          : (error.body?.message ?? "Ошибка при смене пароля");
    } else if (error instanceof Error) {
      errorMessage = error.message;
    } else {
      errorMessage = "Произошла непредвиденная ошибка. Попробуйте ещё раз.";
    }

    return {
      error: errorMessage,
    };
  }
}

export const updateUserName = async (name: string) => {
  await auth.api.updateUser({
    body: {
      name,
    },
  });
};

export const changeEmail = async (
  email: string,
  profileId: string,
): Promise<{ email: string }> => {
  const requestHeaders = await headers();

  await auth.api.changeEmail({
    body: { newEmail: email },
    headers: requestHeaders,
  });

  updateTag(`profile-${profileId}`);

  const [isEngineer, membership] = await Promise.all([
    prisma.supportEngineer.findUnique({ where: { profileId } }),
    prisma.organizationMember.findFirst({
      where: { profileId },
      select: { organizationId: true },
    }),
  ]);

  if (isEngineer) updateTag("support-engineers");
  if (membership) updateTag(`employees-${membership.organizationId}`);

  const session = await getSession();
  if (session?.user) {
    await triggerSocketEvent("srv:user:updated", {
      userId: session.user.id,
      profileId,
      organizationId: membership?.organizationId ?? null,
      email,
      isEngineer: !!isEngineer,
    });
  }
  return { email };
};
export const changePassword = async (
  _prevState: unknown,
  formData: FormData,
) => {
  const requestHeaders = await headers(); // ← Добавить

  const data = Object.fromEntries(formData);
  const validated = passwordSchema.safeParse(data);

  if (!validated.success) {
    const errorMessage = validated.error.issues
      .map((issue: z.core.$ZodIssue) => issue.message)
      .join(", ");
    return { error: errorMessage || "Ошибка валидации данных" };
  }

  const { newPassword, currentPassword } = validated.data;

  try {
    await auth.api.changePassword({
      body: {
        newPassword,
        currentPassword,
        revokeOtherSessions: true,
      },
      headers: requestHeaders, // ← Критично!
    });

    return { success: true, error: null };
  } catch (error) {
    if (error instanceof APIError) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Произошла системная ошибка" };
  }
};
export const deleteAccount = async (
  password: string,
): Promise<{ success: true }> => {
  const requestHeaders = await headers();

  await auth.api.deleteUser({
    body: { password },
    headers: requestHeaders,
  });

  return { success: true };
};

export const sendVerificationEmail = async (
  _prevState: unknown,
  formData: FormData,
) => {
  const email = formData.get("email") as string;
  try {
    await auth.api.sendVerificationEmail({
      body: { email },
    });
    return {
      success: true,
      error: null,
    };
  } catch (error) {
    if (error instanceof APIError) {
      return { success: false, error: error.message };
    }

    return { success: false, error: "Произошла системная ошибка" };
  }
};
