import React from 'react'

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

interface NavbarItemsProps {
  link: string;
  label: string;
  clickCallback?: () => void;
}

const NavbarItems = ({
  link,
  label,
  clickCallback
}: NavbarItemsProps) => {
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
        onClick={() => {
          if (clickCallback) clickCallback();
        }}
      >
        {label}
      </Link>
      {isActive && (
        <div className='absolute -bottom-[2px] left-1/2 hidden h-[2px] w-[80%] -translate-x-1/2 rounded-xl bg-foreground md:block' />
      )}
    </div>
  )
}

export default NavbarItems
