import { cn } from '@/components/ui/utils'
import { useEffect } from 'react'
import LoadingSpinner from './LoadingSpinner'
 
interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  showCloseButton?: boolean
  closeOnOverlayClick?: boolean
  closeOnEscape?: boolean
  loading?: boolean
  backdropBlur?: boolean
}
 
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  className,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  loading = false,
  backdropBlur = true
}: ModalProps) => {
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full'
  }
 
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && closeOnEscape) {
        onClose()
      }
    }
 
    if (isOpen && closeOnEscape) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, closeOnEscape, onClose])
 
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])
 
  if (!isOpen) return null
 
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && closeOnOverlayClick) {
      onClose()
    }
  }
 
  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center p-4',
        backdropBlur && 'backdrop-blur-sm',
        'bg-black/50',
        'transition-all duration-200 ease-in-out',
        isOpen ? 'opacity-100' : 'opacity-0'
      )}
      onClick={handleOverlayClick}
    >
      <div
        className={cn(
          'relative transform transition-all duration-300 ease-out',
          'bg-gray-900 border border-cyan-500/20 rounded-lg shadow-2xl shadow-cyan-500/10',
          sizeClasses[size],
          className
        )}
        onClick={e => e.stopPropagation()}
        style={{
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? 'scale(1)' : 'scale(0.95)'
        }}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between p-6 border-b border-gray-800">
            <h3 className="text-xl font-bold text-white tracking-tight">
              {title}
            </h3>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-800 transition-colors duration-200 group"
                aria-label="Close modal"
              >
                <svg
                  className="w-5 h-5 text-gray-400 group-hover:text-gray-200 transition-colors duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        )}
 
        {/* Content */}
        <div className="relative">
          {loading && (
            <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-10">
              <div className="text-center">
                <LoadingSpinner size="lg" color="primary" />
                <p className="mt-3 text-gray-300">Processing...</p>
              </div>
            </div>
          )}
          <div className="p-6 max-h-[80vh] overflow-y-auto">
            {children}
          </div>
        </div>
 
        {/* Footer */}
        {!title && (
          <div className="flex justify-end p-4 border-t border-gray-800">
            {showCloseButton && (
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200"
              >
                Close
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
 
export default Modal
