"use client"

import React, { useState, useRef, useCallback } from "react"

export function RunawayText({
  children,
  className = "",
  runDistance = 100,
  animationDuration = 0.3,
}) {
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const containerRef = useRef(null)

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
    setOffset({ x: 0, y: 0 })
  }, [])

  const handleMouseMove = useCallback(
    (e) => {
      if (!containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const mouseX = e.clientX
      const mouseY = e.clientY

      // Calculate direction from cursor to center
      const deltaX = centerX - mouseX
      const deltaY = centerY - mouseY

      // Normalize the direction
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
      const normalizedX = distance > 0 ? deltaX / distance : 0
      const normalizedY = distance > 0 ? deltaY / distance : 0

      // Apply the runaway effect (only in x-axis as requested)
      const newOffsetX = normalizedX * runDistance

      setOffset({ x: newOffsetX, y: 0 })
    },
    [runDistance],
  )

  return (
    <div
      ref={containerRef}
      className={`inline-block cursor-pointer ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      <div
        className="inline-block transition-transform duration-300 ease-out"
        style={{
          transform: isHovered 
            ? `translate(${offset.x}px, ${offset.y}px)` 
            : 'translate(0px, 0px)',
          transition: `transform ${animationDuration}s ease-out`,
        }}
      >
        {children}
      </div>
    </div>
  )
}