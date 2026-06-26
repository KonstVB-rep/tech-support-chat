import { Sidebar } from '@/widgets/sidebar'
import React from 'react'
import ScreenByType from '../ui/ScreenByType'

const Chats = () => {
  return (
    <>
     <aside className="w-full md:w-80 h-full shrink-0 hidden md:block">
        <Sidebar sidebarType={"chats"} />
      </aside>

      <main className="flex-1 h-full">
        <ScreenByType screenType={"chats"}/>
      </main>
    </>
  )
}

export default Chats