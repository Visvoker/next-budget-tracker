"use client"

import React from 'react'
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { UserButton } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';

import Logo from '@/components/logo';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { buttonVariants } from '@/components//ui/button';

const Navbar = () => {
  return (
    <>
      <DesktopNavbar />
    </>
  )
};

const Items = [
  { label: "Dashboard", link: "/" },
  { label: "Transactions", link: "/transactions" },
  { label: "Manage", link: "/manage" },
]

const DesktopNavbar = () => {
  return (
    <div className='hidden border-separate border-b bg-background md:block'>
      <nav className='container flex items-center justify-between px-8'>
        <div className='flex h-[80px] min-h-[60px] items-center gpa-x-4'>
          <Logo />
          <div className="flex h-full">
            {Items.map((item) => (
              <NavbarItem
                key={item.label}
                link={item.link}
                label={item.label}
              />
            ))}
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

const NavbarItem = ({ link, label }: {
  link: string;
  label: string;
}) => {
  const pathname = usePathname()
  const isActive = pathname === link;

  return (
    <div className='relative flex items-center'>
      <Link
        href={link}
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "w-full justify-center text-lg text-muted-foreground hover:text-foreground",
          isActive && "text-foreground"
        )}
      >
        {label}
      </Link>
      {isActive && (
        <div className='absolute -bottom-[2px] left-1/2 hidden h-[2px] w-[80%] -translate-x-1/2 rounded-xl bg-foreground md:block' />
      )}
    </div>
  )
}

export default Navbar;
