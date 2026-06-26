import { cn } from '@/shared/lib/utils'
import React from 'react'


const WrapperScreen = ({children, className}: {children: React.ReactNode, className?: string}) => {
  return (
    <div className={cn("flex flex-col h-full bg-background border-x border-border shadow-xl items-center overflow-y-auto", className)}>
        {children}
    </div>
  )
}

export default WrapperScreen