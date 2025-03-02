"use client"

import React, { ReactNode } from 'react'
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";

import { TransactionType } from '@/lib/type';
import { cn } from '@/lib/utils';

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';

import { CreateTransactionSchema, CreateTransactionSchemaType } from '@/schema/transaction';
import { Input } from '@/components/ui/input';
import CategoryPicker from './categoryPicker';

interface createTransactionDialogProps {
  trigger: ReactNode;
  type: TransactionType;
}

const CreateTransactionDialog = ({
  trigger,
  type
}: createTransactionDialogProps) => {
  const form = useForm<CreateTransactionSchemaType>({
    resolver: zodResolver(CreateTransactionSchema),
    defaultValues: {
      type,
      date: new Date(),
    }
  })
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Create a new{""}
            <span className={cn(
              "m-1",
              type === "income" ? "text-emerald-500" : "text-red-500"
            )}>
              {type}
            </span>
            transaction
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className='space-y-4'>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input defaultValue={""} {...field} />
                  </FormControl>
                  <FormDescription>
                    Transaction description (optional)
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input defaultValue={""} {...field} type='number' />
                  </FormControl>
                  <FormDescription>
                    Transaction amount (require)
                  </FormDescription>
                </FormItem>
              )}
            />

            <div className='flex items-center justify-between gap-2'>
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <CategoryPicker type={type} />
                    </FormControl>
                    <FormDescription>
                      Select a category for this transaction
                    </FormDescription>
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateTransactionDialog;
