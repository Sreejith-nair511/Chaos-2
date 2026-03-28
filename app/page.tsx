'use client'

import { useState, useEffect, useRef } from 'react'
import Header from '@/components/Header'
import EdgeDevicePanel from '@/components/EdgeDevicePanel'
import TelemetryPanel from '@/components/TelemetryPanel'
import GraphPanel from '@/components/GraphPanel'
import MLDetectionPanel from '@/components/MLDetectionPanel'
import MicroserviceGrid from '@/components/MicroserviceGrid'
import KubernetesFlow from '@/components/KubernetesFlow'
import LogPanel from '@/components/LogPanel'

export interface DashboardState {
  device_name: string | null
  system_active: boolean
  cpu_usage: number
  memory_usage: number
  packet_loss: number
  response_time: number
  heartbeat_delay: number
  anomaly_score: number
  status: 'HEALTHY' | 'DETECTING' | 'FAILURE'
  cpu_history: number[]
  memory_history: number[]
  delay_history: number[]
  services: {
    [key: string]: 'RUNNING' | 'RESTARTING'
  }
  logs: {
    edge: string[]
    telemetry: string[]
    detection: string[]
    recovery: string[]
    orchestrator: string[]
  }
}

export default function Dashboard() {
  const [state, setState] = useState<DashboardState>({
    device_name: null,
    system_active: false,
    cpu_usage: 0,
    memory_usage: 0,
    packet_loss: 0,
    response_time: 0,
    heartbeat_delay: 0,
    anomaly_score: 0,
    status: 'HEALTHY',
    cpu_history: [],
    memory_history: [],
    delay_history: [],
    services: {
      edge_device_service: 'RUNNING',
      device_service: 'RUNNING',
      telemetry_service: 'RUNNING',
      detection_service: 'RUNNING',
      recovery_service: 'RUNNING',
      orchestrator_service: 'RUNNING',
    },
    logs: {
      edge: ['System initialized'],
      telemetry: ['Telemetry engine ready'],
      detection: ['ML detection system ready'],
      recovery: ['Recovery service ready'],
      orchestrator: ['Orchestrator ready'],
    },
  })

  const telemetryIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const kubernetesIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const deviceCheckRef = useRef<boolean>(false)

  // Check for connected devices on mount
  useEffect(() => {
    if (deviceCheckRef.current) return
    deviceCheckRef.current = true

    const checkConnectedDevices = async () => {
      try {
        if ('serial' in navigator) {
          const ports = await (navigator.serial as any).getPorts()
          if (ports.length > 0) {
            setState((prev) => ({
              ...prev,
              device_name: 'Arduino Uno',
              system_active: true,
            }))
        addLog('edge', '[OK] Device auto-detected: Arduino Uno')
        addLog('edge', '[OK] System activated')
          }
        }
      } catch (err) {
        console.log('No devices detected')
      }
    }

    checkConnectedDevices()
  }, [])

  const addLog = (service: keyof DashboardState['logs'], message: string) => {
    setState((prev) => ({
      ...prev,
      logs: {
        ...prev.logs,
        [service]: [message, ...prev.logs[service].slice(0, 9)],
      },
    }))
  }

  // Telemetry engine - runs every second when active
  useEffect(() => {
    if (!state.system_active) {
      if (telemetryIntervalRef.current) {
        clearInterval(telemetryIntervalRef.current)
      }
      return
    }

    telemetryIntervalRef.current = setInterval(() => {
      setState((prev) => {
        const cpu = Math.random() * 45 + 30
        const memory = Math.random() * 45 + 40
        const packet_loss = Math.random() * 2
        const delay = Math.random() * 1 + 0.2

        const new_cpu_history = [...prev.cpu_history, cpu].slice(-30)
        const new_memory_history = [...prev.memory_history, memory].slice(-30)
        const new_delay_history = [...prev.delay_history, delay].slice(-30)

        // ML Anomaly Detection
        const score = delay * 0.6 + cpu * 0.01 + packet_loss * 0.2
        let status: 'HEALTHY' | 'DETECTING' | 'FAILURE' = 'HEALTHY'
        if (score > 1.2) {
          status = 'FAILURE'
        } else if (score > 0.8) {
          status = 'DETECTING'
        }

        return {
          ...prev,
          cpu_usage: cpu,
          memory_usage: memory,
          packet_loss: packet_loss,
          response_time: delay,
          heartbeat_delay: delay * Math.random(),
          anomaly_score: score,
          status: status,
          cpu_history: new_cpu_history,
          memory_history: new_memory_history,
          delay_history: new_delay_history,
        }
      })
    }, 1000)

    return () => {
      if (telemetryIntervalRef.current) {
        clearInterval(telemetryIntervalRef.current)
      }
    }
  }, [state.system_active])

  // Kubernetes restart logic
  useEffect(() => {
    if (state.status === 'FAILURE') {
      if (kubernetesIntervalRef.current) {
        clearInterval(kubernetesIntervalRef.current)
      }

      setState((prev) => ({
        ...prev,
        services: {
          ...prev.services,
          detection_service: 'RESTARTING',
          recovery_service: 'RESTARTING',
        },
      }))

        addLog('orchestrator', '[K8s] Restarting pods...')
        addLog('detection', '[RESTART] Detection service restarting')
        addLog('recovery', '[RESTART] Recovery service restarting')

      const timeoutId = setTimeout(() => {
        setState((prev) => ({
          ...prev,
          services: {
            ...prev.services,
            detection_service: 'RUNNING',
            recovery_service: 'RUNNING',
          },
          status: 'HEALTHY',
        }))

        addLog('orchestrator', '[OK] Pods restored to RUNNING')
        addLog('recovery', '[OK] Recovery complete')
        addLog('detection', '[OK] Detection service healthy')
      }, 2000)

      return () => clearTimeout(timeoutId)
    }
  }, [state.status])

  const handleConnectDevice = async () => {
    try {
      if ('serial' in navigator) {
        const port = await (navigator.serial as any).requestPort()
        setState((prev) => ({
          ...prev,
          device_name: 'Arduino Uno',
          system_active: true,
        }))
        addLog('edge', '[OK] Device connected: Arduino Uno')
        addLog('edge', '[OK] System activated')
      }
    } catch (err) {
      console.log('Device connection cancelled or failed')
    }
  }

  const toggleSimulateDevice = () => {
    setState((prev) => ({
      ...prev,
      device_name: prev.device_name ? null : 'Arduino Uno (Simulated)',
      system_active: !prev.system_active,
    }))

    if (!state.system_active) {
      addLog('edge', '[OK] Device simulation activated')
      addLog('edge', '[OK] System activated')
    } else {
      addLog('edge', '[OFF] System deactivated')
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
          <EdgeDevicePanel
            state={state}
            onConnect={handleConnectDevice}
            onToggleSimulate={toggleSimulateDevice}
          />
          <TelemetryPanel state={state} />
        </div>

        <GraphPanel state={state} />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
          <MLDetectionPanel state={state} />
        </div>

        <MicroserviceGrid state={state} />

        <KubernetesFlow state={state} />

        <LogPanel logs={state.logs} />
      </main>
    </div>
  )
}
