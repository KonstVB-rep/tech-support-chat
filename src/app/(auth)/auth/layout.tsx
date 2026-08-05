import type React from "react"

interface PageLayoutProps {
  children: React.ReactNode
}

const AuthPageLayout = ({ children }: PageLayoutProps) => {
  return (
    <div className="flex min-h-screen w-full">
      <div className="flex w-full flex-col overflow-hidden bg-auth_layout md:flex-row">
        {children}
      </div>
    </div>
  )
}

export default AuthPageLayout
