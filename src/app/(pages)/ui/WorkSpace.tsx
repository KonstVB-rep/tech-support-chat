'use client'
import { Sidebar } from '@/widgets/sidebar';
import { useState } from 'react';
import { SidebarTypes } from '@/widgets/types';
import ScreenByType from './ScreenByType';


const WorkSpace = () => {
  const [type, setType] = useState<SidebarTypes>("chats");
  return (
    <>
      <aside className="w-full md:w-80 h-full shrink-0 hidden md:block">
        <Sidebar sidebarType={type}/>
      </aside>

      <main className="flex-1 h-full">
        <ScreenByType screenType={type}/>
      </main>
    </>
  )
}

export default WorkSpace