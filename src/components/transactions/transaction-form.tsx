'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Transaction, Category } from '@/lib/supabase/types'
import { createTransaction, updateTransaction } from '@/lib/actions/transactions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

const INCOME_CATEGORIES: Category[] = ['Salário', 'Freelance', 'Investimentos', 'Outros']
const EXPENSE_CATEGORIES: Category[] = [
  'Alimentação', 'Transporte', 'Moradia', 'Saúde',
  'Educação', 'Lazer', 'Roupas', 'Outros',
]

const schema = z.object({
  type: z.enum(['income', 'expense']),
  amount: z.string().min(1, 'Informe o valor').refine(
    (v) => !isNaN(parseFloat(v.replace(',', '.'))) && parseFloat(v.replace(',', '.')) > 0,
    'Valor inválido'
  ),
  category: z.string().min(1, 'Selecione uma categoria'),
  description: z.string().min(1, 'Informe uma descrição'),
  date: z.string().min(1, 'Informe a data'),
})

type FormValues = z.infer<typeof schema>

interface Props {
  open: boolean
  onClose: () => void
  transaction?: Transaction
}

export default function TransactionForm({ open, onClose, transaction }: Props) {
  const isEditing = !!transaction
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: transaction
      ? {
          type: transaction.type,
          amount: String(transaction.amount),
          category: transaction.category,
          description: transaction.description,
          date: transaction.date,
        }
      : {
          type: 'expense',
          amount: '',
          category: '',
          description: '',
          date: new Date().toISOString().split('T')[0],
        },
  })

  const selectedType = watch('type')
  const categories = selectedType === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES

  async function onSubmit(values: FormValues) {
    setLoading(true)
    const amount = parseFloat(values.amount.replace(',', '.'))

    const payload = {
      type: values.type,
      amount,
      category: values.category as Category,
      description: values.description,
      date: values.date,
    }

    const result = isEditing
      ? await updateTransaction(transaction.id, payload)
      : await createTransaction(payload)

    setLoading(false)

    if (result.error) {
      toast.error(result.error)
      return
    }

    toast.success(isEditing ? 'Transação atualizada!' : 'Transação criada!')
    reset()
    onClose()
  }

  function handleClose() {
    reset()
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Transação' : 'Nova Transação'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Tipo */}
          <div className="grid grid-cols-2 gap-2">
            {(['expense', 'income'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => { setValue('type', t); setValue('category', '') }}
                className={`py-2 rounded-lg text-sm font-medium border transition-colors ${
                  selectedType === t
                    ? t === 'expense'
                      ? 'bg-red-600 text-white border-red-600'
                      : 'bg-green-600 text-white border-green-600'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {t === 'expense' ? '▼ Despesa' : '▲ Receita'}
              </button>
            ))}
          </div>

          {/* Valor */}
          <div className="space-y-1">
            <Label htmlFor="amount">Valor (R$)</Label>
            <Input
              id="amount"
              placeholder="0,00"
              {...register('amount')}
            />
            {errors.amount && <p className="text-xs text-red-500">{errors.amount.message}</p>}
          </div>

          {/* Categoria */}
          <div className="space-y-1">
            <Label>Categoria</Label>
            <Select
              value={watch('category')}
              onValueChange={(v) => v && setValue('category', v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && <p className="text-xs text-red-500">{errors.category.message}</p>}
          </div>

          {/* Descrição */}
          <div className="space-y-1">
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              placeholder="Ex: Supermercado, Salário..."
              {...register('description')}
            />
            {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
          </div>

          {/* Data */}
          <div className="space-y-1">
            <Label htmlFor="date">Data</Label>
            <Input id="date" type="date" {...register('date')} />
            {errors.date && <p className="text-xs text-red-500">{errors.date.message}</p>}
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? 'Salvando...' : isEditing ? 'Atualizar' : 'Adicionar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
