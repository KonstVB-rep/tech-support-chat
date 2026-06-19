import { FROM_EMAIL, resend } from "./resend";

type SendEmailValues = {
  to: string;
  subject: string;
  text: string;
};

export const sendEmail = async ({ to, subject, text }: SendEmailValues) => {
  return await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject,
    html: text,
  });
};
