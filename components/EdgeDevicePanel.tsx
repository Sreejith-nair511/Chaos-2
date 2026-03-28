'use client'

import { DashboardState } from '@/app/page'

interface EdgeDevicePanelProps {
  state: DashboardState
  onConnect: () => void
  onToggleSimulate: () => void
}

export default function EdgeDevicePanel({
  state,
  onConnect,
  onToggleSimulate,
}: EdgeDevicePanelProps) {
  return (
    <div className="cyber-border rounded-lg p-4 sm:p-6 space-y-4 lg:col-span-1">
      <div className="flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-semibold text-foreground">Edge Device</h2>
        <div
          className={`w-3 h-3 rounded-full ${
            state.system_active ? 'bg-green-500 pulse-glow' : 'bg-gray-600'
          }`}
        ></div>
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Device Name</p>
          <p className="text-base font-mono text-cyan-400">
            {state.device_name || 'Not Connected'}
          </p>
        </div>

        <div>
          <p className="text-xs text-muted-foreground mb-1">Status</p>
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                state.system_active
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
              }`}
            >
              {state.system_active ? 'ACTIVE' : 'INACTIVE'}
            </span>
          </div>
        </div>

        <div className="space-y-2 pt-2">
          <button
            onClick={onConnect}
            className="w-full py-2 px-3 sm:px-4 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-primary-foreground font-medium hover:from-cyan-400 hover:to-blue-400 transition-all duration-300 text-xs sm:text-sm glow-cyan"
          >
            Connect Device
          </button>

          <button
            onClick={onToggleSimulate}
            className={`w-full py-2 px-3 sm:px-4 rounded-lg font-medium text-xs sm:text-sm transition-all duration-300 ${
              state.system_active
                ? 'bg-destructive/20 text-destructive-foreground border border-destructive/50 hover:bg-destructive/30'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-secondary'
            }`}
          >
            {state.system_active ? 'Disconnect' : 'Simulate Device'}
          </button>
        </div>
      </div>
    </div>
  )
}
