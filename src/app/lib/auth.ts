import { getResetPasswordHtml } from "@/shared/ui/email-templates/getResetPasswordHtml";
import { APIError, betterAuth, type User } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { prisma } from "@/prisma/prisma-client";
import { sendEmail } from "./sendEmail";
import { admin } from "better-auth/plugins";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "mysql",
  }),
  user: {
    additionalFields: {
      role: {
        type: "string",
        input: false,
        defaultValue: "MEMBER",
      },
      isActive: {
        type: "boolean",
        input: false,
        defaultValue: true,
      },
      canCreateGroups: {
        type: "boolean",
        input: false, // Клиент не может сам себе включить этот тумблер
        defaultValue: true, // По умолчанию новым клиентам создавать темы РАЗРЕШЕНО
      },
    },
    changeEmail: {
      enabled: false,
    },
    deleteUser: {
      enabled: true,
    },
    beforeDelete: async (user: User, _request: Request | undefined) => {
      if (user.email.includes("admin")) {
        throw new APIError("BAD_REQUEST", {
          message: "Admin accounts can't be deleted",
        });
      }
    },
    // afterDelete: async (user: User, request: Request | undefined) => {
    //   // Perform any cleanup or additional actions here
    // },
    // sendDeleteAccountVerification: async ({ user, url, token }) => {
    //   console.log(user,url, token)
    // },
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          try {
            await prisma.profile.create({
              data: {
                userId: user.id,
                name: user.name || "Пользователь",
                email: user.email,
                imageUrl: user.image || "https://github.com/shadcn.png",
                username: `user_${Math.random().toString(36).substring(2, 8)}`,
              },
            });
          } catch (error) {
            console.error("Ошибка авто-профиля:", error);
          }
        },
      },
    },
  },

  name: "Proffecto Portal",
  emailVerification: {
    sendOnSignIn: true,
    autoSignInAfterVerification: true,
    async sendVerificationEmail({ user, url }) {
      console.log("👉 ССЫЛКА ДЛЯ ТЕСТИРОВАНИЯ ПОДТВЕРЖДЕНИЯ EMAIL:", url);
      try {
        const { data, error } = await sendEmail({
          to: user.email,
          subject: "Подтвердите свой адрес электронной почты",
          text: `Нажмите на ссылку чтобы подтвердить свой адрес электронной почты: ${url}`,
        });
        if (error) {
          // Это ошибка именно от Resend (например, неверный API ключ)
          console.error("Resend Error:", error);
          throw new Error("Failed to send email"); // Чтобы Better Auth знал о проблеме
        }

        if (process.env.NODE_ENV === "development") {
          console.log("Reset url:", url);
        }

        console.log("Email sent successfully:", data);
      } catch (error) {
        console.error("Critical SendResetPassword Error:", error);
        throw error; // Пробрасываем, чтобы API вернуло ошибку
      }
    },
  },

  emailAndPassword: {
    enabled: true,
    disableSignUp: true,
    //requireEmailVerification: true, //запретить вход без подтверждения email

    sendResetPassword: async ({ user, url }) => {
      console.log("👉 ССЫЛКА ДЛЯ ТЕСТИРОВАНИЯ СБРОСА ПАРОЛЯ:", url);
      try {
        const emailHtml = getResetPasswordHtml({
          email: user.email,
          resetUrl: url,
        });

        const { data, error } = await sendEmail({
          to: user.email,
          subject: "Сброс пароля",
          text: emailHtml,
        });
        if (error) {
          console.error("Resend Error:", error);
        }

        if (process.env.NODE_ENV === "development") {
          console.log("Reset url:", url);
        }

        console.log("Email sent successfully:", data);
      } catch (error) {
        console.error("SendResetPassword Catch:", error);
        throw error;
      }
    },
    //   onPasswordReset: async ({ user }, request) => {
    //   // your logic here
    //   console.log(`Password for user ${user.email} has been reset.`);
    // },
  },
  onSignOut: {
    redirect: "/auth/sign-in", // Куда редиректить после выхода
  },
  baseURL: process.env.BETTER_AUTH_URL,
  // emailVerification: {
  //   sendOnSignUp: true, // отправлять сразу при регистрации
  //   autoSignInAfterVerification: true,
  //   sendVerificationEmail: async ({ user, url }) => {
  //     const { error } = await resend.emails.send({
  //       from: "Acme <onboarding@resend.dev>", // замени на свой домен после верификации
  //       to: user.email,
  //       subject: "Подтвердите ваш Email",
  //       html: `<p>Нажмите на ссылку для подтверждения: <a href="${url}">${url}</a></p>`,
  //     });

  //     if (error) {
  //       console.error("Ошибка отправки письма через Resend:", error);
  //     }
  //   },
  // },
  plugins: [
    admin(),
    nextCookies(),
    // twoFactor(),
  ],
});

export type Session = typeof auth.$Infer.Session;
export type UserCustom = Session["user"];
