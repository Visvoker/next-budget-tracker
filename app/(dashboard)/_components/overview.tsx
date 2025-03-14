"use client"

import React, { useState } from 'react'
import { differenceInDays, startOfMonth } from 'date-fns';
import { UserSettings } from '@prisma/client';

import { DateRangePicker } from '@/components/ui/date-range-picker';
import { MAX_DATE_RANGE_DAYS } from '@/lib/constants';
import { toast } from 'sonner';
import StatsCards from './statsCards';
import CategoriesStats from './categoriesStats';

interface OverviewProps {
  userSettings: UserSettings;
}

const Overview = ({ userSettings }: OverviewProps) => {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: startOfMonth(new Date()),
    to: new Date(),
  });

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-2 py-6">
        <h2 className='text-3xl font-bold'>Overview</h2>
        <div className='flex items-center gap-3'>
          <DateRangePicker
            initialDateFrom={dateRange.from}
            initialDateTo={dateRange.to}
            showCompare={false}
            onUpdate={(value) => {
              const { from, to } = value.range;

              if (!from || !to) return;
              if (differenceInDays(to, from) > MAX_DATE_RANGE_DAYS) {
                toast.error(`The select date range is too big. Max allowed range is ${MAX_DATE_RANGE_DAYS} days!`);
                return;
              }

              setDateRange({ from, to })
            }}
          />
        </div>
      </div>
      <div className=' flex flex-col w-full gap-2'>
        <StatsCards
          userSettings={userSettings}
          from={dateRange.from}
          to={dateRange.to}
        />
        <CategoriesStats
          userSettings={userSettings}
          from={dateRange.from}
          to={dateRange.to}
        />
      </div>
    </>
  )
}

export default Overview;
