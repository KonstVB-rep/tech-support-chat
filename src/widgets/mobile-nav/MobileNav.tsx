'use client';

import { useMediaQuery } from '@/shared/lib/hooks/useMediaQuery';
import { cn } from '@/shared/lib/utils';
import { MessagesSquare, Settings, Users, UserRoundCog } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const MobileNav = ({ isAdmin }: { isAdmin: boolean }) => {
    const pathname = usePathname();
  
    const isNotDekstop = useMediaQuery("(max-width: 767px)");


    if(!isNotDekstop) return null;
  
    const isActive = (href: string) => pathname.startsWith(href);
  
    const linkClass = (href: string) => cn(
      "flex flex-col gap-1 items-center justify-center h-auto p-2 rounded-xl transition-colors select-none shrink-0",
      isActive(href) 
        ? "bg-primary/10 text-primary font-medium" 
        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
    );


  return (
    <div className="fixed bottom-0 w-full z-50 flex bg-background gap-2 justify-center py-4 px-1 border-none">

      <Link href="/chats" className={linkClass("/chats")}>
        <MessagesSquare className="size-5" />
        <span className="text-xs">Чаты</span>
      </Link>

      <Link href="/account" className={linkClass("/account")}>
        <Settings  className="size-5" />
        <span className="text-xs">Настройки</span>
      </Link>

      {isAdmin && (
        <Link href="/admin/organizations" className={linkClass("/admin/organizations")}>
          <Users className="size-5" />
          <span className="text-xs">Клиенты</span>
        </Link>
      )}

      {isAdmin && (
        <Link href="/admin/staff" className={linkClass("/admin/staff")}>
          <UserRoundCog  className="size-5" />
          <span className="text-xs">Инженеры</span>
        </Link>
      )}

    </div>
  )
}

export default MobileNav