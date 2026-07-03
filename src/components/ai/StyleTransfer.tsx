'use client'
 
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { Slider } from '@/components/ui/Slider'
import { Modal } from '@/components/ui/Modal'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { cn } from '@/components/ui/utils'
import { StyleTransferRequest, StyleTransferResponse } from '@/types/ai'
 
interface StyleTransferProps {
  isOpen: boolean
  onClose: () => void
  initialImage?: string
}
 
interface StyleOption {
  id: string
  name: string
  description: string
  preview: string
  category: string
}
 
interface ReferenceImage {
  id: string
  url: string
  name: string
  style: string
}
 
const StyleTransfer = ({ isOpen, onClose, initialImage }: StyleTransferProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(initialImage || null)
  const [selectedStyle, setSelectedStyle] = useState<string>('van-gogh')
  const [referenceImage, setReferenceImage] = useState<string | null>(null)
  const [intensity, setIntensity] = useState(70)
  const [preserveContent, setPreserveContent] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [styleOptions, setStyleOptions] = useState<StyleOption[]>([])
  const [referenceImages, setReferenceImages] = useState<ReferenceImage[]>([])
  const [activeTab, setActiveTab] = useState<'style' | 'reference'>('style')
 
  const styles: StyleOption[] = [
    {
      id: 'van-gogh',
      name: 'Van Gogh',
      description: 'Post-impressionist brushstrokes',
      preview: '🌻',
      category: 'classic'
    },
    {
      id: 'picasso',
      name: 'Picasso',
      description: 'Cubist geometric style',
      preview: '🎨',
      category: 'classic'
    },
    {
      id: 'monet',
      name: 'Monet',
      description: 'Impressionist watercolor effect',
      preview: '💧',
      category: 'classic'
    },
    {
      id: 'anime',
      name: 'Anime',
      description: 'Japanese animation style',
      preview: '🎬',
      category: 'modern'
    },
    {
      id: 'cyberpunk',
      name: 'Cyberpunk',
      description: 'Neon-lit futuristic aesthetic',
      preview: '🌃',
      category: 'futuristic'
    },
    {
      id: 'oil-painting',
      name: 'Oil Painting',
      description: 'Classic oil texture',
      preview: '🖼️',
      category: 'classic'
    },
    {
      id: 'watercolor',
      name: 'Watercolor',
      description: 'Soft translucent washes',
      preview: '🎨',
      category: 'classic'
    },
    {
      id: 'pixel-art',
      name: 'Pixel Art',
      description: 'Retro 8-bit style',
      preview: '🎮',
      category: 'retro'
    },
    {
      id: 'black-and-white',
      name: 'B&W',
      description: 'Classic monochrome',
      preview: '⚫',
      category: 'classic'
    },
    {
      id: 'comic-book',
      name: 'Comic Book',
      description: 'Graphic novel style',
      preview: '📚',
      category: 'modern'
    }
  ]
 
  useEffect(() => {
    if (isOpen) {
      loadStyles()
      loadReferenceImages()
    }
  }, [isOpen])
 
  const loadStyles = () => {
    setStyleOptions(styles)
  }
 
  const loadReferenceImages = async () => {
    // Mock reference images
    const mockImages: ReferenceImage[] = [
      {
        id: '1',
        url: 'https://via.placeholder.com/200x200/4a5568/ffffff?text=Style+1',
        name: 'Urban Graffiti',
        style: 'street-art'
      },
      {
        id: '2',
        url: 'https://via.placeholder.com/200x200/2d3748/ffffff?text=Style+2',
        name: 'Digital Art',
        style: 'digital'
      },
      {
        id: '3',
        url: 'https://via.placeholder.com/200x200/1a202c/ffffff?text=Style+3',
        name: 'Abstract Pattern',
        style: 'abstract'
      }
    ]
    setReferenceImages(mockImages)
  }
 
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }
 
  const applyStyleTransfer = async () => {
    if (!selectedImage) return
 
    setIsProcessing(true)
    
    try {
      const request: StyleTransferRequest = {
        image: await fetchImage(selectedImage),
        style: selectedStyle,
        intensity,
        preserveContent
      }
 
      const response = await fetch('/api/style-transfer', {
        method: 'POST',
        body: JSON.stringify(request)
      })
 
      if (!response.ok) {
        throw new Error('Style transfer failed')
      }
 
      const data: StyleTransferResponse = await response.json()
      
      // Display result
      const canvas = canvasRef.current
      if (canvas) {
        const ctx = canvas.getContext('2d')
        if (ctx) {
          const img = new Image()
          img.onload = () => {
            canvas.width = img.width
            canvas.height = img.height
            ctx.drawImage(img, 0, 0)
          }
          img.src = data.url
        }
      }
    } catch (error) {
      console.error('Error applying style transfer:', error)
    } finally {
      setIsProcessing(false)
    }
  }
 
  const fetchImage = (url: string): Promise<File> => {
    return new Promise((resolve, reject) => {
      fetch(url)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], 'style-transfer-input.jpg', { type: 'image/jpeg' })
          resolve(file)
        })
        .catch(reject)
    })
  }
 
  const filteredStyles = styleOptions.filter(style => 
    activeTab === 'style' || style.category === activeTab
  )
 
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="AI Style Transfer"
      size="xl"
      loading={isProcessing}
    >
      <div className="space-y-6">
        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Select Image
          </label>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gray-700 file:text-sm file:font-medium file:text-cyan-400 hover:file:bg-gray-600"
              />
            </div>
            {selectedImage && (
              <Button
                variant="outline"
                onClick={() => setSelectedImage(null)}
                className="text-gray-400 hover:text-white"
              >
                Clear
              </Button>
            )}
          </div>
        </div>
 
        {/* Image Preview */}
        {selectedImage && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-300 mb-2">Original</p>
              <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-800">
                <img
                  src={selectedImage}
                  alt="Original"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-300 mb-2">Result</p>
              <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-800">
                <canvas
                  ref={canvasRef}
                  className="w-full h-full object-cover"
                />
                {!isProcessing && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80">
                    <p className="text-gray-400">Style transfer result will appear here</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
 
        {/* Style Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Choose Style
          </label>
          
          {/* Category Tabs */}
          <div className="flex space-x-2 mb-4">
            {['all', 'classic', 'modern', 'futuristic', 'retro'].map((category) => (
              <Button
                key={category}
                variant={activeTab === category ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab(category as any)}
                className="capitalize"
              >
                {category === 'all' ? 'All Styles' : category}
              </Button>
            ))}
          </div>
 
          {/* Style Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {filteredStyles.map((style) => (
              <motion.div
                key={style.id}
                whileHover={{ y: -5 }}
                className="relative cursor-pointer group"
                onClick={() => setSelectedStyle(style.id)}
              >
                <div className={cn(
                  'p-4 rounded-lg border-2 transition-all duration-200',
                  selectedStyle === style.id
                    ? 'border-cyan-400 bg-cyan-500/10'
                    : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                )}>
                  <div className="text-3xl mb-2">{style.preview}</div>
                  <h3 className="font-medium text-gray-100 text-sm">{style.name}</h3>
                  <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                    {style.description}
                  </p>
                </div>
                
                {selectedStyle === style.id && (
                  <div className="absolute top-1 right-1 w-2 h-2 bg-cyan-400 rounded-full"></div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
 
        {/* Reference Image */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-300">
              Reference Image (Optional)
            </label>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setReferenceImage(null)}
              disabled={!referenceImage}
            >
              Clear
            </Button>
          </div>
          
          {referenceImages.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {referenceImages.map((image) => (
                <div
                  key={image.id}
                  className="relative cursor-pointer group"
                  onClick={() => setReferenceImage(image.url)}
                >
                  <div className="aspect-square overflow-hidden rounded-lg border-2">
                    <img
                      src={image.url}
                      alt={image.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {referenceImage === image.url && (
                    <div className="absolute inset-0 border-2 border-cyan-400 rounded-lg"></div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
 
        {/* Controls */}
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
              step={5}
            />
          </div>
 
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="preserveContent"
              checked={preserveContent}
              onChange={(e) => setPreserveContent(e.target.checked)}
              className="rounded border-gray-600 bg-gray-800 text-cyan-500 focus:ring-cyan-500"
            />
            <label htmlFor="preserveContent" className="text-sm text-gray-300">
              Preserve original content and structure
            </label>
          </div>
        </div>
 
        {/* Action Buttons */}
        <div className="flex items-center space-x-4">
          <Button
            onClick={applyStyleTransfer}
            disabled={!selectedImage || isProcessing}
            className="flex-1"
          >
            {isProcessing ? (
              <div className="flex items-center space-x-2">
                <LoadingSpinner size="sm" />
                <span>Applying Style...</span>
              </div>
            ) : (
              'Apply Style Transfer'
            )}
          </Button>
          
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
        </div>
 
        {/* Tips */}
        <div className="p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
          <h4 className="text-sm font-medium text-cyan-400 mb-2">
            Pro Tips for Best Results
          </h4>
          <ul className="text-xs text-gray-300 space-y-1">
            <li>• Use high-quality, well-lit images for better transfer results</li>
            <li>• Adjust intensity between 70-90% for natural-looking results</li>
            <li>• Enable "Preserve Content" to keep the original subject recognizable</li>
            <li>• Experiment with different styles to find your favorite aesthetic</li>
          </ul>
        </div>
      </div>
    </Modal>
  )
}
 
export default StyleTransfer
