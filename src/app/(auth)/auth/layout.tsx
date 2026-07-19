import React from "react";

interface PageLayoutProps {
  children: React.ReactNode;
}

const AuthPageLayout = async ({ children }: PageLayoutProps) => {
  return (
    <div className="flex min-h-screen w-full">
      <div className="flex flex-col md:flex-row w-full overflow-hidden bg-auth_layout">
        {children}
      </div>
    </div>
  );
};

export default AuthPageLayout;
