"use client"

import { useRef, useEffect, useCallback } from "react"

export default function InteractiveDotGrid({
  children,
  width = "100%",
  height,
  className = "",
  radius = 100,
  dotSize = 3,
  maxScale = 5,
  dotSpacing = 25,
  dotColor = "rgba(156, 163, 175, 0.6)",
  hoverColor = "rgba(2, 2, 2, 0.8)",
  backgroundColor = "transparent",
  contentClassName = "",
  contentStyle = {},
}) {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const animationRef = useRef()
  const mouseRef = useRef({ x: -1000, y: -1000 })

  const drawDots = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * window.devicePixelRatio
    canvas.height = rect.height * window.devicePixelRatio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height)

    // Draw dots
    for (let x = dotSpacing / 2; x < rect.width; x += dotSpacing) {
      for (let y = dotSpacing / 2; y < rect.height; y += dotSpacing) {
        // Calculate distance from mouse to dot
        const dx = mouseRef.current.x - x
        const dy = mouseRef.current.y - y
        const distance = Math.sqrt(dx * dx + dy * dy)

        let scale = 1
        if (distance < radius) {
          // Calculate scale based on distance (closer = larger)
          const normalizedDistance = distance / radius
          scale = 1 + (maxScale - 1) * (1 - normalizedDistance)
        }

        const currentSize = dotSize * scale

        ctx.beginPath()
        ctx.arc(x, y, currentSize, 0, Math.PI * 2)

        if (distance < radius) {
          const intensity = 0.4 + (scale - 1) * 0.6
          ctx.fillStyle = hoverColor.replace(/[\d.]+\)$/, `${intensity})`)
        } else {
          ctx.fillStyle = dotColor
        }

        ctx.fill()
      }
    }
  }, [radius, dotSize, maxScale, dotSpacing, dotColor, hoverColor])

  const handleMouseMove = useCallback((e) => {
    const container = containerRef.current
    if (!container) return

    const rect = container.getBoundingClientRect()
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
  }, [])

  const handleMouseLeave = useCallback(() => {
    mouseRef.current = { x: -1000, y: -1000 }
  }, [])

  const animate = useCallback(() => {
    drawDots()
    animationRef.current = requestAnimationFrame(animate)
  }, [drawDots])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.addEventListener("mousemove", handleMouseMove)
    container.addEventListener("mouseleave", handleMouseLeave)

    // Start animation
    animate()

    // Handle resize
    const handleResize = () => {
      drawDots()
    }
    window.addEventListener("resize", handleResize)

    return () => {
      container.removeEventListener("mousemove", handleMouseMove)
      container.removeEventListener("mouseleave", handleMouseLeave)
      window.removeEventListener("resize", handleResize)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [handleMouseMove, handleMouseLeave, animate, drawDots])

  const ControlsPanel = () => (
    <div className={`controls-panel controls-${controlsPosition}`}>
      <div className="controls-header">
        <h3>Dot Grid Controls</h3>
      </div>
      <div className="controls-content">
        <Slider value={radius} onChange={setRadius} min={50} max={300} step={10} label="Effect Radius" />
        <Slider value={dotSize} onChange={setDotSize} min={1} max={8} step={0.5} label="Base Dot Size" />
        <Slider value={maxScale} onChange={setMaxScale} min={1} max={5} step={0.1} label="Max Scale" />
        <Slider value={dotSpacing} onChange={setDotSpacing} min={15} max={50} step={5} label="Dot Spacing" />
        <div className="usage-info">
          <p>
            <strong>How to use:</strong>
          </p>
          <p>
            Move your cursor over the dot grid to see the interactive effect. Dots within the radius will enlarge based
            on their distance from your cursor.
          </p>
        </div>
      </div>
    </div>
  )

  return (
    <div ref={containerRef} className={`dot-grid-container ${className}`} style={{ width, ...(height && { height }) }}>
      {/* Background Canvas */}
      <canvas ref={canvasRef} className="dot-grid-canvas" style={{ background: backgroundColor }} />

      {/* Content Layer */}
      <div className={`content-layer ${contentClassName}`} style={contentStyle}>
        {children}
      </div>

      {/* Controls */}

      <style jsx>{`
        .dot-grid-container {
          position: relative;
          overflow: hidden;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        }

        .dot-grid-canvas {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: -1;
        }

        .content-layer {
          position: relative;
          width: 100%;
          min-height: 100%;
          z-index: 1;
          display: flex;
          flex-direction: column;
        }
      `}</style>
    </div>
  )
}