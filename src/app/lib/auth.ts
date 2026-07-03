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
                imageUrl: user.image || "https://github.com",
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
  // socialProviders: {
  //   // Настройка Yandex
  //   yandex: {
  //     enabled: true,
  //     clientId: process.env.YANDEX_CLIENT_ID!,
  //     clientSecret: process.env.YANDEX_CLIENT_SECRET!,
  //     redirectURI: process.env.BETTER_AUTH_URL + "/api/auth/callback/yandex",
  //   },
  //   // Настройка VK (через расширенный конфиг, так как VK специфичен)
  //   vk: {
  //     enabled: true,
  //     clientId: process.env.VK_CLIENT_ID!,
  //     clientSecret: process.env.VK_CLIENT_SECRET!,
  //     authorizationUrl: "https://oauth.vk.com/authorize?v=5.131",
  //     tokenUrl: "https://oauth.vk.com/access_token",
  //     userProfileUrl: "https://api.vk.com/method/users.get?v=5.131&fields=photo_200,email",
  //     // Обработка данных профиля VK
  //     mapProfile(profile: any) {
  //       const user = profile.response[0];
  //       return {
  //         id: user.id.toString(),
  //         name: `${user.first_name} ${user.last_name}`,
  //         email: user.email, // Email придет только если разрешен в приложении
  //         image: user.photo_200,
  //       };
  //     },
  //   },
  // },
  name: "Proffecto Portal",
  emailVerification: {
    //autoSignInAfterVerification: true
    // onExistingUserSignUp: async ({ user }, request) => {
    //   void sendEmail({
    //     to: user.email,
    //     subject: "Sign-up attempt with your email",
    //     text: "Someone tried to create an account using your email address. If this was you, try signing in instead. If not, you can safely ignore this email.",
    //   });
    // },
    //    sendVerificationEmail: async ({ user, url }) => {
    //   void sendEmail({
    //     to: user.email,
    //     subject: "Verify your email address",
    //     text: `Click the link to verify your email: ${url}`,
    //   });
    // },
    //Функция afterEmailVerificationзапускается автоматически при подтверждении адреса электронной почты пользователя, получая userобъект и requestподробную информацию, что позволяет выполнять действия для конкретного пользователя.
    // async afterEmailVerification(user, request) {
    //       // Your custom logic here, e.g., grant access to premium features
    //       console.log(`${user.email} has been successfully verified!`);
    //   }
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
    // haveIBeenPwned({
    //   customPasswordCompromisedMessage:
    //     "Введенный вами пароль был скомпрометирован. Пожалуйста, выберите другой пароль.",
    // }),
  ],
});

export type Session = typeof auth.$Infer.Session;
export type UserCustom = Session["user"];
