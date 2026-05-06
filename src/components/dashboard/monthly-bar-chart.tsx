'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { useTheme } from 'next-themes'
import { Transaction } from '@/lib/supabase/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const MONTHS_SHORT = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(value)
}

export default function MonthlyBarChart({ transactions }: { transactions: Transaction[] }) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  const gridColor = isDark ? 'rgba(255,255,255,0.08)' : '#f1f5f9'
  const tickColor = isDark ? '#94a3b8' : '#64748b'
  const tooltipStyle = {
    borderRadius: '8px',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0'}`,
    backgroundColor: isDark ? '#1c1c1c' : '#ffffff',
    color: isDark ? '#f8fafc' : '#0f172a',
  }

  const dataMap: Record<number, { income: number; expense: number }> = {}
  for (let i = 1; i <= 12; i++) dataMap[i] = { income: 0, expense: 0 }

  transactions.forEach((t) => {
    const month = new Date(t.date + 'T00:00:00').getMonth() + 1
    if (t.type === 'income') dataMap[month].income += t.amount
    else dataMap[month].expense += t.amount
  })

  const data = Object.entries(dataMap).map(([month, values]) => ({
    name: MONTHS_SHORT[parseInt(month) - 1],
    Receitas: values.income,
    Despesas: values.expense,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Receitas vs Despesas (Ano)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: tickColor }} />
            <YAxis
              tickFormatter={(v: number) => `R$${(v / 1000).toFixed(0)}k`}
              tick={{ fontSize: 11, fill: tickColor }}
            />
            <Tooltip
              formatter={(value) => formatCurrency(Number(value))}
              contentStyle={tooltipStyle}
            />
            <Legend
              formatter={(v) => (
                <span style={{ fontSize: '12px', color: tickColor }}>{v}</span>
              )}
            />
            <Bar dataKey="Receitas" fill="#10B981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Despesas" fill="#EF4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
