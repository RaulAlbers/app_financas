'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Pencil, Trash2, TrendingUp, TrendingDown } from 'lucide-react'
import { Transaction } from '@/lib/supabase/types'
import { deleteTransaction } from '@/lib/actions/transactions'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import TransactionForm from './transaction-form'
import { toast } from 'sonner'

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

export default function TransactionList({ transactions }: { transactions: Transaction[] }) {
  const [editingTx, setEditingTx] = useState<Transaction | null>(null)

  async function handleDelete(id: string) {
    if (!confirm('Confirmar exclusão?')) return
    const result = await deleteTransaction(id)
    if (result.error) toast.error(result.error)
    else toast.success('Transação excluída!')
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <TrendingDown className="h-12 w-12 mx-auto mb-3 opacity-30" />
        <p className="text-sm">Nenhuma transação encontrada</p>
      </div>
    )
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="text-right">Valor</TableHead>
              <TableHead className="w-24"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((tx) => (
              <TableRow key={tx.id}>
                <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                  {format(new Date(tx.date + 'T00:00:00'), 'dd/MM/yyyy', { locale: ptBR })}
                </TableCell>
                <TableCell className="font-medium">{tx.description}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="text-xs">{tx.category}</Badge>
                </TableCell>
                <TableCell>
                  {tx.type === 'income' ? (
                    <span className="flex items-center gap-1 text-green-600 text-sm">
                      <TrendingUp className="h-3 w-3" /> Receita
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-red-600 text-sm">
                      <TrendingDown className="h-3 w-3" /> Despesa
                    </span>
                  )}
                </TableCell>
                <TableCell className={`text-right font-semibold ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                  {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1 justify-end">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditingTx(tx)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(tx.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {transactions.map((tx) => (
          <div key={tx.id} className="bg-card rounded-lg border border-border p-4 flex items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{tx.description}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">{tx.category}</Badge>
                <span className="text-xs text-muted-foreground">
                  {format(new Date(tx.date + 'T00:00:00'), 'dd/MM/yy', { locale: ptBR })}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`font-semibold text-sm ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
              </span>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditingTx(tx)}>
                <Pencil className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500" onClick={() => handleDelete(tx.id)}>
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {editingTx && (
        <TransactionForm
          open={!!editingTx}
          onClose={() => setEditingTx(null)}
          transaction={editingTx}
        />
      )}
    </>
  )
}
