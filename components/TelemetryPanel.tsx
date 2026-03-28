'use client'

import { DashboardState } from '@/app/page'

interface TelemetryPanelProps {
  state: DashboardState
}

function MetricBar({
  label,
  value,
  max = 100,
  unit = '%',
}: {
  label: string
  value: number
  max?: number
  unit?: string
}) {
  const percentage = (value / max) * 100

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="text-cyan-400 font-mono font-semibold">{value.toFixed(1)}{unit}</span>
      </div>
      <div className="w-full h-2 bg-secondary rounded-full overflow-hidden relative border border-border">
        <div
          className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300 rounded-full"
          style={{ width: `${Math.min(percentage, 100)}%` }}
        ></div>
        <div className="absolute inset-0 opacity-30 glow-cyan"></div>
      </div>
    </div>
  )
}

export default function TelemetryPanel({ state }: TelemetryPanelProps) {
  return (
    <div className="cyber-border rounded-lg p-4 sm:p-6 space-y-4 sm:space-y-6 lg:col-span-3">
      <h2 className="text-base sm:text-lg font-semibold text-foreground">Live Telemetry</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <MetricBar
            label="CPU Usage"
            value={state.cpu_usage}
            max={100}
            unit="%"
          />
          <MetricBar
            label="Memory Usage"
            value={state.memory_usage}
            max={100}
            unit="%"
          />
        </div>

        <div className="space-y-4">
          <MetricBar
            label="Packet Loss"
            value={state.packet_loss}
            max={5}
            unit="ms"
          />
          <MetricBar
            label="Response Time"
            value={state.response_time}
            max={2}
            unit="s"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Heartbeat Delay</p>
          <p className="text-2xl font-mono text-purple-400 font-bold">
            {state.heartbeat_delay.toFixed(3)}s
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Anomaly Score</p>
          <p className={`text-2xl font-mono font-bold ${
            state.anomaly_score > 1.2
              ? 'text-red-400'
              : state.anomaly_score > 0.8
              ? 'text-yellow-400'
              : 'text-green-400'
          }`}>
            {state.anomaly_score.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  )
}
