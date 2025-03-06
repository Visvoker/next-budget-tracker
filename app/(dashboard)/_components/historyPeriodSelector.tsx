import React from 'react'

import { Period, TimeFrame } from '@/lib/type'
import { useQuery } from '@tanstack/react-query';

import { GetHistoryPeriodsResponseType } from '@/app/api/history-periods/route';

import SkeletonWrapper from '@/components/SkeletonWrapper';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface HistoryPeriodSelectorProps {
  period: Period;
  setPeriod: (period: Period) => void;
  timeframe: TimeFrame;
  setTimeFrame: (timeframe: TimeFrame) => void;
}

const HistoryPeriodSelector = ({
  period,
  setPeriod,
  timeframe,
  setTimeFrame,
}: HistoryPeriodSelectorProps) => {
  const historyPeriods = useQuery<GetHistoryPeriodsResponseType>({
    queryKey: ["overview", "history", "periods"],
    queryFn: async () => {
      const res = await fetch("/api/history-periods");

      if (!res.ok) {
        throw new Error(`API Error: ${res.status} ${res.statusText}`);
      }

      return res.json();
    }
  })
  return (
    <div className='flex flex-wrap items-center gap-4'>
      <Tabs
        value={timeframe}
        onValueChange={(value) => setTimeFrame(value as TimeFrame)}
      >
        <SkeletonWrapper isLoading={historyPeriods.isFetching} >
          <TabsList>
            <TabsTrigger value="year">Year</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
          </TabsList>
        </SkeletonWrapper>
      </Tabs>
      <div className="flex  items-center gap-2">
        <SkeletonWrapper isLoading={historyPeriods.isFetching}>
          <YearSelector
            period={period}
            setPeriod={setPeriod}
            years={historyPeriods.data || []}
          />
        </SkeletonWrapper>
        {timeframe === "month" && (
          <SkeletonWrapper isLoading={historyPeriods.isFetching} fullWidth={false}>
            <MonthSelector
              period={period}
              setPeriod={setPeriod}
            >

            </MonthSelector>
          </SkeletonWrapper>
        )}
      </div>
    </div>
  )
}

export default HistoryPeriodSelector

interface YearSelectorProps {
  period: Period,
  setPeriod: (period: Period) => void,
  years: GetHistoryPeriodsResponseType,
}

const YearSelector = ({
  period,
  setPeriod,
  years,
}: YearSelectorProps) => {
  return (
    <Select
      value={period.year.toString()}
      onValueChange={(value) => {
        setPeriod({
          month: period.month,
          year: parseInt(value)
        })
      }}
    >
      <SelectTrigger className='w-[180px]'>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {years.map((year) => (
          <SelectItem key={year} value={year.toString()}>
            {year}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

const MonthSelector = ({
  period,
  setPeriod,
}: YearSelectorProps) => {
  return (
    <Select
      value={period.month.toString()}
      onValueChange={(value) => {
        setPeriod({
          year: period.year,
          month: parseInt(value)
        })
      }}
    >
      <SelectTrigger className='w-[180px]'>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((month) => {
          const monthStr = new Date(period.year, month, 1).toLocaleString(
            "default",
            { month: "long" }
          )
          return (
            <SelectItem key={month} value={month.toString()} >
              {monthStr}
            </SelectItem>
          )
        })}
      </SelectContent>
    </Select >
  )
}