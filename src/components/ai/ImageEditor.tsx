'use client'
 
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Slider } from '@/components/ui/Slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { Modal } from '@/components/ui/Modal'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { cn } from '@/components/ui/utils'
import { EditRequest, EditResponse } from '@/types/ai'
 
interface ImageEditorProps {
  isOpen: boolean
  onClose: () => void
  initialImage?: string
}
 
const ImageEditor = ({ isOpen, onClose, initialImage }: ImageEditorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [selectedTool, setSelectedTool] = useState('enhance')
  const [intensity, setIntensity] = useState(50)
  const [brushSize, setBrushSize] = useState(20)
  const [isDrawing, setIsDrawing] = useState(false)
  const [editHistory, setEditHistory] = useState<ImageData[]>([])
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(-1)
  const [isProcessing, setIsProcessing] = useState(false)
 
  const tools = [
    { id: 'enhance', name: 'Enhance', icon: '✨' },
    { id: 'blur', name: 'Blur', icon: '🌫️' },
    { id: 'sharpen', name: 'Sharpen', icon: '🔍' },
    { id: 'brightness', name: 'Brightness', icon: '☀️' },
    { id: 'contrast', name: 'Contrast', icon: '🌓' },
    { id: 'saturation', name: 'Saturation', icon: '🎨' },
    { id: 'remove', name: 'Remove', icon: '🗑️' }
  ]
 
  useEffect(() => {
    if (initialImage) {
      loadImage(initialImage)
    }
  }, [initialImage])
 
  useEffect(() => {
    if (image) {
      drawImage()
    }
  }, [image])
 
  const loadImage = (src: string) => {
    const img = new Image()
    img.onload = () => {
      setImage(img)
      const canvas = canvasRef.current
      if (canvas) {
        canvas.width = img.width
        canvas.height = img.height
        drawImage()
      }
    }
    img.src = src
  }
 
  const drawImage = () => {
    const canvas = canvasRef.current
    if (canvas && image) {
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(image, 0, 0)
      }
    }
  }
 
  const saveToHistory = () => {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      if (ctx) {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const newHistory = editHistory.slice(0, currentHistoryIndex + 1)
        setEditHistory([...newHistory, imageData])
        setCurrentHistoryIndex(newHistory.length)
      }
    }
  }
 
  const undo = () => {
    if (currentHistoryIndex > 0) {
      const newIndex = currentHistoryIndex - 1
      setCurrentHistoryIndex(newIndex)
      const canvas = canvasRef.current
      if (canvas && editHistory[newIndex]) {
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.putImageData(editHistory[newIndex], 0, 0)
        }
      }
    }
  }
 
  const redo = () => {
    if (currentHistoryIndex < editHistory.length - 1) {
      const newIndex = currentHistoryIndex + 1
      setCurrentHistoryIndex(newIndex)
      const canvas = canvasRef.current
      if (canvas && editHistory[newIndex]) {
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.putImageData(editHistory[newIndex], 0, 0)
        }
      }
    }
  }
 
  const applyEdit = async () => {
    if (!image) return
 
    setIsProcessing(true)
    saveToHistory()
 
    try {
      const canvas = canvasRef.current
      if (canvas) {
        canvas.toBlob(async (blob) => {
          if (blob) {
            const formData = new FormData()
            formData.append('image', blob, 'edit.jpg')
            formData.append('tool', selectedTool)
            formData.append('intensity', intensity.toString())
 
            const response = await fetch('/api/edit', {
              method: 'POST',
              body: formData
            })
 
            if (!response.ok) {
              throw new Error('Edit failed')
            }
 
            const data = await response.json() as EditResponse
            loadImage(data.url)
          }
        }, 'image/jpeg', 0.95)
      }
    } catch (error) {
      console.error('Error applying edit:', error)
    } finally {
      setIsProcessing(false)
    }
  }
 
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!image || !canvasRef.current) return
 
    setIsDrawing(true)
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
 
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.beginPath()
      ctx.moveTo(x, y)
    }
  }
 
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !image || !canvasRef.current) return
 
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
 
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.lineTo(x, y)
      ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)'
      ctx.lineWidth = brushSize
      ctx.stroke()
    }
  }
 
  const handleMouseUp = () => {
    if (isDrawing) {
      setIsDrawing(false)
    }
  }
 
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!image || !canvasRef.current) return
 
    setIsDrawing(true)
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const touch = e.touches[0]
    const x = touch.clientX - rect.left
    const y = touch.clientY - rect.top
 
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.beginPath()
      ctx.moveTo(x, y)
    }
  }
 
  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !image || !canvasRef.current) return
 
    e.preventDefault()
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const touch = e.touches[0]
    const x = touch.clientX - rect.left
    const y = touch.clientY - rect.top
 
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.lineTo(x, y)
      ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)'
      ctx.lineWidth = brushSize
      ctx.stroke()
    }
  }
 
  const handleTouchEnd = () => {
    if (isDrawing) {
      setIsDrawing(false)
    }
  }
 
  const downloadImage = () => {
    const canvas = canvasRef.current
    if (canvas) {
      const link = document.createElement('a')
      link.download = 'edited-image.jpg'
      link.href = canvas.toDataURL('image/jpeg', 0.95)
      link.click()
    }
  }
 
  const resetImage = () => {
    if (image) {
      drawImage()
      setEditHistory([])
      setCurrentHistoryIndex(-1)
    }
  }
 
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="AI Image Editor"
      size="xl"
      loading={isProcessing}
    >
      <div className="space-y-6">
        {/* Canvas Container */}
        <div className="relative bg-gray-900 rounded-lg overflow-hidden">
          <canvas
            ref={canvasRef}
            className="max-w-full h-auto cursor-crosshair"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          />
          
          <AnimatePresence>
            {isProcessing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center"
              >
                <div className="text-center">
                  <LoadingSpinner size="lg" />
                  <p className="mt-3 text-gray-300">Processing...</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
 
        {/* Tools */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              AI Tools
            </label>
            <div className="grid grid-cols-4 gap-2">
              {tools.map((tool) => (
                <Button
                  key={tool.id}
                  variant={selectedTool === tool.id ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setSelectedTool(tool.id)}
                  className="flex flex-col items-center space-y-1 p-3 h-auto"
                >
                  <span className="text-xl">{tool.icon}</span>
                  <span className="text-xs">{tool.name}</span>
                </Button>
              ))}
            </div>
          </div>
 
          {/* Adjustments */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Intensity: {intensity}%
              </label>
              <Slider
                value={intensity}
                onValueChange={setIntensity}
                min={0}
                max={100}
                step={1}
                disabled={selectedTool === 'remove'}
              />
            </div>
 
            {selectedTool === 'remove' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Brush Size: {brushSize}px
                </label>
                <Slider
                  value={brushSize}
                  onValueChange={setBrushSize}
                  min={5}
                  max={100}
                  step={5}
                />
              </div>
            )}
          </div>
        </div>
 
        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={undo}
              disabled={currentHistoryIndex <= 0}
              className="px-3"
            >
              Undo
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={redo}
              disabled={currentHistoryIndex >= editHistory.length - 1}
              className="px-3"
            >
              Redo
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={resetImage}
              disabled={currentHistoryIndex <= 0}
              className="px-3"
            >
              Reset
            </Button>
          </div>
 
          <div className="flex items-center space-x-2">
            <Button
              onClick={applyEdit}
              disabled={isProcessing}
              className="px-6"
            >
              {isProcessing ? (
                <div className="flex items-center space-x-2">
                  <LoadingSpinner size="sm" />
                  <span>Applying...</span>
                </div>
              ) : (
                'Apply Edit'
              )}
            </Button>
            
            <Button
              variant="outline"
              onClick={downloadImage}
              className="px-6"
            >
              Download
            </Button>
          </div>
        </div>
 
        {/* Instructions */}
        <div className="p-4 bg-gray-800/50 rounded-lg">
          <p className="text-sm text-gray-400">
            {selectedTool === 'remove' 
              ? 'Click and drag on the image to remove areas. The AI will intelligently fill in the removed parts.'
              : 'Adjust the intensity and click "Apply Edit" to enhance your image with AI-powered tools.'
            }
          </p>
        </div>
      </div>
    </Modal>
  )
}
 
export default ImageEditor
