import React, { ReactNode } from 'react'

import { Skeleton } from '@/components/ui/skeleton';

import { cn } from '@/lib/utils';

interface SkeletonWrapperProps {
  children: ReactNode;
  isLoading: boolean;
  fullWidth?: boolean;
};

const SkeletonWrapper = ({
  children,
  isLoading,
  fullWidth,
}: SkeletonWrapperProps) => {

  if (!isLoading) return children;

  return (
    <Skeleton className={cn("w-full h-full", fullWidth && "w-full")}>
      <div className='opacity-0'>
        {children}
      </div>
    </Skeleton >
  );
}

export default SkeletonWrapper
