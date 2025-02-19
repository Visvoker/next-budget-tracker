import React, { ReactNode } from 'react'
import Logo from '../components/logo';

function layout({ children }: { children: ReactNode }) {
  return (
    <div className='relative flex flex-col items-center justify-center w-full h-screen '>
      <Logo />
      <div className='mt-12'>
        {children}
      </div>
    </div>
  )
}

export default layout;
