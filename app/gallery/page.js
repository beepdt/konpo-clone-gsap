"use client"

import { useRef, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Gallery() {
  const router = useRouter()
  const containerRef = useRef(null)
  const itemsRef = useRef(null)
  const indicatorRef = useRef(null)
  const previewRef = useRef(null)

  // mutable refs for state
  const isHorizontal = useRef(false)
  const dimensions = useRef({ itemSize: 0, containerSize: 0, indicatorSize: 0 })
  const maxTranslate = useRef(0)
  const currentTranslate = useRef(0)
  const targetTranslate = useRef(0)
  const isClickMove = useRef(false)
  const touchStartY = useRef(0)
  const touchStartX = useRef(0)
  const currentIndex = useRef(0)
  const animationId = useRef(null)
  const isAnimating = useRef(false)

  const activeOpacity = 0.3
  const lerp = (start, end, factor) => start + (end - start) * factor

  // array of image sources
  const images = [
    "/img1.jpg",
    "/img2.jpg",
    "/img3.jpg",
    "/img4.jpeg",
    "/img5.jpg",
    "/img6.jpg",
    "/img7.png",
    "/img8.jpg",
    "/img9.jpeg",
    "/img10.jpeg",
    "/img11.png",
    "/img12.png",
  ]

  useEffect(() => {
    const container = containerRef.current
    const items = itemsRef.current
    const indicator = indicatorRef.current
    const previewImg = previewRef.current
    const allItems = items.querySelectorAll(".gallery-item")
    const allImages = items.querySelectorAll(".gallery-item img")

    const updateDims = () => {
      isHorizontal.current = window.innerWidth <= 900
      if (!allItems.length) return
      
      const first = allItems[0].getBoundingClientRect()
      const itemsRect = items.getBoundingClientRect()
      const indicatorRect = indicator.getBoundingClientRect()
      
      if (isHorizontal.current) {
        dimensions.current = {
          itemSize: first.width,
          containerSize: itemsRect.width,
          indicatorSize: indicatorRect.width,
        }
      } else {
        dimensions.current = {
          itemSize: first.height,
          containerSize: itemsRect.height,
          indicatorSize: indicatorRect.height,
        }
      }
      
      const totalItemsSize = dimensions.current.itemSize * allItems.length
      maxTranslate.current = Math.max(0, totalItemsSize - dimensions.current.indicatorSize)
    }

    const getIndicatorIndex = () => {
      // Reset all opacities first
      allImages.forEach(img => img.style.opacity = "1")
      
      const viewportStart = -currentTranslate.current
      const viewportEnd = viewportStart + dimensions.current.indicatorSize
      const viewportCenter = viewportStart + dimensions.current.indicatorSize / 2
      
      let bestIndex = 0
      let minDistance = Infinity
      
      // Find the item closest to the center of the viewport
      allItems.forEach((item, i) => {
        const itemStart = i * dimensions.current.itemSize
        const itemCenter = itemStart + dimensions.current.itemSize / 2
        const distance = Math.abs(itemCenter - viewportCenter)
        
        if (distance < minDistance) {
          minDistance = distance
          bestIndex = i
        }
      })
      
      // Set active opacity for the best match
      if (allImages[bestIndex]) {
        allImages[bestIndex].style.opacity = String(activeOpacity)
      }
      
      return bestIndex
    }

    const updatePreview = (idx) => {
      if (currentIndex.current !== idx && allImages[idx]) {
        currentIndex.current = idx
        previewImg.src = allImages[idx].src
      }
    }

    const animate = () => {
      const f = isClickMove.current ? 0.05 : 0.075
      const prevTranslate = currentTranslate.current
      
      currentTranslate.current = lerp(
        currentTranslate.current,
        targetTranslate.current,
        f
      )
      
      const hasChanged = Math.abs(currentTranslate.current - prevTranslate) > 0.01
      const isClose = Math.abs(currentTranslate.current - targetTranslate.current) <= 0.01
      
      if (hasChanged || !isClose) {
        items.style.transform = isHorizontal.current
          ? `translateX(${currentTranslate.current}px)`
          : `translateY(${currentTranslate.current}px)`
        
        const idx = getIndicatorIndex()
        updatePreview(idx)
        
        if (isClose) {
          isClickMove.current = false
          currentTranslate.current = targetTranslate.current
          items.style.transform = isHorizontal.current
            ? `translateX(${currentTranslate.current}px)`
            : `translateY(${currentTranslate.current}px)`
        }
        
        animationId.current = requestAnimationFrame(animate)
      } else {
        isAnimating.current = false
        isClickMove.current = false
      }
    }

    const startAnimation = () => {
      if (!isAnimating.current) {
        isAnimating.current = true
        animate()
      }
    }

    // initialize
    updateDims()
    if (allImages[0]) {
      allImages[0].style.opacity = String(activeOpacity)
      updatePreview(0)
    }
    startAnimation()

    // Wheel event handler
    const handleWheel = (e) => {
      e.preventDefault()
      isClickMove.current = false
      const delta = Math.min(Math.max(e.deltaY * 0.5, -20), 20)
      targetTranslate.current = Math.min(
        Math.max(targetTranslate.current - delta, -maxTranslate.current),
        0
      )
      startAnimation()
    }

    // Touch event handlers
    const handleTouchStart = (e) => {
      touchStartY.current = e.touches[0].clientY
      touchStartX.current = e.touches[0].clientX
    }

    const handleTouchMove = (e) => {
      e.preventDefault()
      const currentY = e.touches[0].clientY
      const currentX = e.touches[0].clientX
      
      let delta = 0
      if (isHorizontal.current) {
        // For horizontal layout, use vertical swipe
        delta = Math.min(Math.max((touchStartY.current - currentY) * 0.5, -20), 20)
        touchStartY.current = currentY
      } else {
        // For vertical layout, use horizontal swipe
        delta = Math.min(Math.max((touchStartX.current - currentX) * 0.5, -20), 20)
        touchStartX.current = currentX
      }
      
      targetTranslate.current = Math.min(
        Math.max(targetTranslate.current - delta, -maxTranslate.current),
        0
      )
      startAnimation()
    }

    // Item click handler
    const handleItemClick = (i) => {
      isClickMove.current = true
      targetTranslate.current = Math.max(
        Math.min(
          -i * dimensions.current.itemSize +
          (dimensions.current.indicatorSize - dimensions.current.itemSize) / 2,
          0
        ), -maxTranslate.current
      )
      startAnimation()
    }

    // Resize handler
    const handleResize = () => {
      updateDims()
      targetTranslate.current = Math.min(
        Math.max(targetTranslate.current, -maxTranslate.current),
        0
      )
      currentTranslate.current = targetTranslate.current
      items.style.transform = isHorizontal.current
        ? `translateX(${currentTranslate.current}px)`
        : `translateY(${currentTranslate.current}px)`
      
      const idx = getIndicatorIndex()
      updatePreview(idx)
    }

    // Add event listeners
    container.addEventListener('wheel', handleWheel, { passive: false })
    container.addEventListener('touchstart', handleTouchStart, { passive: true })
    container.addEventListener('touchmove', handleTouchMove, { passive: false })
    
    allItems.forEach((item, i) => {
      item.addEventListener('click', () => handleItemClick(i))
    })

    window.addEventListener('resize', handleResize)

    // Cleanup function
    return () => {
      if (animationId.current) {
        cancelAnimationFrame(animationId.current)
      }
      
      container.removeEventListener('wheel', handleWheel)
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('resize', handleResize)
      
      allItems.forEach((item, i) => {
        item.removeEventListener('click', () => handleItemClick(i))
      })
    }
  }, [])

  return (
    <div className="gallery-container" ref={containerRef}>
      <div className="gallery-nav">
        <h1 onClick={()=> router.back()} className="text-[1.8rem] md:text-[2rem] hover:text-gray-400 transition-color duration-200 cursor-pointer">Home</h1>
        <h1 className="text-[1.8rem] md:text-[2rem]">All Collections</h1>
      </div>
      <div className="img-preview">
        <img ref={previewRef} src={images[0]} alt="Preview" />
      </div>
      <div className="minimap">
        <div className="indicator" ref={indicatorRef}>
          <div className="gallery-items" ref={itemsRef}>
            {images.map((src, i) => (
              <div key={i} className="gallery-item">
                <img src={src} alt={`Gallery ${i + 1}`} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}