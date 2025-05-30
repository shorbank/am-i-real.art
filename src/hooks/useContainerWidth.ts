import { useEffect, useState } from "react"

export function useContainerWidth(ref: React.RefObject<HTMLElement>, fallback = 600) {
  const [width, setWidth] = useState(fallback)

  useEffect(() => {
    if (!ref.current) return
    const observer = new ResizeObserver(([entry]) => {
      setWidth(entry.contentRect.width)
    })
    observer.observe(ref.current)
    setWidth(ref.current.offsetWidth)

    return () => observer.disconnect()
  }, [ref])

  return width
}
