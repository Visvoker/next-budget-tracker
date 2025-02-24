import React, { ReactNode } from 'react'

const WizardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className='relative flex flex-col items-center justify-center h-screen w-full '>
      {children}
    </div>
  )
}

export default WizardLayout
