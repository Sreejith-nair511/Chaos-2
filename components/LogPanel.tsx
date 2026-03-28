'use client'

import { useState } from 'react'
import { DashboardState } from '@/app/page'

interface LogPanelProps {
  logs: DashboardState['logs']
}

type LogTab = keyof DashboardState['logs']

const LOG_TABS: { id: LogTab; label: string }[] = [
  { id: 'edge', label: 'Edge' },
  { id: 'telemetry', label: 'Telemetry' },
  { id: 'detection', label: 'Detection' },
  { id: 'recovery', label: 'Recovery' },
  { id: 'orchestrator', label: 'Orchestrator' },
]

export default function LogPanel({ logs }: LogPanelProps) {
  const [activeTab, setActiveTab] = useState<LogTab>('edge')

  return (
    <div className="cyber-border rounded-lg p-4 sm:p-6 space-y-4">
      <h2 className="text-base sm:text-lg font-semibold text-foreground">System Logs</h2>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {LOG_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 sm:px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-200 text-xs sm:text-sm font-medium ${
              activeTab === tab.id
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 glow-cyan'
                : 'bg-secondary text-secondary-foreground border border-secondary hover:bg-secondary/80'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-secondary/30 rounded-lg border border-border p-3 sm:p-4 space-y-2 max-h-48 sm:max-h-64 overflow-y-auto font-mono">
        {logs[activeTab].length === 0 ? (
          <div className="text-muted-foreground italic text-xs sm:text-sm">No logs yet</div>
        ) : (
          logs[activeTab].map((log, index) => (
            <div
              key={index}
              className={`py-1 text-xs sm:text-sm ${
                log.includes('[OK]')
                  ? 'text-green-400'
                  : log.includes('[ERR]')
                  ? 'text-red-400'
                  : log.includes('[WARN]')
                  ? 'text-yellow-400'
                  : log.includes('[RESTART]') || log.includes('[K8s]')
                  ? 'text-blue-400'
                  : 'text-cyan-400'
              }`}
            >
              <span className="text-muted-foreground">[{index + 1}]</span> {log}
            </div>
          ))
        )}
      </div>

      <div className="text-xs text-muted-foreground pt-2 border-t border-border">
        Latest {logs[activeTab].length} / 10 logs from {activeTab}
      </div>
    </div>
  )
}
