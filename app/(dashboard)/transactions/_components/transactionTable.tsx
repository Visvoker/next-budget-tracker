"use client"

import React from 'react'

interface TransactionTableProps {
  from: Date,
  to: Date,
}

const TransactionTable = ({
  from,
  to,
}: TransactionTableProps) => {
  return (
    <div>
      TransactionTable
    </div>
  )
}

export default TransactionTable
