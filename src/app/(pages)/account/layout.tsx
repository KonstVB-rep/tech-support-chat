import { Sidebar } from '@/widgets/sidebar'
import React from 'react'

const AccountLayout = ({children}: {children: React.ReactNode}) => {
  return (
    <>
        {/* <aside className="w-full md:w-80 h-full shrink-0 hidden md:block">
            <Sidebar sidebarType={"settings"} />
        </aside> */}
        {children}
    </>
  )
}

export default AccountLayout