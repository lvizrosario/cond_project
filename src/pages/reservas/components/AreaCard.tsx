import { PartyPopper, Flame, Trophy } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AREA_LABELS, AREA_CAPACITY, type AreaCondominio } from '@/types/reservas.types'
import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

const AREA_ICONS: Record<AreaCondominio, LucideIcon> = {
  salao_festas: PartyPopper,
  churrasqueira: Flame,
  quadra: Trophy,
}

const AREA_DESC: Record<AreaCondominio, string> = {
  salao_festas: 'Espaço climatizado com cozinha, som e iluminação especial.',
  churrasqueira: 'Área coberta com churrasqueiras e mesas de apoio.',
  quadra: 'Quadra poliesportiva para vôlei, basquete e futsal.',
}

interface AreaCardProps {
  area: AreaCondominio
  selected: boolean
  onSelect: () => void
}

export function AreaCard({ area, selected, onSelect }: AreaCardProps) {
  const Icon = AREA_ICONS[area]
  return (
    <Card className={cn('cursor-pointer transition-all', selected && 'ring-2 ring-[var(--color-brand-500)]')}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
            selected ? 'bg-[var(--color-brand-500)] text-white' : 'bg-[var(--color-brand-100)] text-[var(--color-brand-500)]')}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-display font-semibold text-[var(--color-text-primary)]">{AREA_LABELS[area]}</p>
            <p className="text-xs text-[var(--color-text-muted)] mb-1">{AREA_CAPACITY[area]}</p>
            <p className="text-xs text-[var(--color-text-secondary)]">{AREA_DESC[area]}</p>
          </div>
        </div>
        <Button size="sm" variant={selected ? 'default' : 'outline'} className="w-full mt-3" onClick={onSelect}>
          {selected ? 'Selecionado' : 'Ver disponibilidade'}
        </Button>
      </CardContent>
    </Card>
  )
}
