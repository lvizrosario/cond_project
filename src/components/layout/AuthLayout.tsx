import type { ReactNode } from 'react'
import { Building2 } from 'lucide-react'

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-[420px] flex-col justify-between bg-[var(--color-brand-800)] p-10 text-white">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-accent-500)]">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <span className="font-display font-semibold text-lg">CondAdmin</span>
        </div>
        <div>
          <blockquote className="text-2xl font-display font-medium leading-snug text-white mb-4">
            "Gestão de condomínio de forma simples, eficiente e acessível."
          </blockquote>
          <p className="text-sm text-white/60">Residencial das Acácias • Brasília, DF</p>
        </div>
        <p className="text-xs text-white/40">© 2026 CondAdmin. Todos os direitos reservados.</p>
      </div>

      {/* Right panel */}
      <div className="flex flex-1 items-center justify-center p-6 bg-[var(--color-surface)]">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex items-center justify-center gap-2 mb-8 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-accent-500)]">
              <Building2 className="h-4 w-4 text-white" />
            </div>
            <span className="font-display font-semibold text-[var(--color-brand-900)]">CondAdmin</span>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
