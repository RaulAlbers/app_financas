import { Suspense } from 'react'
import DashboardClient from './dashboard-client'
import { getTransactions } from '@/lib/actions/transactions'

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; year?: string }>
}) {
  const params = await searchParams
  const now = new Date()
  const month = params.month ? parseInt(params.month) : now.getMonth() + 1
  const year = params.year ? parseInt(params.year) : now.getFullYear()

  const [{ data: monthTransactions = [] }, { data: yearTransactions = [] }] = await Promise.all([
    getTransactions({ month, year }),
    getTransactions({ year }),
  ])

  return (
    <Suspense fallback={null}>
      <DashboardClient
        monthTransactions={monthTransactions ?? []}
        yearTransactions={yearTransactions ?? []}
        currentMonth={month}
        currentYear={year}
      />
    </Suspense>
  )
}
