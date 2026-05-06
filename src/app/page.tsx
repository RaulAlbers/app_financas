import Link from 'next/link'
import {
  Wallet,
  BarChart3,
  ArrowLeftRight,
  ShieldCheck,
  TrendingUp,
  PieChart,
  ChevronRight,
} from 'lucide-react'
import { ThemeToggle } from '@/components/ui/theme-toggle'

const features = [
  {
    icon: BarChart3,
    title: 'Dashboard Visual',
    description: 'Veja um resumo completo das suas finanças em gráficos claros e intuitivos.',
  },
  {
    icon: ArrowLeftRight,
    title: 'Controle de Transações',
    description: 'Registre receitas e despesas com categorias para saber exatamente para onde vai seu dinheiro.',
  },
  {
    icon: TrendingUp,
    title: 'Análise Mensal',
    description: 'Compare meses e acompanhe a evolução do seu saldo ao longo do tempo.',
  },
  {
    icon: PieChart,
    title: 'Gastos por Categoria',
    description: 'Identifique onde você gasta mais e tome decisões mais inteligentes.',
  },
  {
    icon: ShieldCheck,
    title: 'Dados Seguros',
    description: 'Sua conta é protegida com autenticação segura via Supabase.',
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Wallet className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-lg">FinançasPessoais</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/login"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Entrar
            </Link>
            <Link
              href="/register"
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              Começar grátis
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-b from-muted/40 to-background py-24 px-4 sm:px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-blue-600/10 text-blue-500 dark:text-blue-400 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
              <TrendingUp className="h-4 w-4" />
              Controle financeiro simples e poderoso
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight mb-6">
              Suas finanças,{' '}
              <span className="text-blue-600 dark:text-blue-400">sob controle</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Registre receitas e despesas, visualize gráficos mensais e tome decisões financeiras mais inteligentes — tudo em um só lugar.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors text-base shadow-lg shadow-blue-900/30"
              >
                Criar conta gratuita
                <ChevronRight className="h-5 w-5" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 border border-border hover:bg-muted text-foreground font-semibold px-8 py-3.5 rounded-xl transition-colors text-base"
              >
                Já tenho conta
              </Link>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-12 px-4 sm:px-6 border-y border-border bg-background">
          <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {[
              { value: '100%', label: 'Gratuito' },
              { value: 'Real-time', label: 'Dados em tempo real' },
              { value: 'Seguro', label: 'Auth protegida' },
            ].map(({ value, label }) => (
              <div key={label}>
                <p className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">{value}</p>
                <p className="text-muted-foreground mt-1 text-sm">{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="py-20 px-4 sm:px-6 bg-muted/20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Tudo o que você precisa para gerenciar seu dinheiro
              </h2>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                Ferramentas simples, resultado concreto. Sem complicação.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="bg-blue-600/10 w-11 h-11 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-semibold mb-2">{title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-4 sm:px-6 bg-blue-600 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Comece agora, é gratuito
            </h2>
            <p className="text-blue-100 text-lg mb-8">
              Crie sua conta em segundos e comece a controlar suas finanças hoje mesmo.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-blue-600 font-bold px-8 py-3.5 rounded-xl transition-colors text-base shadow-lg"
            >
              Criar conta gratuita
              <ChevronRight className="h-5 w-5" />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 border-t border-border bg-background text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="bg-blue-600 p-1.5 rounded-md">
            <Wallet className="h-4 w-4 text-white" />
          </div>
          <span className="font-semibold">FinançasPessoais</span>
        </div>
        <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} — Gerencie suas finanças com simplicidade</p>
      </footer>
    </div>
  )
}
