import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Sidebar from '@/components/layout/sidebar'
import { Toaster } from '@/components/ui/sonner'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar userEmail={user.email ?? ''} />
      <main className="flex-1 p-4 md:p-8 overflow-auto">
        {children}
      </main>
      <Toaster richColors position="top-right" />
    </div>
  )
}
