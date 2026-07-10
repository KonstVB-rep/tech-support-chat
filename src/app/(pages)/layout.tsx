import React, { Suspense } from 'react';
import { SidebarNavWrapper } from '@/widgets/sidebar/ui/SidebarNavWrapper';
import Loader from '@/shared/ui/custom/Loader';

interface PageLayoutProps {
  children: React.ReactNode;
}

const PageLayout = async ({ children }: PageLayoutProps) => {

  return (
    <div className="flex min-h-screen w-full">
      <div className="flex h-full">
         <Suspense fallback={<Loader />}>
          <SidebarNavWrapper />
        </Suspense>
      </div>
      
      <div className="flex w-full overflow-hidden">
        {children}
      </div>
    </div>
  );
};

export default PageLayout;
