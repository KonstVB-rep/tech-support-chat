"use client";

import { CircleUser, MessagesSquare, Settings, Users, UserRoundCog } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/shared/lib/utils';
import ButtonSignOut from '@/features/auth-signout/ui/ButtonSignOut';

interface SidebarNavProps {
  isAdmin: boolean; // Получаем готовый флаг безопасности с сервера
}

export const SidebarNav = ({ isAdmin }: SidebarNavProps) => {
  const pathname = usePathname();

  // Универсальный хелпер для проверки активности ссылки
  const isActive = (href: string) => pathname.startsWith(href);

  // Общие стили для кнопок, чтобы не дублировать код
  const linkClass = (href: string) => cn(
    "flex flex-col gap-1 items-center justify-center h-auto p-2 rounded-xl transition-colors select-none",
    isActive(href) 
      ? "bg-primary/10 text-primary font-medium" // Стиль активной вкладки
      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
  );

  return (
    <div className="flex  bg-background flex-col gap-2 h-full justify-start py-4 px-1 border-none">
      {/* 1. Чаты */}
      <Link href="/chats" className={linkClass("/chats")}>
        <MessagesSquare className="size-5" />
        <span className="text-xs">Чаты</span>
      </Link>

      {/* 2. Аккаунт */}
      <Link href="/account" className={linkClass("/account")}>
        <CircleUser className="size-5" />
        <span className="text-xs">Профиль</span>
      </Link>

      {/* 3. Настройки */}
      <Link href="/settings" className={linkClass("/account/settings")}>
        <Settings className="size-5" />
        <span className="text-xs">Настройки</span>
      </Link>

      {/* 🚀 4. Клиенты (Админка компаний) — виден ВСЕМ админам */}
      {isAdmin && (
        <Link href="/admin/organizations" className={linkClass("/admin/organizations")}>
          <Users className="size-5" />
          <span className="text-xs">Клиенты</span>
        </Link>
      )}

      {/* 🚀 5. Инженеры (Новая ссылка для админа техподдержки, которую ты просил) */}
      {isAdmin && (
        <Link href="/admin/staff" className={linkClass("/admin/staff")}>
          <UserRoundCog  className="size-5" />
          <span className="text-xs">Инженеры</span>
        </Link>
      )}

      <ButtonSignOut className="flex flex-col gap-1 items-center justify-center h-auto p-2 rounded-xl select-none transition-colors mx-auto text-muted-foreground hover:bg-muted/50 hover:text-foreground" withIcon={true} withText={true}/>
    </div>
  );
};
