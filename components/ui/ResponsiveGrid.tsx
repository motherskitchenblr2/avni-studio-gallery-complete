'use client'
 
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TouchGesture, SwipeableCard, PinchToZoom } from './TouchGesture'
import { cn } from './utils'
 
interface ResponsiveGridProps {
  children: React.ReactNode[]
  columns?: number
  gap?: number
  className?: string
  onSwipeLeft?: (index: number) => void
  onSwipeRight?: (index: number) => void
  onItemTap?: (index: number) => void
  onItemDoubleTap?: (index: number) => void
  enableSwipe?: boolean
  enableZoom?: boolean
  animation?: 'fade' | 'slide' | 'scale' | 'none'
}
 
interface GridItemProps {
  children: React.ReactNode
  index: number
  className?: string
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onTap?: () => void
  onDoubleTap?: () => void
  enableSwipe?: boolean
  enableZoom?: boolean
  animation?: 'fade' | 'slide' | 'scale' | 'none'
}
 
const ResponsiveGrid = ({
  children,
  columns = 3,
  gap = 4,
  className,
  onSwipeLeft,
  onSwipeRight,
  onItemTap,
  onItemDoubleTap,
  enableSwipe = true,
  enableZoom = true,
  animation = 'fade'
}: ResponsiveGridProps) => {
  const [gridColumns, setGridColumns] = useState(columns)
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  })
 
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      
      setWindowSize({ width, height })
      
      // Determine device type and columns
      setIsMobile(width < 768)
      setIsTablet(width >= 768 && width < 1024)
      
      if (width < 480) {
        setGridColumns(1)
      } else if (width < 768) {
        setGridColumns(2)
      } else if (width < 1024) {
        setGridColumns(3)
      } else if (width < 1280) {
        setGridColumns(4)
      } else {
        setGridColumns(5)
      }
    }
 
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
 
  const getAnimationProps = () => {
    switch (animation) {
      case 'fade':
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 }
        }
      case 'slide':
        return {
          initial: { x: 20, opacity: 0 },
          animate: { x: 0, opacity: 1 },
          exit: { x: -20, opacity: 0 }
        }
      case 'scale':
        return {
          initial: { scale: 0.8, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          exit: { scale: 0.8, opacity: 0 }
        }
      default:
        return {}
    }
  }
 
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
    gap: `${gap * 0.25}rem`
  }
 
  return (
    <div className={cn('w-full', className)} style={gridStyle}>
      <AnimatePresence mode="wait">
        {children.map((child, index) => (
          <GridItem
            key={index}
            index={index}
            onSwipeLeft={() => onSwipeLeft?.(index)}
            onSwipeRight={() => onSwipeRight?.(index)}
            onTap={() => onItemTap?.(index)}
            onDoubleTap={() => onItemDoubleTap?.(index)}
            enableSwipe={enableSwipe}
            enableZoom={enableZoom}
            animation={animation}
          >
            {child}
          </GridItem>
        ))}
      </AnimatePresence>
    </div>
  )
}
 
