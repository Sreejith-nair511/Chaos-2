'use client'

import { DashboardState } from '@/app/page'

interface KubernetesFlowProps {
  state: DashboardState
}

interface Node {
  id: string
  label: string
  icon: string
}

const NODES: Node[] = [
  { id: 'edge', label: 'Edge Device', icon: 'ED' },
  { id: 'telemetry', label: 'Telemetry Engine', icon: 'TE' },
  { id: 'detection', label: 'Detection System', icon: 'DS' },
  { id: 'recovery', label: 'Recovery Handler', icon: 'RH' },
  { id: 'orchestrator', label: 'Orchestrator', icon: 'OR' },
]

function FlowNode({
  node,
  isRestarting,
  isActive,
}: {
  node: Node
  isRestarting: boolean
  isActive: boolean
}) {
  return (
    <div
      className={`flex flex-col items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-lg border-2 transition-all duration-300 ${
        isRestarting
          ? 'border-yellow-500 bg-yellow-500/10 glow-yellow'
          : isActive
          ? 'border-green-500 bg-green-500/10 glow-green'
          : 'border-blue-500 bg-blue-500/10 glow-cyan'
      }`}
    >
      <span className="text-base sm:text-2xl font-bold text-foreground">{node.icon}</span>
      <span className="text-xs font-semibold text-foreground text-center whitespace-nowrap">
        {node.label}
      </span>
      {isRestarting && <span className="text-xs text-yellow-400 animate-pulse">Restarting...</span>}
      {isActive && <span className="text-xs text-green-400">Active</span>}
    </div>
  )
}

export default function KubernetesFlow({ state }: KubernetesFlowProps) {
  const isDetectionRestarting = state.services.detection_service === 'RESTARTING'
  const isRecoveryRestarting = state.services.recovery_service === 'RESTARTING'

  return (
    <div className="cyber-border rounded-lg p-4 sm:p-6 space-y-4 sm:space-y-6">
      <h2 className="text-base sm:text-lg font-semibold text-foreground">Kubernetes Pod Orchestration</h2>

      <div className="overflow-x-auto pb-4">
        <div className="flex items-center justify-between gap-2 min-w-min px-2">
          {NODES.map((node, index) => (
            <div key={node.id} className="flex items-center gap-2">
              <FlowNode
                node={node}
                isRestarting={
                  (node.id === 'detection' && isDetectionRestarting) ||
                  (node.id === 'recovery' && isRecoveryRestarting)
                }
                isActive={state.system_active}
              />
              {index < NODES.length - 1 && (
                <div className="flex flex-col items-center gap-1 px-3">
                  <div
                    className={`h-1 w-8 transition-all duration-300 ${
                      state.system_active
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-500'
                        : 'bg-gray-600'
                    }`}
                  ></div>
                  <span className="text-xs text-muted-foreground">→</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-border pt-4 space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Flow Status</h3>

        {state.status === 'HEALTHY' && (
          <div className="flex items-center gap-2 text-sm p-3 rounded-lg bg-green-500/10 border border-green-500/30">
            <span className="text-lg">✓</span>
            <span className="text-green-400">All pods running normally</span>
          </div>
        )}

        {state.status === 'DETECTING' && (
          <div className="flex items-center gap-2 text-sm p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
            <span className="text-lg">⚠</span>
            <span className="text-yellow-400">Anomaly detected - monitoring in progress</span>
          </div>
        )}

        {state.status === 'FAILURE' && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm p-3 rounded-lg bg-red-500/10 border border-red-500/30">
              <span className="text-lg">✕</span>
              <span className="text-red-400">System failure detected</span>
            </div>
            <div className="flex items-center gap-2 text-sm p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
              <span className="text-lg animate-spin">⟳</span>
              <span className="text-yellow-400">Kubernetes restarting detection & recovery pods...</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 text-xs pt-2">
          <div className="p-2 rounded-lg bg-secondary">
            <p className="text-muted-foreground">Detection Service</p>
            <p className="font-semibold text-cyan-400 mt-1">
              {state.services.detection_service === 'RUNNING' ? '🟢 RUNNING' : '🟡 RESTARTING'}
            </p>
          </div>
          <div className="p-2 rounded-lg bg-secondary">
            <p className="text-muted-foreground">Recovery Service</p>
            <p className="font-semibold text-cyan-400 mt-1">
              {state.services.recovery_service === 'RUNNING' ? '🟢 RUNNING' : '🟡 RESTARTING'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
