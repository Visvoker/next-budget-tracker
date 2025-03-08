"use client";

import React from 'react'
import { useQuery } from '@tanstack/react-query';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import SkeletonWrapper from '@/components/SkeletonWrapper';
import { CurrencyComboBox } from '@/components/currencyComboBox';

import { TransactionType } from '@/lib/type';
import { PlusSquare, TrendingDown, TrendingUp } from 'lucide-react';
import CreateCategoryDialog from '../_components/createCategoryDialog';
import { Button } from '@/components/ui/button';


const ManagePage = () => {
  return (
    <>
      <header className='border-b bg-card'>
        <div className="container flex flex-wrap items-center justify-between gap-6 py-8">
          <div>
            <p className='text-3xl font-bold'>Manage</p>
            <p className='text-muted-foreground'>
              Manage your account settings and categories
            </p>
          </div>
        </div>
      </header>
      <div className='container flex flex-col gap-4 '>
        <Card>
          <CardHeader>
            <CardTitle>Currency</CardTitle>
            <CardDescription>
              Set your default currency for transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CurrencyComboBox />
          </CardContent>
        </Card>
        <CategoryList type="income" />
        <CategoryList type="expense" />
      </div>
    </>
  )
}

export default ManagePage;

interface CategoryListProps {
  type: TransactionType
}

const CategoryList = ({ type }: CategoryListProps) => {
  const categoriesQuery = useQuery({
    queryKey: ["categories", type],
    queryFn: async () => {
      const res = await fetch(`/api/categories?type=${type}`);

      if (!res.ok) {
        throw new Error(`API Error:${res.status} ${res.statusText}`)
      }

      return res.json();
    }
  });
  return (
    <SkeletonWrapper isLoading={categoriesQuery.isLoading}>
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center justify-between gap-2'>
            <div className='flex items-center gap-2'>
              {type === "expense" ? (
                <TrendingDown className='h-12 w-12 items-center rounded-lg bg-red-400/10 p-2 text-red-500' />
              ) : (
                <TrendingUp className='h-12 w-12 items-center rounded-lg bg-emerald-400/10 p-2 text-emerald-500' />
              )}
              <div>
                {type === "income" ? "Incomes" : "Expenses"} categories
                <div className='text-sm text-muted-foreground'>
                  Sorted by name
                </div>
              </div>
            </div>

            <CreateCategoryDialog
              type={type}
              successCallback={() => categoriesQuery.refetch()}
              trigger={
                <Button className='gap-2 text-sm'>
                  <PlusSquare className='h-4 w-4' />
                  Create category
                </Button>
              }
            />
          </CardTitle>
        </CardHeader>
      </Card>
    </SkeletonWrapper>
  )
}
