'use client'
 
import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, PanInfo, AnimatePresence } from 'framer-motion'
import { Button } from './Button'
import { cn } from './utils'
 
interface TouchGestureProps {
  children: React.ReactNode
  onSwipe?: (direction: 'left' | 'right' | 'up' | 'down') => void
  onPinch?: (scale: number) => void
  onDoubleTap?: () => void
  onLongPress?: () => void
  swipeThreshold?: number
  pinchThreshold?: number
  longPressDelay?: number
  className?: string
  disabled?: boolean
}
 
interface TouchPoint {
  x: number
  y: number
  id: number
}
 
export const TouchGesture = ({
  children,
  onSwipe,
  onPinch,
  onDoubleTap,
  onLongPress,
  swipeThreshold = 50,
  pinchThreshold = 0.1,
  longPressDelay = 500,
  className,
  disabled = false
}: TouchGestureProps) => {
  const [touchPoints, setTouchPoints] = useState<TouchPoint[]>([])
  const [lastTouchTime, setLastTouchTime] = useState(0)
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null)
  const [isDoubleTap, setIsDoubleTap] = useState(false)
  const [scale, setScale] = useState(1)
  const containerRef = useRef<HTMLDivElement>(null)
 
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (disabled) return
 
    const now = Date.now()
    setIsDoubleTap(now - lastTouchTime < 300)
 
    // Start long press timer
    if (onLongPress && !longPressTimer) {
      const timer = setTimeout(() => {
        onLongPress()
        setLongPressTimer(null)
      }, longPressDelay)
      setLongPressTimer(timer)
    }
 
    // Record all touch points
    const points: TouchPoint[] = Array.from(e.touches).map(touch => ({
      x: touch.clientX,
      y: touch.clientY,
      id: touch.identifier
    }))
    setTouchPoints(points)
 
    // Reset scale for new gesture
    setScale(1)
  }, [disabled, lastTouchTime, onLongPress, longPressTimer, longPressDelay])
 
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (disabled || touchPoints.length === 0) return
 
    // Clear long press timer if moving
    if (longPressTimer) {
      clearTimeout(longPressTimer)
      setLongPressTimer(null)
    }
 
    const points: TouchPoint[] = Array.from(e.touches).map(touch => ({
      x: touch.clientX,
      y: touch.clientY,
      id: touch.identifier
    }))
    setTouchPoints(points)
 
    // Handle pinch to zoom
    if (points.length === 2) {
      const distance = Math.sqrt(
        Math.pow(points[0].x - points[1].x, 2) +
        Math.pow(points[0].y - points[1].y, 2)
      )
      
      const prevDistance = Math.sqrt(
        Math.pow(touchPoints[0].x - touchPoints[1].x, 2) +
        Math.pow(touchPoints[0].y - touchPoints[1].y, 2)
      )
 
      if (prevDistance > 0) {
        const newScale = distance / prevDistance
        if (Math.abs(newScale - scale) > pinchThreshold) {
          setScale(newScale)
          onPinch?.(newScale)
        }
      }
    }
 
    // Handle swipe
    if (points.length === 1 && touchPoints.length === 1) {
      const deltaX = points[0].x - touchPoints[0].x
      const deltaY = points[0].y - touchPoints[0].y
 
      if (Math.abs(deltaX) > swipeThreshold) {
        onSwipe?.(deltaX > 0 ? 'right' : 'left')
      } else if (Math.abs(deltaY) > swipeThreshold) {
        onSwipe?.(deltaY > 0 ? 'down' : 'up')
      }
    }
  }, [disabled, touchPoints, longPressTimer, scale, pinchThreshold, onSwipe, onPinch])
 
  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (disabled) return
 
    // Clear long press timer
    if (longPressTimer) {
      clearTimeout(longPressTimer)
      setLongPressTimer(null)
    }
 
    // Handle double tap
    const now = Date.now()
    if (isDoubleTap && onDoubleTap && now - lastTouchTime < 300) {
      onDoubleTap()
      setIsDoubleTap(false)
      setLastTouchTime(now)
    }
 
    setTouchPoints([])
    setScale(1)
  }, [disabled, longPressTimer, isDoubleTap, onDoubleTap, lastTouchTime])
 
  const handleMouseDown = (e: React.MouseEvent) => {
    if (disabled) return
    const rect = containerRef.current?.getBoundingClientRect()
    if (rect) {
      setTouchPoints([{ x: e.clientX, y: e.clientY, id: 0 }])
    }
  }
 
  const handleMouseMove = (e: React.MouseEvent) => {
    if (disabled || touchPoints.length === 0) return
    if (touchPoints.length === 1) {
      const deltaX = e.clientX - touchPoints[0].x
      const deltaY = e.clientY - touchPoints[0].y
 
      if (Math.abs(deltaX) > swipeThreshold) {
        onSwipe?.(deltaX > 0 ? 'right' : 'left')
      } else if (Math.abs(deltaY) > swipeThreshold) {
        onSwipe?.(deltaY > 0 ? 'down' : 'up')
      }
    }
  }
 
  const handleMouseUp = () => {
    if (disabled) return
    setTouchPoints([])
  }
 
  return (
    <div
      ref={containerRef}
      className={cn('relative touch-none select-none', className)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Touch Feedback */}
      <AnimatePresence>
        {touchPoints.map((point, index) => (
          <motion.div
            key={point.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.3, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="fixed w-20 h-20 rounded-full bg-cyan-400/20 pointer-events-none"
            style={{
              left: point.x - 40,
              top: point.y - 40,
              transform: `scale(${scale})`
            }}
          />
        ))}
      </AnimatePresence>
 
      {/* Double Tap Indicator */}
      <AnimatePresence>
        {isDoubleTap && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.5 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed inset-0 bg-white/20 pointer-events-none"
            onAnimationComplete={() => setIsDoubleTap(false)}
          />
        )}
      </AnimatePresence>
 
      {/* Children with transform */}
      <motion.div
        style={{ scale }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </div>
  )
}
 
