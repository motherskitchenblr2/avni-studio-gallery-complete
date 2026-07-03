'use client'
 
import { useState, useRef, useEffect } from 'react'
import { cn } from '@/components/ui/utils'
 
interface DropdownItem {
  label: string
  onClick?: () => void
  href?: string
  disabled?: boolean
  divider?: boolean
  icon?: React.ReactNode
}
 
interface DropdownProps {
  trigger: React.ReactNode
  items: DropdownItem[]
  className?: string
  menuClassName?: string
  align?: 'left' | 'right' | 'center'
  triggerOnHover?: boolean
  onClose?: () => void
}
 
const Dropdown = ({
  trigger,
  items,
  className,
  menuClassName,
  align = 'left',
  triggerOnHover = false,
  onClose
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const triggerRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
 
  const closeDropdown = () => {
    setIsOpen(false)
    onClose?.()
  }
 
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeDropdown()
      }
    }
 
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])
 
  const handleTriggerClick = () => {
    setIsOpen(!isOpen)
  }
 
  const handleTriggerHover = () => {
    if (triggerOnHover) {
      setIsOpen(true)
    }
  }
 
  const handleTriggerLeave = () => {
    if (triggerOnHover) {
      setIsOpen(false)
    }
  }
 
  const handleItemClick = (item: DropdownItem) => {
    if (item.disabled) return
    item.onClick?.()
    closeDropdown()
  }
 
  const alignmentClasses = {
    left: 'left-0',
    right: 'right-0',
    center: 'left-1/2 transform -translate-x-1/2'
  }
 
  return (
    <div
      ref={dropdownRef}
      className={cn('relative inline-block', className)}
      onClick={triggerOnHover ? undefined : handleTriggerClick}
      onMouseEnter={triggerOnHover ? handleTriggerHover : undefined}
      onMouseLeave={triggerOnHover ? handleTriggerLeave : undefined}
    >
      <div ref={triggerRef}>
        {trigger}
      </div>
      
      {isOpen && (
        <div
          ref={menuRef}
          className={cn(
            'absolute z-50 mt-2 w-48 bg-gray-900 border border-cyan-500/20 rounded-lg shadow-xl shadow-cyan-500/10',
            'py-1 overflow-hidden',
            alignmentClasses[align],
            menuClassName
          )}
          style={{
            top: triggerRef.current ? triggerRef.current.offsetHeight + 4 : 0
          }}
        >
          {items.map((item, index) => (
            <div key={index}>
              {item.divider ? (
                <div className="border-t border-gray-700 my-1"></div>
              ) : (
                <button
                  onClick={() => handleItemClick(item)}
                  disabled={item.disabled}
                  className={cn(
                    'w-full flex items-center px-4 py-2 text-left text-sm',
                    'text-gray-300 hover:bg-cyan-500/10 hover:text-cyan-400 transition-colors duration-200',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    item.disabled ? 'pointer-events-none' : ''
                  )}
                >
                  {item.icon && (
                    <span className="mr-3 flex-shrink-0">
                      {item.icon}
                    </span>
                  )}
                  {item.label}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
 
export default Dropdown
