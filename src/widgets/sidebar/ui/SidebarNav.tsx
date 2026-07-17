"use client";

import { MessagesSquare, Settings, Users, UserRoundCog } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/shared/lib/utils';
import ButtonSignOut from '@/features/auth-signout/ui/ButtonSignOut';
import { useMediaQuery } from '@/shared/lib/hooks/useMediaQuery';

interface SidebarNavProps {
  isAdmin: boolean; 
}

export const SidebarNav = ({ isAdmin }: SidebarNavProps) => {
  const pathname = usePathname();

  const isDekstop = useMediaQuery("(min-width: 768px)");

  const isActive = (href: string) => pathname.startsWith(href);

  const linkClass = (href: string) => cn(
    "flex flex-col gap-1 items-center justify-center h-auto p-2 rounded-xl transition-colors select-none",
    isActive(href) 
      ? "bg-primary/10 text-primary font-medium" 
      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
  );

  if(!isDekstop) return null;

  return (
    <div className="flex bg-background flex-col gap-2 h-full justify-between py-4 px-1 border-none">
   <div className='grid gap-2'>
       {/* 1. Чаты */}
      <Link href="/chats" className={linkClass("/chats")}>
        <MessagesSquare className="size-5" />
        <span className="text-xs">Чаты</span>
      </Link>

      {/* 2. Аккаунт */}
      <Link href="/account" className={linkClass("/account")}>
        <Settings className="h-4 w-4 text-muted-foreground" />
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
   </div>

      <ButtonSignOut variant="ghost" className="flex flex-col gap-1 items-center justify-center h-auto p-2 rounded-xl select-none transition-colors mx-auto text-muted-foreground hover:bg-muted/50 hover:text-foreground" withIcon={true} withText={true}/>
    </div>
  );
};