// Touch Gesture Components
interface SwipeableCardProps {
  children: React.ReactNode
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  className?: string
  threshold?: number
}
 
export const SwipeableCard = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  className,
  threshold = 100
}: SwipeableCardProps) => {
  const [x, setX] = useState(0)
  const [y, setY] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
 
  const handleDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setX(info.offset.x)
    setY(info.offset.y)
  }
 
  const handleDragEnd = () => {
    if (Math.abs(x) > threshold) {
      if (x > 0 && onSwipeRight) {
        onSwipeRight()
      } else if (x < 0 && onSwipeLeft) {
        onSwipeLeft()
      }
    }
 
    if (Math.abs(y) > threshold) {
      if (y > 0 && onSwipeDown) {
        onSwipeDown()
      } else if (y < 0 && onSwipeUp) {
        onSwipeUp()
      }
    }
 
    setX(0)
    setY(0)
    setIsDragging(false)
  }
 
  return (
    <motion.div
      className={cn('cursor-grab active:cursor-grabbing', className)}
      drag={true}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.2}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setIsDragging(false)}
      style={{
        x,
        y,
        transition: isDragging ? 'none' : 'transform 0.3s ease-out'
      }}
    >
      {children}
    </motion.div>
  )
}
 
interface PinchToZoomProps {
  children: React.ReactNode
  minScale?: number
  maxScale?: number
  className?: string
}
 
export const PinchToZoom = ({
  children,
  minScale = 0.5,
  maxScale = 3,
  className
}: PinchToZoomProps) => {
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
 
  const handlePinch = (event: MouseEvent | TouchEvent, { delta }: { delta: { x: number; y: number } }) => {
    setScale(prev => {
      const newScale = Math.max(minScale, Math.min(maxScale, prev + delta.y * 0.01))
      return newScale
    })
  }
 
  return (
    <motion.div
      className={cn('overflow-hidden', className)}
      style={{
        transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
        cursor: scale > 1 ? 'grab' : 'default'
      }}
      drag={scale > 1}
      dragMomentum={false}
      onDrag={(_, info) => {
        setPosition({ x: info.offset.x, y: info.offset.y })
      }}
      onDragEnd={() => setPosition({ x: 0, y: 0 })}
      onPinch={handlePinch}
    >
      {children}
    </motion.div>
  )
}
 
interface TouchMenuProps {
  children: React.ReactNode
  trigger: React.ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
  className?: string
}
 
export const TouchMenu = ({
  children,
  trigger,
  position = 'bottom',
  className
}: TouchMenuProps) => {
  const [isOpen, setIsOpen] = useState(false)
 
  const getPositionClasses = () => {
    switch (position) {
      case 'top':
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2'
      case 'bottom':
        return 'top-full left-1/2 transform -translate-x-1/2 mt-2'
      case 'left':
        return 'right-full top-1/2 transform -translate-y-1/2 mr-2'
      case 'right':
        return 'left-full top-1/2 transform -translate-y-1/2 ml-2'
    }
  }
 
  return (
    <div className="relative">
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: position === 'bottom' ? -10 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: position === 'bottom' ? -10 : 10 }}
            className={cn(
              'absolute z-50 bg-gray-900 border border-gray-700 rounded-lg shadow-xl',
              getPositionClasses(),
              className
            )}
          >
            <div className="p-2" onClick={() => setIsOpen(false)}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
