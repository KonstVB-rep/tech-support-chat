import React from 'react'

const WrapperHeaderScreen = ({children}:{children: React.ReactNode}) => {
  return (
      <div className="w-full flex items-center bg-primary p-4 text-primary-foreground shadow-md select-none">
        {children}
     </div>
  )
}

export default WrapperHeaderScreen