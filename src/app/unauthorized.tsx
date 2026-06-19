import { Button } from "@/shared/ui/button";
import Link from "next/link";


export default function UnauthorizedPage() {
  return (
    <main className="flex grow items-center justify-center px-4 text-center">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">
            401 - пользователь не авторизован
          </h1>
          <p className="text-muted-foreground">
            Войдите в аккаунт чтобы продолжить
          </p>
        </div>
        <div>
          <Button asChild>
            <Link href="/auth/sign-in">Войти</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
