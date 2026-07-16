import { cn } from '@/shared/lib/utils'
import React from 'react'


const WrapperScreen = ({children, className}: {children: React.ReactNode, className?: string}) => {
  return (
    <div className={cn("flex flex-col h-full max-h-[calc(100vh-80px)] md:max-h-dvh bg-transparent border-x border-border shadow-xl items-center", className)}>
        {children}
    </div>
  )
}

export default WrapperScreen