"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import Matter from "matter-js"

// Define the props interface for our component
interface PhysicsPileProps {
  elements?: {
    shape: "circle" | "rectangle" | "polygon"
    width?: number
    height?: number
    radius?: number
    vertices?: { x: number; y: number }[]
    color: string
    texture?: string
  }[]
  containerWidth?: number
  containerHeight?: number
  gravity?: { x: number; y: number }
  enableDebug?: boolean
  wallThickness?: number
  elementCount?: number
  friction?: number
  restitution?: number
  backgroundColor?: string
}

const PhysicsPile: React.FC<PhysicsPileProps> = ({
  elements = [],
  containerWidth = 600,
  containerHeight = 400,
  gravity = { x: 0, y: 1 },
  enableDebug = false,
  wallThickness = 20,
  elementCount = 20,
  friction = 0.3,
  restitution = 0.6,
  backgroundColor = "#f0f0f0",
}) => {
  const sceneRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const engineRef = useRef<Matter.Engine>()
  const renderRef = useRef<Matter.Render>()
  const mouseConstraintRef = useRef<Matter.MouseConstraint>()
  const bodiesRef = useRef<Matter.Body[]>([])

  // State to track if the component is mounted (for Astro client:load directive)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Only run the physics engine if the component is mounted
    if (!mounted) return

    // Initialize Matter.js modules
    const Engine = Matter.Engine
    const Render = Matter.Render
    const Runner = Matter.Runner
    const Bodies = Matter.Bodies
    const Composite = Matter.Composite
    const MouseConstraint = Matter.MouseConstraint
    const Mouse = Matter.Mouse
    const Body = Matter.Body

    // Create engine
    const engine = Engine.create({
      gravity: gravity,
    })
    engineRef.current = engine

    // Create renderer
    const render = Render.create({
      canvas: canvasRef.current!,
      engine: engine,
      options: {
        width: containerWidth,
        height: containerHeight,
        wireframes: enableDebug,
        background: backgroundColor,
        showAngleIndicator: enableDebug,
        showCollisions: enableDebug,
        showVelocity: enableDebug,
      },
    })
    renderRef.current = render

    // Create walls (boundaries)
    const wallOptions = {
      isStatic: true,
      render: {
        fillStyle: "#222",
        visible: !enableDebug,
      },
    }

    const ground = Bodies.rectangle(
      containerWidth / 2,
      containerHeight + wallThickness / 2,
      containerWidth + wallThickness * 2,
      wallThickness,
      wallOptions,
    )

    const leftWall = Bodies.rectangle(
      -wallThickness / 2,
      containerHeight / 2,
      wallThickness,
      containerHeight * 2,
      wallOptions,
    )

    const rightWall = Bodies.rectangle(
      containerWidth + wallThickness / 2,
      containerHeight / 2,
      wallThickness,
      containerHeight * 2,
      wallOptions,
    )

    // Add walls to the world
    Composite.add(engine.world, [ground, leftWall, rightWall])

    // Create physics elements
    const physicsElements: Matter.Body[] = []

    // If custom elements are provided, use them
    if (elements.length > 0) {
      elements.forEach((element, index) => {
        let body: Matter.Body

        const commonOptions = {
          friction: friction,
          restitution: restitution,
          render: {
            fillStyle: element.color,
            sprite: element.texture
              ? {
                  texture: element.texture,
                  xScale: 1,
                  yScale: 1,
                }
              : undefined,
          },
        }

        // Random position within the container
        const x = Math.random() * (containerWidth - 100) + 50
        const y = Math.random() * (containerHeight / 3) + 20

        switch (element.shape) {
          case "circle":
            body = Bodies.circle(x, y, element.radius || 20, commonOptions)
            break
          case "rectangle":
            body = Bodies.rectangle(x, y, element.width || 40, element.height || 40, commonOptions)
            break
          case "polygon":
            if (element.vertices) {
              body = Bodies.fromVertices(x, y, [element.vertices], commonOptions)
            } else {
              // Default to a triangle if no vertices provided
              body = Bodies.polygon(x, y, 3, 30, commonOptions)
            }
            break
          default:
            body = Bodies.rectangle(x, y, 40, 40, commonOptions)
        }

        physicsElements.push(body)
      })
    } else {
      // Generate default elements if none provided
      for (let i = 0; i < elementCount; i++) {
        const x = Math.random() * (containerWidth - 100) + 50
        const y = Math.random() * (containerHeight / 3) + 20

        // Randomly choose shape
        const shapeType = Math.floor(Math.random() * 3)
        let body: Matter.Body

        const commonOptions = {
          friction: friction,
          restitution: restitution,
          render: {
            fillStyle: `hsl(${Math.random() * 360}, 70%, 60%)`,
          },
        }

        switch (shapeType) {
          case 0: // Circle
            body = Bodies.circle(x, y, 15 + Math.random() * 15, commonOptions)
            break
          case 1: // Rectangle
            body = Bodies.rectangle(x, y, 30 + Math.random() * 30, 30 + Math.random() * 30, commonOptions)
            break
          case 2: // Polygon
            body = Bodies.polygon(x, y, 3 + Math.floor(Math.random() * 5), 15 + Math.random() * 15, commonOptions)
            break
          default:
            body = Bodies.rectangle(x, y, 40, 40, commonOptions)
        }

        physicsElements.push(body)
      }
    }

    // Add all elements to the world
    Composite.add(engine.world, physicsElements)
    bodiesRef.current = physicsElements

    // Add mouse control
    const mouse = Mouse.create(render.canvas)
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: enableDebug,
        },
      },
    })

    mouseConstraintRef.current = mouseConstraint
    Composite.add(engine.world, mouseConstraint)

    // Keep the mouse in sync with rendering
    render.mouse = mouse

    // Run the engine
    const runner = Runner.create()
    Runner.run(runner, engine)
    Render.run(render)

    // Cleanup function
    return () => {
      // Stop the engine and renderer
      Render.stop(render)
      Runner.stop(runner)
      Engine.clear(engine)

      if (render.canvas) {
        render.canvas.remove()
      }

      if (mouseConstraintRef.current) {
        Composite.remove(engine.world, mouseConstraintRef.current)
      }

      // Remove all bodies
      bodiesRef.current.forEach((body) => {
        Composite.remove(engine.world, body)
      })
    }
  }, [
    mounted,
    containerWidth,
    containerHeight,
    gravity,
    enableDebug,
    wallThickness,
    elementCount,
    friction,
    restitution,
    backgroundColor,
    elements,
  ])

  // Add a new element at a random position
  const addElement = () => {
    if (!engineRef.current) return

    const Engine = Matter.Engine
    const Bodies = Matter.Bodies
    const Composite = Matter.Composite

    const x = Math.random() * (containerWidth - 100) + 50
    const y = 50

    // Randomly choose shape
    const shapeType = Math.floor(Math.random() * 3)
    let body: Matter.Body

    const commonOptions = {
      friction: friction,
      restitution: restitution,
      render: {
        fillStyle: `hsl(${Math.random() * 360}, 70%, 60%)`,
      },
    }

    switch (shapeType) {
      case 0: // Circle
        body = Bodies.circle(x, y, 15 + Math.random() * 15, commonOptions)
        break
      case 1: // Rectangle
        body = Bodies.rectangle(x, y, 30 + Math.random() * 30, 30 + Math.random() * 30, commonOptions)
        break
      case 2: // Polygon
        body = Bodies.polygon(x, y, 3 + Math.floor(Math.random() * 5), 15 + Math.random() * 15, commonOptions)
        break
      default:
        body = Bodies.rectangle(x, y, 40, 40, commonOptions)
    }

    Composite.add(engineRef.current.world, body)
    bodiesRef.current = [...bodiesRef.current, body]
  }

  // Clear all elements
  const clearElements = () => {
    if (!engineRef.current) return

    const Composite = Matter.Composite

    // Remove all bodies except walls and constraints
    bodiesRef.current.forEach((body) => {
      Composite.remove(engineRef.current!.world, body)
    })

    bodiesRef.current = []
  }

  return (
    <div
      className="physics-pile-container"
      style={{ position: "relative", width: containerWidth, height: containerHeight }}
    >
      <div ref={sceneRef} style={{ width: "100%", height: "100%", overflow: "hidden" }}>
        <canvas ref={canvasRef} />
      </div>
      <div className="controls" style={{ position: "absolute", top: "10px", right: "10px", zIndex: 10 }}>
        <button
          onClick={addElement}
          style={{
            padding: "8px 12px",
            marginRight: "8px",
            background: "#4a90e2",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Add Element
        </button>
        <button
          onClick={clearElements}
          style={{
            padding: "8px 12px",
            background: "#e24a4a",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Clear All
        </button>
      </div>
    </div>
  )
}

export default PhysicsPile
