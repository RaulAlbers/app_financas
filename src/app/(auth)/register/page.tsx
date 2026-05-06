'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { Wallet, Mail, AlertCircle } from 'lucide-react'

function EmailConfirmationCard({ email }: { email: string }) {
  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="space-y-1 text-center pb-2">
        <div className="flex justify-center mb-4">
          <div className="relative">
            <div className="bg-blue-50 p-5 rounded-full">
              <Mail className="h-10 w-10 text-blue-600" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-5 w-5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-5 w-5 bg-blue-500" />
            </span>
          </div>
        </div>
        <CardTitle className="text-2xl font-bold">Confirme seu e-mail</CardTitle>
        <CardDescription className="text-base">
          Enviamos um link de confirmação para
        </CardDescription>
        <p className="font-semibold text-slate-800 text-sm break-all">{email}</p>
      </CardHeader>

      <CardContent className="space-y-4 pt-4">
        <div className="bg-blue-50 rounded-xl p-4 space-y-2 text-sm text-blue-800">
          <p className="font-semibold">Como confirmar sua conta:</p>
          <ol className="list-decimal list-inside space-y-1 text-blue-700">
            <li>Abra sua caixa de entrada</li>
            <li>Procure o e-mail de <span className="font-medium">FinançasPessoais</span></li>
            <li>Clique no botão <span className="font-medium">"Confirmar e-mail"</span></li>
            <li>Você será redirecionado para entrar na sua conta</li>
          </ol>
        </div>

        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-amber-500" />
          <p>
            Não encontrou o e-mail?{' '}
            <strong>Verifique a pasta de spam ou lixo eletrônico.</strong>{' '}
            O envio pode levar alguns minutos.
          </p>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-3 pt-2">
        <Link href="/login" className="w-full">
          <Button variant="outline" className="w-full">
            Ir para o login
          </Button>
        </Link>
        <p className="text-xs text-muted-foreground text-center">
          E-mail errado?{' '}
          <Link href="/register" className="text-blue-600 hover:underline font-medium">
            Voltar ao cadastro
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submittedEmail, setSubmittedEmail] = useState('')

  async function handleRegister(e: { preventDefault(): void }) {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error('As senhas não coincidem')
      return
    }

    if (password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres')
      return
    }

    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signUp({ email, password })

    if (error) {
      toast.error(error.message)
      setLoading(false)
      return
    }

    setSubmittedEmail(email)
    setSubmitted(true)
  }

  if (submitted) {
    return <EmailConfirmationCard email={submittedEmail} />
  }

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="space-y-1 text-center">
        <div className="flex justify-center mb-2">
          <div className="bg-blue-600 p-3 rounded-full">
            <Wallet className="h-6 w-6 text-white" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold">Criar Conta</CardTitle>
        <CardDescription>Comece a organizar suas finanças hoje</CardDescription>
      </CardHeader>
      <form onSubmit={handleRegister}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Senha</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Criando conta...' : 'Criar Conta'}
          </Button>
          <p className="text-sm text-muted-foreground text-center">
            Já tem conta?{' '}
            <Link href="/login" className="text-blue-600 hover:underline font-medium">
              Entrar
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
