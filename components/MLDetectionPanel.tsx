'use client'

import { DashboardState } from '@/app/page'

interface MLDetectionPanelProps {
  state: DashboardState
}

export default function MLDetectionPanel({ state }: MLDetectionPanelProps) {
  const getStatusColor = () => {
    switch (state.status) {
      case 'HEALTHY':
        return 'from-green-500 to-emerald-500'
      case 'DETECTING':
        return 'from-yellow-500 to-orange-500'
      case 'FAILURE':
        return 'from-red-500 to-pink-500'
      default:
        return 'from-cyan-500 to-blue-500'
    }
  }

  const getStatusGlow = () => {
    switch (state.status) {
      case 'HEALTHY':
        return 'glow-green'
      case 'DETECTING':
        return 'glow-yellow'
      case 'FAILURE':
        return 'glow-red'
      default:
        return 'glow-cyan'
    }
  }

  const getStatusText = () => {
    switch (state.status) {
      case 'HEALTHY':
        return 'HEALTHY'
      case 'DETECTING':
        return 'DETECTING ANOMALY'
      case 'FAILURE':
        return 'FAILURE DETECTED'
      default:
        return 'UNKNOWN'
    }
  }

  const isAnomalous = state.status !== 'HEALTHY'

  return (
    <div className={`cyber-border rounded-lg p-4 sm:p-6 space-y-4 lg:col-span-1 ${getStatusGlow()}`}>
      <h2 className="text-base sm:text-lg font-semibold text-foreground">ML Anomaly Detection</h2>

      <div className="space-y-4">
        <div>
          <p className="text-xs text-muted-foreground mb-2">Anomaly Score</p>
          <div className="relative">
            <div className="h-12 rounded-lg bg-gradient-to-r from-gray-700 to-gray-800 border border-border flex items-center justify-center overflow-hidden">
              <div
                className={`absolute inset-0 bg-gradient-to-r ${getStatusColor()} opacity-20 transition-all duration-300`}
                style={{
                  width: `${Math.min((state.anomaly_score / 2) * 100, 100)}%`,
                }}
              ></div>
              <span className={`relative font-mono text-xl font-bold bg-gradient-to-r ${getStatusColor()} bg-clip-text text-transparent`}>
                {state.anomaly_score.toFixed(2)}
              </span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {state.anomaly_score > 1.2
              ? 'Critical: System failure detected'
              : state.anomaly_score > 0.8
              ? 'Warning: Anomalies detected'
              : 'Normal: All systems healthy'}
          </p>
        </div>

        <div className="border-t border-border pt-4">
          <div
            className={`inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full font-semibold text-xs sm:text-sm transition-all duration-300 ${
              state.status === 'HEALTHY'
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : state.status === 'DETECTING'
                ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 animate-pulse'
                : 'bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-current"></span>
            {getStatusText()}
          </div>
        </div>

        {isAnomalous && (
          <div className="bg-secondary/50 border border-border rounded-lg p-3 space-y-1">
            <p className="text-xs font-semibold text-foreground">Detection Factors:</p>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Response Time: {state.response_time.toFixed(2)}s (weight: 60%)</li>
              <li>• CPU Usage: {state.cpu_usage.toFixed(1)}% (weight: 1%)</li>
              <li>• Packet Loss: {state.packet_loss.toFixed(2)}ms (weight: 20%)</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
