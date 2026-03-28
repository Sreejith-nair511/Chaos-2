'use client'

import { DashboardState } from '@/app/page'

interface MicroserviceGridProps {
  state: DashboardState
}

const SERVICES = [
  { id: 'edge_device_service', name: 'Edge Device' },
  { id: 'device_service', name: 'Device Manager' },
  { id: 'telemetry_service', name: 'Telemetry' },
  { id: 'detection_service', name: 'Detection' },
  { id: 'recovery_service', name: 'Recovery' },
  { id: 'orchestrator_service', name: 'Orchestrator' },
]

function ServiceCard({
  id,
  name,
  status,
}: {
  id: string
  name: string
  status: 'RUNNING' | 'RESTARTING'
}) {
  const isRunning = status === 'RUNNING'

  return (
    <div
      className={`cyber-border rounded-lg p-3 sm:p-4 space-y-2 sm:space-y-3 transition-all duration-300 ${
        isRunning ? 'glow-green' : 'glow-yellow'
      }`}
    >
      <div className="flex items-center justify-between">
        <div
          className={`w-2.5 h-2.5 rounded-full ${
            isRunning ? 'bg-green-500 pulse-glow' : 'bg-yellow-500 animate-pulse'
          }`}
        ></div>
      </div>

      <div>
        <h3 className="font-semibold text-xs sm:text-sm text-foreground">{name}</h3>
        <p className="text-xs font-mono text-muted-foreground mt-1">{id}</p>
      </div>

      <div
        className={`inline-block px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${
          isRunning
            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
            : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
        }`}
      >
        {isRunning ? 'RUNNING' : 'RESTARTING'}
      </div>
    </div>
  )
}

export default function MicroserviceGrid({ state }: MicroserviceGridProps) {
  return (
    <div className="cyber-border rounded-lg p-4 sm:p-6 space-y-4">
      <h2 className="text-base sm:text-lg font-semibold text-foreground">Microservices Cluster</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4">
        {SERVICES.map((service) => (
          <ServiceCard
            key={service.id}
            id={service.id}
            name={service.name}
            status={state.services[service.id as keyof typeof state.services]}
          />
        ))}
      </div>

      <div className="text-xs text-muted-foreground pt-2 border-t border-border">
        <p>
          {Object.values(state.services).filter((s) => s === 'RUNNING').length} / {SERVICES.length} services running
        </p>
      </div>
    </div>
  )
}
