import { ButtonEnable2FA } from "@/features/auth-2fa";
import ButtonSignOut from "@/features/auth-signout/ui/ButtonSignOut";
import { auth } from "../lib/auth";


export type FullSession = typeof auth.$Infer.Session;

export interface Enable2FAProps {
  session: FullSession;
}

export const Enable2FA = ({ session }: Enable2FAProps) => {
  return (
    <div className="mt-20">
      {session.user.twoFactorEnabled ? (
        <p>Двухфакторная аутентификация уже включена</p>
      ) : (
        <ButtonEnable2FA />
      )}
      <ButtonSignOut />
    </div>
  );
};

export default Enable2FA;
