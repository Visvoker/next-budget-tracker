"use client"

import React, { useState } from 'react'
import { Menu } from 'lucide-react';

import { UserButton } from '@clerk/nextjs';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import NavbarItems from '@/components/navbar-items';
import Logo, { LogoMobile } from '@/components/logo';
import { ThemeSwitcher } from '@/components/theme-switcher';

const Navbar = () => {
  return (
    <>
      <DesktopNavbar />
      <MobileNavbar />
    </>
  )
};

const Items = [
  { label: "Dashboard", link: "/" },
  { label: "Transactions", link: "/transactions" },
  { label: "Manage", link: "/manage" },
]

const MobileNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="block border-separate bg-background md:hidden  ">
      <nav className='container flex items-center justify-between px-4'>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant={"ghost"} size={"icon"}>
              <Menu className='h-5 w-5' />
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[400px] sm:w-[540px]" side="left">
            <SheetTitle>
              <Logo />
            </SheetTitle>
            <div className="flex flex-col items-start gap-1 pt-4">
              {Items.map((item) => (
                <NavbarItems
                  key={item.label}
                  link={item.link}
                  label={item.label}
                  clickCallback={() => setIsOpen((prev) => !prev)}
                />
              ))}
            </div>
          </SheetContent>
        </Sheet>
        <div className="flex h-[80px] min-h-[60px] items-center gap-x-4">
          <LogoMobile />
        </div>
        <div className="flex items-center gap-2">
          <ThemeSwitcher />
          <UserButton afterSignOutUrl='/sign-in' />
        </div>
      </nav>
    </div>
  )
}

const DesktopNavbar = () => {
  return (
    <div className='hidden border-separate border-b bg-background md:block'>
      <nav className='flex items-center justify-between px-8'>
        <div className='flex items-center' >
          <Logo />
          <div className='flex h-[80px] min-h-[60px] items-center gap-x-4 ml-5'>
            <div className="flex h-full">
              {Items.map((item) => (
                <NavbarItems
                  key={item.label}
                  link={item.link}
                  label={item.label}
                />
              ))}
            </div>
          </div>
        </div>
        <div className='flex items-center gap-3'>
          <ThemeSwitcher />
          <UserButton afterSignOutUrl='/sign-in' />
        </div>
      </nav>
    </div>
  )
}

export default Navbar;
