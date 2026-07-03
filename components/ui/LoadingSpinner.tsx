import { cn } from '@/components/ui/utils'
 
interface LoadingSpinnerProps {
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger'
  variant?: 'spinner' | 'dots' | 'pulse' | 'bars'
}
 
const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-12 w-12'
}
 
const colorClasses = {
  primary: 'text-cyan-400',
  secondary: 'text-purple-400',
  accent: 'text-yellow-400',
  success: 'text-green-400',
  warning: 'text-orange-400',
  danger: 'text-red-400'
}
 
const LoadingSpinner = ({ className, size = 'md', color = 'primary', variant = 'spinner' }: LoadingSpinnerProps) => {
  if (variant === 'dots') {
    return (
      <div className={cn('flex space-x-2', className)}>
        <div className={cn(
          'animate-pulse rounded-full bg-current',
          sizeClasses[size],
          colorClasses[color]
        )}></div>
        <div className={cn(
          'animate-pulse rounded-full bg-current',
          sizeClasses[size],
          colorClasses[color]
        )} style={{ animationDelay: '0.2s' }}></div>
        <div className={cn(
          'animate-pulse rounded-full bg-current',
          sizeClasses[size],
          colorClasses[color]
        )} style={{ animationDelay: '0.4s' }}></div>
      </div>
    )
  }
 
  if (variant === 'pulse') {
    return (
      <div className={cn(
        'animate-pulse rounded-full',
        sizeClasses[size],
        colorClasses[color],
        className
      )}></div>
    )
  }
 
  if (variant === 'bars') {
    return (
      <div className={cn('flex items-end space-x-1', className)}>
        <div className={cn(
          'animate-bounce rounded-sm bg-current',
          size === 'sm' ? 'w-1 h-4' : size === 'md' ? 'w-1.5 h-6' : size === 'lg' ? 'w-2 h-8' : 'w-3 h-10',
          colorClasses[color]
        )}></div>
        <div className={cn(
          'animate-bounce rounded-sm bg-current',
          size === 'sm' ? 'w-1 h-4' : size === 'md' ? 'w-1.5 h-6' : size === 'lg' ? 'w-2 h-8' : 'w-3 h-10',
          colorClasses[color]
        )} style={{ animationDelay: '0.1s' }}></div>
        <div className={cn(
          'animate-bounce rounded-sm bg-current',
          size === 'sm' ? 'w-1 h-4' : size === 'md' ? 'w-1.5 h-6' : size === 'lg' ? 'w-2 h-8' : 'w-3 h-10',
          colorClasses[color]
        )} style={{ animationDelay: '0.2s' }}></div>
        <div className={cn(
          'animate-bounce rounded-sm bg-current',
          size === 'sm' ? 'w-1 h-4' : size === 'md' ? 'w-1.5 h-6' : size === 'lg' ? 'w-2 h-8' : 'w-3 h-10',
          colorClasses[color]
        )} style={{ animationDelay: '0.3s' }}></div>
      </div>
    )
  }
 
  return (
    <div className={cn('relative', sizeClasses[size], className)}>
      <svg
        className={cn(
          'animate-spin',
          colorClasses[color],
          'opacity-75'
        )}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </div>
  )
}
 
export default LoadingSpinner
