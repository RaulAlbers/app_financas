'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import { Transaction } from '@/lib/supabase/types'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import SummaryCards from '@/components/dashboard/summary-cards'
import ExpensesChart from '@/components/dashboard/expenses-chart'
import MonthlyBarChart from '@/components/dashboard/monthly-bar-chart'
import TransactionForm from '@/components/transactions/transaction-form'
import TransactionList from '@/components/transactions/transaction-list'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

const currentYear = new Date().getFullYear()
const YEARS = [currentYear - 2, currentYear - 1, currentYear, currentYear + 1]

interface Props {
  monthTransactions: Transaction[]
  yearTransactions: Transaction[]
  currentMonth: number
  currentYear: number
}

export default function DashboardClient({
  monthTransactions,
  yearTransactions,
  currentMonth,
  currentYear,
}: Props) {
  const router = useRouter()
  const [formOpen, setFormOpen] = useState(false)

  const totalIncome = monthTransactions
    .filter((t) => t.type === 'income')
    .reduce((s, t) => s + t.amount, 0)

  const totalExpenses = monthTransactions
    .filter((t) => t.type === 'expense')
    .reduce((s, t) => s + t.amount, 0)

  const balance = totalIncome - totalExpenses

  function updateFilter(key: string, value: string | null) {
    if (!value) return
    const params = new URLSearchParams({
      month: String(currentMonth),
      year: String(currentYear),
      [key]: value,
    })
    router.push(`/dashboard?${params.toString()}`)
  }

  const recentTransactions = [...monthTransactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  return (
    <div className="space-y-6 pt-14 md:pt-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Resumo financeiro mensal</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={String(currentMonth)} onValueChange={(v) => updateFilter('month', v)}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MONTHS.map((m, i) => (
                <SelectItem key={i + 1} value={String(i + 1)}>{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={String(currentYear)} onValueChange={(v) => updateFilter('year', v)}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {YEARS.map((y) => (
                <SelectItem key={y} value={String(y)}>{y}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={() => setFormOpen(true)} className="gap-2 whitespace-nowrap">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Nova Transação</span>
          </Button>
        </div>
      </div>

      {/* Cards de resumo */}
      <SummaryCards
        totalIncome={totalIncome}
        totalExpenses={totalExpenses}
        balance={balance}
      />

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ExpensesChart transactions={monthTransactions} />
        <MonthlyBarChart transactions={yearTransactions} />
      </div>

      {/* Últimas transações */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-base">Últimas Transações</CardTitle>
          <Button variant="ghost" size="sm" className="text-blue-600 text-xs" onClick={() => router.push('/transactions')}>
            Ver todas
          </Button>
        </CardHeader>
        <CardContent className="p-0 md:p-6">
          <TransactionList transactions={recentTransactions} />
        </CardContent>
      </Card>

      <TransactionForm open={formOpen} onClose={() => setFormOpen(false)} />
    </div>
  )
}
