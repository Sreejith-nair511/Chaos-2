'use client'

import { DashboardState } from '@/app/page'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface GraphPanelProps {
  state: DashboardState
}

export default function GraphPanel({ state }: GraphPanelProps) {
  const data = state.cpu_history.map((cpu, index) => ({
    time: index,
    cpu: parseFloat(cpu.toFixed(1)),
    memory: parseFloat(state.memory_history[index]?.toFixed(1) || '0'),
    delay: parseFloat(state.delay_history[index]?.toFixed(2) || '0'),
  }))

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-xl">
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-xs font-mono">
              {entry.name}: {entry.value.toFixed(2)}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="cyber-border rounded-lg p-4 sm:p-6 space-y-4">
      <h2 className="text-base sm:text-lg font-semibold text-foreground">System Metrics Timeline</h2>

      <div className="overflow-x-auto">
        <ResponsiveContainer width="100%" height={250}>
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
          >
            <defs>
              <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00d9ff" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#00d9ff" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorMemory" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorDelay" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(26, 40, 71, 0.5)"
              vertical={false}
            />
            <XAxis
              dataKey="time"
              stroke="rgba(139, 146, 185, 0.5)"
              style={{ fontSize: '12px' }}
              tick={false}
            />
            <YAxis
              stroke="rgba(139, 146, 185, 0.5)"
              style={{ fontSize: '12px' }}
              yAxisId="left"
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="rgba(139, 146, 185, 0.5)"
              style={{ fontSize: '12px' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ color: '#e0e6ff', fontSize: '12px' }} />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="cpu"
              stroke="#00d9ff"
              strokeWidth={2}
              dot={false}
              name="CPU %"
              fillOpacity={1}
              fill="url(#colorCpu)"
              isAnimationActive={false}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="memory"
              stroke="#7c3aed"
              strokeWidth={2}
              dot={false}
              name="Memory %"
              fillOpacity={1}
              fill="url(#colorMemory)"
              isAnimationActive={false}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="delay"
              stroke="#ec4899"
              strokeWidth={2}
              dot={false}
              name="Delay (s)"
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="text-xs text-muted-foreground text-center pt-2">
        Last 30 seconds • Updated every 1s
      </div>
    </div>
  )
}
