"use client"

import React, { useMemo } from 'react'

import { UserSettings } from '@prisma/client'
import { useQuery } from '@tanstack/react-query';

import { TransactionType } from '@/lib/type';
import { DateToUTCDate, GetFormatterForCurrency } from '@/lib/helper';
import { getCategoriesStatsResponseType } from '@/app/api/stats/categories/route';

import SkeletonWrapper from '@/components/SkeletonWrapper';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';

interface CategoriesStatsProps {
  userSettings: UserSettings;
  from: Date;
  to: Date
}

const CategoriesStats = ({
  userSettings,
  from,
  to
}: CategoriesStatsProps) => {
  const statsQuery = useQuery({
    queryKey: ["overview", "stats", "categories", from, to],
    queryFn: async () => {
      const res = await fetch(
        `/api/stats/categories?from=${DateToUTCDate(from)}&to=${DateToUTCDate(to)}`
      );

      if (!res.ok) {
        throw new Error(`API Error: ${res.status} ${res.statusText}`);
      }

      return res.json();
    },
  });

  const formatter = useMemo(() => {
    return GetFormatterForCurrency(userSettings.currency)
  }, [userSettings.currency])

  return (
    <div className='flex flex-wrap w-full gap-2 md:flex-nowrap'>
      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <CategoriesCard
          formatter={formatter}
          type="income"
          data={statsQuery.data || []}
        />
      </SkeletonWrapper>
      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <CategoriesCard
          formatter={formatter}
          type="expense"
          data={statsQuery.data || []}
        />
      </SkeletonWrapper>
    </div>
  )
}

export default CategoriesStats

interface CategoriesCardProps {
  type: TransactionType,
  formatter: Intl.NumberFormat,
  data: getCategoriesStatsResponseType,
}
const CategoriesCard = ({
  type,
  formatter,
  data,
}: CategoriesCardProps) => {
  const filteredData = data.filter((el) => el.type === type);
  const total = filteredData.reduce(
    (acc, el) => acc + (el._sum.amount || 0), 0
  )
  return (
    <Card className='h-80 w-full col-span-6'>
      <CardHeader>
        <CardTitle className='grid grid-flow-row justify-between gap-2 text-muted-foreground md:grid-flow-col'>
          {type === "income" ? "Incomes" : "Expenses"}
        </CardTitle>
      </CardHeader>

      <div className='flex items-center justify-between gap-2'>
        {filteredData.length === 0 && (
          <div className='flex flex-col h-60 w-full items-center justify-center'>
            No data for the selected period
            <p className='text-sm text-muted-foreground'>
              Try selecting a different period or try adding new{" "}
              {type === "income" ? "incomes" : "expenses"}
            </p>
          </div>
        )}

        {filteredData.length > 0 && (
          <ScrollArea className='h-60 w-full px-4'>
            <div className="flex flex-col w-full gap-4 p-4">
              {filteredData.map((item) => {
                const amount = item._sum.amount || 0;
                const percentage = (amount * 100) / (total || amount);

                return (
                  <div
                    key={item.category}
                    className="flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className='flex items-center text-gray-400'>
                        {item.categoryIcon} {item.category}
                        <span className='ml-2 text-xs text-muted-foreground'>
                          ({percentage.toFixed(0)}%)
                        </span>
                      </span>
                      <span className='text-sm text-gray-400'>
                        {formatter.format(amount)}
                      </span>
                    </div>
                    <Progress
                      value={percentage}
                      indicator={
                        type === "income"
                          ? "bg-emerald-500"
                          : "bg-red-500"
                      }
                    />
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}

      </div>
    </Card>
  )
}