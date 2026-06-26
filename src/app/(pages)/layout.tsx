import { MessagesSquare } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const PageLayout = ({children}: {children: React.ReactNode}) => {
  return (
    <div className="flex h-[calc(100dvh-var(--header-height))] max-h-[calc(100dvh-var(--header-height))] w-full">
      <div className="flex h-full">
        <div className="flex flex-col gap-2 h-full select-none justify-start py-4 px-1 border-none bg-transparent">
            <Link
              href="/chats"
              className="flex flex-col gap-1 items-center justify-center h-auto p-2 hover:bg-muted/50 rounded-xl">
                <MessagesSquare className="size-5"/>
                <span className="text-xs">Чаты</span>
            </Link>
        </div>
      </div>
       <div className='flex w-full'>{children}</div>
    </div>
 
  )
}

export default PageLayout