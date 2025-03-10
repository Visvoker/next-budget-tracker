"use client"

import CountUp from "react-countup";
import { TrendingDown, TrendingUp, Wallet } from 'lucide-react';
import { UserSettings } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import React, { ReactNode, useCallback, useMemo } from 'react'

import { Card } from '@/components/ui/card';
import SkeletonWrapper from '@/components/SkeletonWrapper';

import { DateToUTCDate, GetFormatterForCurrency } from '@/lib/helper';
import { GetBalanceStatsResponseType } from '@/app/api/stats/balance/route';

interface StatsCardsProps {
  from: Date,
  to: Date,
  userSettings: UserSettings;
}


const StatsCards = ({
  from,
  to,
  userSettings,
}: StatsCardsProps) => {
  const statsQuery = useQuery<GetBalanceStatsResponseType>({
    queryKey: ["overview", "stats", from, to],
    queryFn: async () => {
      const res = await fetch(
        `/api/stats/balance?from=${DateToUTCDate(from)}&to=${DateToUTCDate(to)}`
      );

      if (!res.ok) {
        throw new Error(`API Error:${res.status} ${res.statusText}`)
      }

      return res.json();
    },
  });

  const formatter = useMemo(() => {
    return GetFormatterForCurrency(userSettings.currency);
  }, [userSettings.currency])

  const income = statsQuery.data?.income || 0;
  const expense = statsQuery.data?.expense || 0;

  const balance = income - expense;

  return (
    <div className='relative flex flex-wrap w-full gap-2 md:flex-nowrap'>
      <SkeletonWrapper isLoading={statsQuery.isFetching} >
        <StatCard
          formatter={formatter}
          value={income}
          title="Income"
          icon={
            <TrendingUp className='h-12 w-12 items-center rounded-1g p-2 text-emerald-500 bg-emerald-400/10' />
          }
        />
      </SkeletonWrapper>
      <SkeletonWrapper isLoading={statsQuery.isFetching} >
        <StatCard
          formatter={formatter}
          value={expense}
          title="Expense"
          icon={
            <TrendingDown className='h-12 w-12 items-center rounded-1g p-2 text-red-500 bg-red-400/10' />
          }
        />
      </SkeletonWrapper>
      <SkeletonWrapper isLoading={statsQuery.isFetching} >
        <StatCard
          formatter={formatter}
          value={balance}
          title="Balance"
          icon={
            <Wallet className='h-12 w-12 items-center rounded-1g p-2 text-violet-500 bg-violet-400/10' />
          }
        />
      </SkeletonWrapper>
    </div>
  )
}

export default StatsCards;

interface StatCardProps {
  formatter: Intl.NumberFormat;
  icon: ReactNode;
  title: string;
  value: number;
}

const StatCard = ({
  formatter,
  icon,
  title,
  value,
}: StatCardProps) => {
  const formatFn = useCallback((value: number) => {
    return formatter.format(value)
  }, [formatter]);

  return (
    <Card className='flex h-24 w-full items-center gap-2 p-4'>
      {icon}
      <div className='flex flex-col items-start gap-0'>
        <p className='text-muted-foreground'>{title}</p>
        <CountUp
          preserveValue
          redraw={false}
          end={value}
          decimals={2}
          formattingFn={formatFn}
          className="text-2xl"
        />
      </div>
    </Card>
  )
}