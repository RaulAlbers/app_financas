import { Suspense } from 'react'
import TransactionsClient from './transactions-client'
import { getTransactions } from '@/lib/actions/transactions'

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; year?: string; category?: string; type?: string }>
}) {
  const params = await searchParams
  const now = new Date()
  const month = params.month ? parseInt(params.month) : now.getMonth() + 1
  const year = params.year ? parseInt(params.year) : now.getFullYear()

  const { data: transactions = [] } = await getTransactions({
    month,
    year,
    category: params.category,
    type: params.type,
  })

  return (
    <Suspense fallback={null}>
      <TransactionsClient
        transactions={transactions ?? []}
        currentMonth={month}
        currentYear={year}
        currentCategory={params.category ?? 'all'}
        currentType={params.type ?? 'all'}
      />
    </Suspense>
  )
}
