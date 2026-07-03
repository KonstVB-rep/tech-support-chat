import React from 'react'

const Layout = ({children}: {children: React.ReactNode}) => {
  return (
    <>
        {/* <aside className="w-full md:w-80 h-full shrink-0 hidden md:block">
            <Sidebar sidebarType={"settings"} />
        </aside> */}
        {children}
    </>
  )
}

export default Layout