"use client"

import { useEffect, useRef, useState } from "react"
import PhysicsPile from "./PhysicsPile"
import type { PhysicsElement } from "../../types/types"
import { useContainerWidth } from "../../hooks/useContainerWidth"

interface PhysicsPileIslandProps {
  elements?: PhysicsElement[]
  containerHeight?: number
  gravity?: { x: number; y: number }
  enableDebug?: boolean
  wallThickness?: number
  friction?: number
  restitution?: number
  backgroundColor?: string
}

export default function PhysicsPileIsland({
  elements = [],
  containerHeight,
  gravity,
  enableDebug,
  wallThickness,
  friction,
  restitution,
  backgroundColor,
}: PhysicsPileIslandProps) {
  const [isMounted, setIsMounted] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const containerWidth = useContainerWidth(containerRef)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div
        ref={containerRef}
        style={{
          width: "100%",
          height: containerHeight ?? 500,
          backgroundColor: backgroundColor ?? "#f0f0f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p>Loading physics simulation...</p>
      </div>
    )
  }

  return (
    <div ref={containerRef} style={{ width: "100%" }}>
      <PhysicsPile
        elements={elements}
        containerWidth={containerWidth}
        containerHeight={containerHeight}
        gravity={gravity}
        enableDebug={enableDebug}
        wallThickness={wallThickness}
        friction={friction}
        restitution={restitution}
        backgroundColor={backgroundColor}
      />
    </div>
  )
}
