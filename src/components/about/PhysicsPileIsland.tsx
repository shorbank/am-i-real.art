"use client"

import { useEffect, useState } from "react"
import PhysicsPile from "./PhysicsPile"

// This component is specifically designed to work with Astro's client:* directives
export default function PhysicsPileIsland({
  elements,
  containerWidth = 600,
  containerHeight = 400,
  gravity = { x: 0, y: 1 },
  enableDebug = false,
  wallThickness = 20,
  elementCount = 20,
  friction = 0.3,
  restitution = 0.6,
  backgroundColor = "#f0f0f0",
}) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    // Return a placeholder with the same dimensions until the component mounts
    return (
      <div
        style={{
          width: containerWidth,
          height: containerHeight,
          backgroundColor,
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
    <PhysicsPile
      elements={elements}
      containerWidth={containerWidth}
      containerHeight={containerHeight}
      gravity={gravity}
      enableDebug={enableDebug}
      wallThickness={wallThickness}
      elementCount={elementCount}
      friction={friction}
      restitution={restitution}
      backgroundColor={backgroundColor}
    />
  )
}