const GridItem = ({
  children,
  index,
  className,
  onSwipeLeft,
  onSwipeRight,
  onTap,
  onDoubleTap,
  enableSwipe,
  enableZoom,
  animation
}: GridItemProps) => {
  const [isZoomed, setIsZoomed] = useState(false)
  const [lastTap, setLastTap] = useState(0)
  
  const handleTap = () => {
    const now = Date.now()
    if (now - lastTap < 300) {
      // Double tap
      onDoubleTap?.()
      setIsZoomed(!isZoomed)
    } else {
      // Single tap
      onTap?.()
    }
    setLastTap(now)
  }
 
  const animationProps = animation === 'fade' ? {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { delay: index * 0.05 }
  } : animation === 'slide' ? {
    initial: { x: 20, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    transition: { delay: index * 0.05 }
  } : animation === 'scale' ? {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { delay: index * 0.05 }
  } : {}
 
  return (
    <motion.div
      className={cn(
        'relative overflow-hidden rounded-lg bg-gray-800/50',
        isZoomed && 'z-50',
        className
      )}
      {...animationProps}
    >
      {enableZoom ? (
        <PinchToZoom minScale={1} maxScale={3}>
          <div className="w-full h-full">
            {enableSwipe ? (
              <SwipeableCard
                onSwipeLeft={onSwipeLeft}
                onSwipeRight={onSwipeRight}
                className="cursor-grab active:cursor-grabbing"
              >
                <TouchGesture
                  onDoubleTap={handleTap}
                  onSwipe={(direction) => {
                    if (direction === 'left') onSwipeLeft?.()
                    if (direction === 'right') onSwipeRight?.()
                  }}
                  onDoubleTap={handleTap}
                >
                  {children}
                </TouchGesture>
              </SwipeableCard>
            ) : (
              <TouchGesture
                onDoubleTap={handleTap}
                onSwipe={(direction) => {
                  if (direction === 'left') onSwipeLeft?.()
                  if (direction === 'right') onSwipeRight?.()
                }}
                onDoubleTap={handleTap}
              >
                {children}
              </TouchGesture>
            )}
          </div>
        </PinchToZoom>
      ) : (
        <TouchGesture
          onDoubleTap={handleTap}
          onSwipe={(direction) => {
            if (direction === 'left') onSwipeLeft?.()
            if (direction === 'right') onSwipeRight?.()
          }}
          onDoubleTap={handleTap}
        >
          {children}
        </TouchGesture>
      )}
      
      {/* Zoom indicator */}
      {isZoomed && (
        <div className="absolute top-2 right-2 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-md text-xs text-cyan-400">
          Zoom: 3x
        </div>
      )}
    </motion.div>
  )
}
 
interface MasonryGridProps {
  children: React.ReactNode[]
  columns?: number
  gap?: number
  className?: string
  columnWidth?: number
}
 
const MasonryGrid = ({
  children,
  columns = 3,
  gap = 4,
  className,
  columnWidth = 300
}: MasonryGridProps) => {
  const [columnHeights, setColumnHeights] = useState<number[]>(Array(columns).fill(0))
 
  const getColumn = () => {
    const minHeight = Math.min(...columnHeights)
    return columnHeights.indexOf(minHeight)
  }
 
  const updateColumnHeight = (index: number, height: number) => {
    const newHeights = [...columnHeights]
    newHeights[index] = height
    setColumnHeights(newHeights)
  }
 
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, ${columnWidth}px)`,
    gap: `${gap * 0.25}rem`,
    gridAutoFlow: 'row dense'
  }
 
  return (
    <div className={cn('w-full mx-auto', className)} style={gridStyle}>
      {children.map((child, index) => {
        const columnIndex = getColumn()
        const itemHeight = Math.floor(Math.random() * 200) + 200 // Random height for demo
        
        return (
          <motion.div
            key={index}
            className="overflow-hidden rounded-lg bg-gray-800/50"
            style={{
              gridRowEnd: `span ${Math.ceil(itemHeight / (columnWidth + gap))}`
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onAnimationComplete={() => updateColumnHeight(columnIndex, itemHeight)}
          >
            {child}
          </motion.div>
        )
      })}
    </div>
  )
}
 
interface FluidGridProps {
  children: React.ReactNode[]
  minColumns?: number
  maxColumns?: number
  gap?: number
  className?: string
}
 
const FluidGrid = ({
  children,
  minColumns = 1,
  maxColumns = 5,
  gap = 4,
  className
}: FluidGridProps) => {
  const [columns, setColumns] = useState(minColumns)
 
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      let newColumns = minColumns
 
      if (width >= 1280) {
        newColumns = maxColumns
      } else if (width >= 1024) {
        newColumns = 4
      } else if (width >= 768) {
        newColumns = 3
      } else if (width >= 480) {
        newColumns = 2
      }
 
      setColumns(newColumns)
    }
 
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [minColumns, maxColumns])
 
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap: `${gap * 0.25}rem`
  }
 
  return (
    <div className={cn('w-full', className)} style={gridStyle}>
      {children.map((child, index) => (
        <motion.div
          key={index}
          className="overflow-hidden rounded-lg bg-gray-800/50"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  )
}
 
export { ResponsiveGrid, MasonryGrid, FluidGrid }
