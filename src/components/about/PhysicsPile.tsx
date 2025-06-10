"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import Matter from "matter-js"

interface PhysicsPileProps {
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
  containerWidth = 600,
  containerHeight = 400,
  gravity = { x: 0, y: 1 },
  enableDebug = false,
  wallThickness = 20,
  elementCount = 5,
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

    const engine = Engine.create({ gravity })
    engineRef.current = engine

    const render = Render.create({
      canvas: canvasRef.current!,
      engine,
      options: {
        width: containerWidth,
        height: containerHeight,
        wireframes: false,
        background: backgroundColor,
        showAngleIndicator: enableDebug,
        showCollisions: enableDebug,
        showVelocity: enableDebug,
        showBounds: true, 
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

    Composite.add(engine.world, [ground, leftWall, rightWall])

    const physicsElements: Matter.Body[] = []

    const generateBody = (
      x: number,
      y: number,
      options: Matter.IChamferableBodyDefinition,
    ): Matter.Body => {
      return Bodies.rectangle(x, y, 200, 200, options)
    }

    for (let i = 0; i < elementCount; i++) {
      const x = Math.random() * (containerWidth - 100) + 50
      const y = Math.random() * (containerHeight / 3) + 20

      const options = {
        friction,
        restitution,
        render: {
          sprite: {
            texture: "/images/haus.png",
            xScale: 0.07,
            yScale: 0.07,
          },
        },
      }

      const body = generateBody(x, y, options)
      physicsElements.push(body)
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
  ])

  return (
    <div
      className="physics-pile-container"
      style={{ position: "relative", width: containerWidth, height: containerHeight }}
    >
      <div ref={sceneRef} style={{ width: "100%", height: "100%", overflow: "hidden" }}>
        <canvas ref={canvasRef} />
      </div>
    </div>
  )
}

export default PhysicsPile
