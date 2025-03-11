import React from 'react'
import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server';

import { prisma } from '@/lib/prisma';
import CreateTransactionDialog from '@/app/(dashboard)/_components/createTransactionDialog';

import { Button } from '@/components/ui/button';

import History from './_components/history';
import Overview from './_components/overview';


const dashboardPage = async () => {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in")
  }

  const userSettings = await prisma.userSettings.findUnique
    ({
      where: {
        userId: user.id,
      },
    });

  if (!userSettings) {
    redirect("/wizard");
  }

  return (
    <div className='h-full bg-background'>
      <div className='border-b bg-card'>
        <div className='flex flex-wrap items-center justify-between gap-6 py-8'>
          <p className="text-3xl font-bold">
            Hello, {user.lastName}! 👋
          </p>
          <div className="flex items-center gap-3">
            <CreateTransactionDialog
              trigger={
                <Button
                  variant={"outline"}
                  className="border-emerald-500 bg-emerald-950 text-white hover:bg-emerald-700 hover:text-white"
                >
                  New income 💰
                </Button>
              }
              type='income'
            />
            <CreateTransactionDialog
              trigger={
                <Button
                  variant={"outline"}
                  className="border-rose-500 bg-rose-950 text-white hover:bg-rose-700 hover:text-white"
                >
                  New expense 💸
                </Button>
              }
              type="expense"
            />
          </div>
        </div>
      </div>
      <Overview userSettings={userSettings} />
      <History userSettings={userSettings}/>
    </div>
  )
}

export default dashboardPage;
