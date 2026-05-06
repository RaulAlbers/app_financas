'use client'

import {
  PieChart,
  Pie,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { useTheme } from 'next-themes'
import { Transaction } from '@/lib/supabase/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const COLORS = [
  '#3B82F6', '#EF4444', '#10B981', '#F59E0B',
  '#8B5CF6', '#EC4899', '#14B8A6', '#F97316',
]

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

export default function ExpensesChart({ transactions }: { transactions: Transaction[] }) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  const tooltipStyle = {
    borderRadius: '8px',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0'}`,
    backgroundColor: isDark ? '#1c1c1c' : '#ffffff',
    color: isDark ? '#f8fafc' : '#0f172a',
  }

  const expenses = transactions.filter((t) => t.type === 'expense')

  const dataMap = expenses.reduce<Record<string, number>>((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount
    return acc
  }, {})

  const data = Object.entries(dataMap)
    .map(([name, value], index) => ({ name, value, fill: COLORS[index % COLORS.length] }))
    .sort((a, b) => b.value - a.value)

  const legendColor = isDark ? '#94a3b8' : '#64748b'

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Despesas por Categoria</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">
            Nenhuma despesa no período
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Despesas por Categoria</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={3}
              dataKey="value"
            />

            <Tooltip
              formatter={(value) => [formatCurrency(Number(value)), 'Valor']}
              contentStyle={tooltipStyle}
            />
            <Legend
              formatter={(value) => (
                <span style={{ fontSize: '12px', color: legendColor }}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
