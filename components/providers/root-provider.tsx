"use client"

import React, { ReactNode } from 'react'

import { ThemeProvider } from 'next-themes'

const RootProvider = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </div>
  )
}

export default RootProvider
