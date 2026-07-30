import type React from "react"

const WrapperHeaderScreen = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="g-primary-foreground sticky top-0 z-50 m-0 flex w-full items-center bg-muted p-4 text-primary shadow-[5px_0_5px_0_gray]">
      {children}
    </div>
  )
}

export default WrapperHeaderScreen
