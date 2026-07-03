'use client'
 
import { useState } from 'react'
import { cn } from '@/components/ui/utils'
 
interface CheckboxProps {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
  required?: boolean
  className?: string
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger'
  id?: string
  label?: string
  error?: string
}
 
const Checkbox = ({
  checked = false,
  onCheckedChange,
  disabled = false,
  required = false,
  className,
  size = 'md',
  color = 'primary',
  id,
  label,
  error
}: CheckboxProps) => {
  const [isHovered, setIsHovered] = useState(false)
 
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  }
 
  const colorClasses = {
    primary: 'text-cyan-500 border-cyan-500 focus:ring-cyan-500',
    secondary: 'text-purple-500 border-purple-500 focus:ring-purple-500',
    accent: 'text-yellow-500 border-yellow-500 focus:ring-yellow-500',
    success: 'text-green-500 border-green-500 focus:ring-green-500',
    warning: 'text-orange-500 border-orange-500 focus:ring-orange-500',
    danger: 'text-red-500 border-red-500 focus:ring-red-500'
  }
 
  const handleCheckedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!disabled) {
      onCheckedChange?.(e.target.checked)
    }
  }
 
  return (
    <div className={cn('inline-flex items-center space-x-2', className)}>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={handleCheckedChange}
        disabled={disabled}
        required={required}
        className={cn(
          'rounded border-gray-600 bg-gray-800 text-cyan-500',
          'focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900',
          'focus:ring-cyan-500 transition-all duration-200',
          'cursor-pointer',
          disabled && 'opacity-50 cursor-not-allowed',
          sizeClasses[size],
          colorClasses[color]
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          boxShadow: isHovered && !disabled ? `0 0 0 3px ${color === 'primary' ? 'rgba(6, 182, 212, 0.1)' : 'rgba(255, 255, 255, 0.1)'}` : 'none'
        }}
      />
      
      {label && (
        <label
          htmlFor={id}
          className={cn(
            'text-sm font-medium',
            checked ? 'text-gray-100' : 'text-gray-400',
            disabled ? 'opacity-50' : 'cursor-pointer',
            'select-none'
          )}
        >
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      
      {error && (
        <p className="text-xs text-red-400 mt-1">{error}</p>
      )}
    </div>
  )
}
 
export default Checkbox
