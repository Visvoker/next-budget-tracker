"use client"

import React from 'react'
import { Category } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { PlusSquare, TrashIcon, TrendingDown, TrendingUp } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import SkeletonWrapper from '@/components/SkeletonWrapper';
import { CurrencyComboBox } from '@/components/currencyComboBox';

import { cn } from '@/lib/utils';
import { TransactionType } from '@/lib/type';

import CreateCategoryDialog from '../_components/createCategoryDialog';
import DeleteCategoryDialog from '../_components/DeleteCategoryDialog';

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
  const categoriesQuery = useQuery<Category[]>({
    queryKey: ["categories", type],
    queryFn: async () => {
      const res = await fetch(`/api/categories?type=${type}`);

      if (!res.ok) {
        throw new Error(`API Error:${res.status} ${res.statusText}`)
      }

      return res.json();
    }
  });

  const dataAvailable = categoriesQuery.data && categoriesQuery.data.length > 0;

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
        <Separator />
        {
          !dataAvailable ? (
            <div className="flex flex-col h-40 w-full items-center justify-center">
              <p>
                No
                <span
                  className={cn("m-1", type === "income" ? "text-emerald-500" : "text-red-500")}
                >
                  {type}
                </span>
                categories yet
              </p>
              <p className='text-sm text-muted-foreground'>
                Create one to get started
              </p>
            </div>
          ) : (
            <div className='grid grid-flow-row gap-2 p-2 sm:grid-flow-row sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
              {categoriesQuery.data.map((category) => (
                <CategoryCard category={category} key={category.name} />
              ))}
            </div>
          )
        }
      </Card>
    </SkeletonWrapper>
  )
}

interface CategoryCardProps {
  category: Category
}

const CategoryCard = ({ category }: CategoryCardProps) => {
  return (
    <div className="flex flex-col border-separate items-center justify-between rounded-md border shadow-md shadow-black/[0.1] dark:shadow-white/[0.1]">
      <div className="flex flex-col items-center gap-2 p-4">
        <span className='text-3xl' role='img'>
          {category.icon}
        </span>
        <span>{category.name}</span>
      </div>
      <DeleteCategoryDialog
        category={category}
        trigger={
          <Button
            className='flex w-full border-separate items-center gap-2 rounded-t-none text-muted-foreground hover:bg-red-500/20'
            variant={"secondary"}
          >
            <TrashIcon className='h-4 w-4' />
            Remove
          </Button>
        }
      />
    </div>
  )
}