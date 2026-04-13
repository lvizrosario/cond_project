import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { formatBRL } from '@/lib/formatters'
import type { MonthlyRevenue } from '@/types/dashboard.types'

interface RevenueChartProps {
  data: MonthlyRevenue[]
}

function BRLTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-white p-3 shadow-md text-xs">
      <p className="font-semibold mb-2">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>{p.name}: {formatBRL(p.value)}</p>
      ))}
    </div>
  )
}

export function RevenueChart({ data }: RevenueChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Receita do Condomínio</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={240}>
          <ComposedChart data={data} margin={{ top: 4, right: 8, left: 8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="mes" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis
              tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`}
              tick={{ fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<BRLTooltip />} />
            <Legend
              formatter={(value) =>
                value === 'receitaPrevista' ? 'Prevista' : 'Realizada'
              }
              wrapperStyle={{ fontSize: 12 }}
            />
            <Bar dataKey="receitaPrevista" name="receitaPrevista" fill="var(--color-brand-100)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="receitaRealizada" name="receitaRealizada" fill="var(--color-brand-500)" radius={[4, 4, 0, 0]} />
            <Line type="monotone" dataKey="receitaRealizada" stroke="var(--color-accent-500)" strokeWidth={2} dot={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
