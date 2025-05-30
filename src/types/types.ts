export interface PhysicsElement {
  shape: "circle" | "rectangle" | "polygon"
  width?: number
  height?: number
  radius?: number
  vertices?: { x: number; y: number }[]
  color: string
  texture?: string
}
