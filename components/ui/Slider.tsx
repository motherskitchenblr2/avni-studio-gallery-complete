'use client'
 
import { useState, useEffect } from 'react'
import { cn } from '@/components/ui/utils'
 
interface SliderProps {
  min?: number
  max?: number
  step?: number
  value?: number
  onValueChange?: (value: number) => void
  disabled?: boolean
  className?: string
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger'
  showValue?: boolean
  label?: string
}
 
const Slider = ({
  min = 0,
  max = 100,
  step = 1,
  value = 0,
  onValueChange,
  disabled = false,
  className,
  size = 'md',
  color = 'primary',
  showValue = false,
  label
}: SliderProps) => {
  const [localValue, setLocalValue] = useState(value)
  const [isDragging, setIsDragging] = useState(false)
 
  useEffect(() => {
    setLocalValue(value)
  }, [value])
 
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return
    setIsDragging(true)
    updateValueFromEvent(e)
  }
 
  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && !disabled) {
      updateValueFromEvent(e)
    }
  }
 
  const handleMouseUp = () => {
    setIsDragging(false)
  }
 
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (disabled) return
    setIsDragging(true)
    updateValueFromTouchEvent(e)
  }
 
  const handleTouchMove = (e: TouchEvent) => {
    if (isDragging && !disabled) {
      updateValueFromTouchEvent(e)
    }
  }
 
  const handleTouchEnd = () => {
    setIsDragging(false)
  }
 
  const updateValueFromEvent = (e: React.MouseEvent | MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX || e.pageX
    const percentage = Math.max(0, Math.min(1, (x - rect.left) / rect.width))
    const newValue = Math.round((percentage * (max - min) + min) / step) * step
    setLocalValue(newValue)
    onValueChange?.(newValue)
  }
 
  const updateValueFromTouchEvent = (e: React.TouchEvent | TouchEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.touches[0].clientX
    const percentage = Math.max(0, Math.min(1, (x - rect.left) / rect.width))
    const newValue = Math.round((percentage * (max - min) + min) / step) * step
    setLocalValue(newValue)
    onValueChange?.(newValue)
  }
 
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.addEventListener('touchmove', handleTouchMove)
      document.addEventListener('touchend', handleTouchEnd)
    }
 
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [isDragging])
 
  const percentage = ((localValue - min) / (max - min)) * 100
  const colorClasses = {
    primary: 'bg-cyan-500',
    secondary: 'bg-purple-500',
    accent: 'bg-yellow-500',
    success: 'bg-green-500',
    warning: 'bg-orange-500',
    danger: 'bg-red-500'
  }
 
  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3'
  }
 
  return (
    <div className={cn('w-full space-y-2', className)}>
      {label && (
        <label className={cn(
          'text-sm font-medium text-gray-300',
          disabled && 'opacity-50'
        )}>
          {label}
        </label>
      )}
      
      <div className="flex items-center space-x-2">
        <span className={cn(
          'text-xs font-medium text-gray-500',
          disabled && 'opacity-50'
        )}>
          {min}
        </span>
        
        <div
          className={cn(
            'relative flex-1 h-4',
            sizeClasses[size],
            'bg-gray-700 rounded-full overflow-hidden',
            'cursor-pointer',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          {/* Track */}
          <div
            className={cn(
              'absolute top-0 left-0 h-full rounded-full',
              colorClasses[color]
            )}
            style={{ width: `${percentage}%` }}
          ></div>
          
          {/* Thumb */}
          <div
            className={cn(
              'absolute top-1/2 -translate-y-1/2 rounded-full',
              'bg-white shadow-lg',
              size === 'sm' ? 'w-3 h-3 -mt-1.5' : size === 'md' ? 'w-4 h-4 -mt-2' : 'w-5 h-5 -mt-2.5',
              'transition-transform duration-150',
              isDragging ? 'scale-110' : 'hover:scale-110',
              'border-2',
              colorClasses[color]
            )}
            style={{ left: `${percentage}%`, transform: `translateX(-50%) translateY(-50%)` }}
          ></div>
        </div>
        
        <span className={cn(
          'text-xs font-medium text-gray-500',
          disabled && 'opacity-50'
        )}>
          {max}
        </span>
      </div>
      
      {showValue && (
        <div className={cn(
          'text-center text-sm',
          disabled ? 'text-gray-500' : 'text-gray-300'
        )}>
          {localValue}
        </div>
      )}
    </div>
  )
}
 
export default Slider
