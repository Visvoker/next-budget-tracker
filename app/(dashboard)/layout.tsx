import React, { ReactNode } from 'react'

import Navbar from '@/components/navbar'

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="relative flex flex-col h-screen w-full">
      <Navbar />
      <div className='w-full px-8'>
        {children}
      </div>
    </div>
  )
}

export default DashboardLayout