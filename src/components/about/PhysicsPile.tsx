"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import Matter from "matter-js"
import type { PhysicsElement } from "../types"

interface PhysicsPileProps {
  elements?: PhysicsElement[]
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

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (!mounted) return

    const Engine = Matter.Engine
    const Render = Matter.Render
    const Runner = Matter.Runner
    const Bodies = Matter.Bodies
    const Composite = Matter.Composite
    const MouseConstraint = Matter.MouseConstraint
    const Mouse = Matter.Mouse
    const Body = Matter.Body

    const engine = Engine.create({ gravity })
    engineRef.current = engine

    const render = Render.create({
      canvas: canvasRef.current!,
      engine,
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
      wallOptions
    )
    const leftWall = Bodies.rectangle(
      -wallThickness / 2,
      containerHeight / 2,
      wallThickness,
      containerHeight * 2,
      wallOptions
    )
    const rightWall = Bodies.rectangle(
      containerWidth + wallThickness / 2,
      containerHeight / 2,
      wallThickness,
      containerHeight * 2,
      wallOptions
    )

    Composite.add(engine.world, [ground, leftWall, rightWall])

    const physicsElements: Matter.Body[] = []

    if (elements.length > 0) {
      elements.forEach((element) => {
        let body: Matter.Body

        const commonOptions = {
          friction,
          restitution,
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
              body = Bodies.fromVertices(x, y, [element.vertices], commonOptions) as Matter.Body
            } else {
              body = Bodies.polygon(x, y, 3, 30, commonOptions)
            }
            break
          default:
            body = Bodies.rectangle(x, y, 40, 40, commonOptions)
        }

        physicsElements.push(body)
      })
    } else {
      for (let i = 0; i < elementCount; i++) {
        const x = Math.random() * (containerWidth - 100) + 50
        const y = Math.random() * (containerHeight / 3) + 20

        const shapeType = Math.floor(Math.random() * 3)
        let body: Matter.Body

        const commonOptions = {
          friction,
          restitution,
          render: {
            fillStyle: `hsl(${Math.random() * 360}, 70%, 60%)`,
          },
        }

        switch (shapeType) {
          case 0:
            body = Bodies.circle(x, y, 15 + Math.random() * 15, commonOptions)
            break
          case 1:
            body = Bodies.rectangle(x, y, 30 + Math.random() * 30, 30 + Math.random() * 30, commonOptions)
            break
          case 2:
            body = Bodies.polygon(x, y, 3 + Math.floor(Math.random() * 5), 15 + Math.random() * 15, commonOptions)
            break
          default:
            body = Bodies.rectangle(x, y, 40, 40, commonOptions)
        }

        physicsElements.push(body)
      }
    }

    Composite.add(engine.world, physicsElements)
    bodiesRef.current = physicsElements

    const mouse = Mouse.create(render.canvas)
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: enableDebug },
      },
    })

    mouseConstraintRef.current = mouseConstraint
    Composite.add(engine.world, mouseConstraint)
    render.mouse = mouse

    const runner = Runner.create()
    Runner.run(runner, engine)
    Render.run(render)

    return () => {
      Render.stop(render)
      Runner.stop(runner)
      Engine.clear(engine)

      if (render.canvas) {
        render.canvas.remove()
      }

      if (mouseConstraintRef.current) {
        Composite.remove(engine.world, mouseConstraintRef.current)
      }

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

  const addElement = () => {
    if (!engineRef.current) return

    const Bodies = Matter.Bodies
    const Composite = Matter.Composite

    const x = Math.random() * (containerWidth - 100) + 50
    const y = 50

    const shapeType = Math.floor(Math.random() * 3)
    let body: Matter.Body

    const commonOptions = {
      friction,
      restitution,
      render: {
        fillStyle: `hsl(${Math.random() * 360}, 70%, 60%)`,
      },
    }

    switch (shapeType) {
      case 0:
        body = Bodies.circle(x, y, 15 + Math.random() * 15, commonOptions)
        break
      case 1:
        body = Bodies.rectangle(x, y, 30 + Math.random() * 30, 30 + Math.random() * 30, commonOptions)
        break
      case 2:
        body = Bodies.polygon(x, y, 3 + Math.floor(Math.random() * 5), 15 + Math.random() * 15, commonOptions)
        break
      default:
        body = Bodies.rectangle(x, y, 40, 40, commonOptions)
    }

    Composite.add(engineRef.current.world, body)
    bodiesRef.current = [...bodiesRef.current, body]
  }

  const clearElements = () => {
    if (!engineRef.current) return
    const Composite = Matter.Composite

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
