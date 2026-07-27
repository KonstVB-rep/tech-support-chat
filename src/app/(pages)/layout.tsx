import React, { Suspense } from "react";
import { SidebarNavWrapper } from "@/widgets/sidebar/ui/SidebarNavWrapper";
import { MobileNavWrapper } from "@/widgets/mobile-nav/MobileNavWrapper";

interface PageLayoutProps {
  children: React.ReactNode;
}

const PageLayout = async ({ children }: PageLayoutProps) => {
  return (
    <div className="flex min-h-screen w-full">
      <div className="flex h-full">
        <Suspense fallback={<SidebarNavSkeleton />}>
          <SidebarNavWrapper />
        </Suspense>
      </div>

      <div className="flex flex-col md:flex-row w-full overflow-hidden max-h-[calc(100dvh-80px)] md:max-h-none">
        {children}
        <Suspense>
          <MobileNavWrapper />
        </Suspense>
      </div>
    </div>
  );
};

export default PageLayout;

const SidebarNavSkeleton = () => {
  return (
    <div className="flex flex-col gap-2 p-2 items-center justify-start w-full h-full">
      <div className="w-12 h-12 animate-pulse dark:bg-zinc-800 bg-zinc-100 rounded-md" />
      <div className="w-12 h-12 animate-pulse dark:bg-zinc-800 bg-zinc-100 rounded-md" />
      <div className="w-12 h-12 animate-pulse dark:bg-zinc-800 bg-zinc-100 rounded-md" />
      <div className="w-12 h-12 animate-pulse dark:bg-zinc-800 bg-zinc-100 rounded-md" />
    </div>
  );
};
