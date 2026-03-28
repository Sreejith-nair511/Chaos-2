'use client'

import { useState, useEffect } from 'react'

export default function Header() {
  const [time, setTime] = useState<string>('')
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    setTime(new Date().toLocaleTimeString())
    
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-md cyber-border sticky top-0 z-50">
      <div className="px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center glow-cyan-lg flex-shrink-0">
            <span className="text-sm sm:text-lg font-bold text-primary-foreground">PS</span>
          </div>
          <div className="min-w-0">
            <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent truncate">
              PS1 Edge Control
            </h1>
            <p className="text-xs text-muted-foreground hidden sm:block">Autonomous Orchestration Plane</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          <div className="text-right text-xs sm:text-sm hidden sm:block">
            <div className="text-cyan-400 font-mono text-xs h-4">
              {isMounted && time}
            </div>
            <div className="text-muted-foreground text-xs">LIVE</div>
          </div>
          <div className="w-2 sm:w-3 h-2 sm:h-3 rounded-full bg-green-500 animate-pulse"></div>
        </div>
      </div>
    </header>
  )
}
