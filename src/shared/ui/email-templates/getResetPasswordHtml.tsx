interface EmailTemplateProps {
  email: string;
  resetUrl: string;
}

export function getResetPasswordHtml({ email, resetUrl }: EmailTemplateProps) {
  return `
    <div style="background-color: #f8fafc; padding: 40px; font-family: sans-serif; color: #0f172a;">
      <div style="margin: 0 auto; max-width: 600px; border-radius: 12px; border: 1px solid #e2e8f0; background-color: #ffffff; padding: 32px; shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);">
        <h1 style="margin-bottom: 24px; font-size: 24px; font-weight: 700; color: #1e293b;">Proffecto Portal</h1>
        
        <p style="margin-bottom: 16px; font-size: 16px;">Привет, <span style="font-weight: 600;">${email}</span>!</p>
        
        <p style="margin-bottom: 32px; font-size: 16px; line-height: 1.625; color: #475569;">
          Мы получили запрос на сброс пароля. Если это были вы, нажмите на кнопку ниже:
        </p>

        <div style="margin-bottom: 32px; text-align: center;">
          <a href="${resetUrl}" 
             style="display: inline-block; rounded-radius: 8px; background-color: #2563eb; padding: 12px 24px; font-size: 14px; font-weight: 600; color: #ffffff; text-decoration: none; border-radius: 8px;">
            Сбросить пароль
          </a>
        </div>

        <div style="border-top: 1px solid #f1f5f9; padding-top: 24px; text-align: center; font-size: 12px; color: #94a3b8;">
          Если вы не запрашивали сброс, просто проигнорируйте это письмо.
        </div>
      </div>
    </div>
  `;
}
