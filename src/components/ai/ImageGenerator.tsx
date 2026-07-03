'use client'
 
import { useState } from 'react'
import { motion } from 'framer-motion'
import { GenerateResponse, ImageGenerationRequest, AIService } from '@/types/ai'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { Slider } from '@/components/ui/Slider'
import { Modal } from '@/components/ui/Modal'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { cn } from '@/components/ui/utils'
 
interface ImageGeneratorProps {
  isOpen: boolean
  onClose: () => void
}
 
const ImageGenerator = ({ isOpen, onClose }: ImageGeneratorProps) => {
  const [prompt, setPrompt] = useState('')
  const [selectedModel, setSelectedModel] = useState('openai-dall-e-3')
  const [size, setSize] = useState('1024x1024')
  const [quality, setQuality] = useState('hd')
  const [style, setStyle] = useState('natural')
  const [seed, setSeed] = useState<number | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImages, setGeneratedImages] = useState<GenerateResponse[]>([])
  const [showVariations, setShowVariations] = useState(false)
  const [selectedImage, setSelectedImage] = useState<GenerateResponse | null>(null)
 
  const models = [
    { id: 'openai-dall-e-3', name: 'DALL-E 3', provider: 'OpenAI' },
    { id: 'stability-sd-xl', name: 'Stable Diffusion XL', provider: 'Stability AI' },
    { id: 'midjourney-v6', name: 'Midjourney V6', provider: 'Midjourney' },
    { id: 'firefly', name: 'Adobe Firefly', provider: 'Adobe' }
  ]
 
  const sizes = [
    { id: '1024x1024', name: 'Square (1024×1024)' },
    { id: '1792x1024', name: 'Landscape (1792×1024)' },
    { id: '1024x1792', name: 'Portrait (1024×1792)' },
    { id: 'square_hd', name: 'HD Square (768×768)' }
  ]
 
  const qualities = [
    { id: 'standard', name: 'Standard' },
    { id: 'hd', name: 'HD' },
    { id: 'ultra_hd', name: 'Ultra HD' }
  ]
 
  const styles = [
    { id: 'natural', name: 'Natural' },
    { id: 'vivid', name: 'Vivid' },
    { id: 'photorealistic', name: 'Photorealistic' },
    { id: 'abstract', name: 'Abstract' },
    { id: 'cyberpunk', name: 'Cyberpunk' }
  ]
 
  const generateImage = async () => {
    if (!prompt.trim()) return
 
    setIsGenerating(true)
    
    try {
      const request: ImageGenerationRequest = {
        prompt: prompt.trim(),
        model: selectedModel,
        size,
        quality,
        style,
        seed: seed || undefined
      }
 
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request)
      })
 
      if (!response.ok) {
        throw new Error('Failed to generate image')
      }
 
      const data = await response.json() as GenerateResponse
      
      setGeneratedImages(prev => [data, ...prev.slice(0, 3)])
      setPrompt('')
    } catch (error) {
      console.error('Error generating image:', error)
    } finally {
      setIsGenerating(false)
    }
  }
 
  const generateVariations = async () => {
    if (!selectedImage) return
 
    setIsGenerating(true)
    
    try {
      const request: ImageGenerationRequest = {
        prompt: selectedImage.prompt,
        model: selectedImage.model,
        size,
        quality,
        style,
        seed: selectedImage.seed ? selectedImage.seed + 1 : Math.floor(Math.random() * 1000000)
      }
 
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request)
      })
 
      if (!response.ok) {
        throw new Error('Failed to generate variations')
      }
 
      const data = await response.json() as GenerateResponse
      
      setGeneratedImages(prev => [data, ...prev.slice(0, 3)])
      setShowVariations(false)
    } catch (error) {
      console.error('Error generating variations:', error)
    } finally {
      setIsGenerating(false)
    }
  }
 
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      generateImage()
    }
  }
 
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="AI Image Generator"
      size="xl"
      loading={isGenerating}
    >
      <div className="space-y-6">
        {/* Prompt Input */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Describe what you want to generate
          </label>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter a detailed description of the image you want to generate..."
            rows={4}
            className="resize-none"
          />
          <p className="text-xs text-gray-500 mt-1">
            Be specific and detailed for better results
          </p>
        </div>
 
        {/* Model Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Model
            </label>
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {models.map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                      <span>{model.name}</span>
                      <span className="text-xs text-gray-500">({model.provider})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
 
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Size
            </label>
            <Select value={size} onValueChange={setSize}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sizes.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
 
        {/* Advanced Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Quality
            </label>
            <Select value={quality} onValueChange={setQuality}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {qualities.map((q) => (
                  <SelectItem key={q.id} value={q.id}>
                    {q.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
 
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Style
            </label>
            <Select value={style} onValueChange={setStyle}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {styles.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
 
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Seed (Optional)
            </label>
            <Input
              type="number"
              value={seed || ''}
              onChange={(e) => setSeed(e.target.value ? parseInt(e.target.value) : null)}
              placeholder="Random"
              className="w-full"
            />
          </div>
        </div>
 
        {/* Generate Button */}
        <div className="flex items-center space-x-4">
          <Button
            onClick={generateImage}
            disabled={!prompt.trim() || isGenerating}
            className="flex-1"
            size="lg"
          >
            {isGenerating ? (
              <div className="flex items-center space-x-2">
                <LoadingSpinner size="sm" />
                <span>Generating...</span>
              </div>
            ) : (
              'Generate Image'
            )}
          </Button>
 
          <Button
            onClick={() => setPrompt('')}
            variant="outline"
            disabled={!prompt}
          >
            Clear
          </Button>
        </div>
 
        {/* Generated Images */}
        {generatedImages.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-100">
                Recent Generations
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setGeneratedImages([])}
              >
                Clear All
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {generatedImages.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative group cursor-pointer"
                  onClick={() => {
                    setSelectedImage(image)
                    setShowVariations(true)
                  }}
                >
                  <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-800">
                    <img
                      src={image.url}
                      alt={image.prompt}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <p className="text-sm text-gray-200 line-clamp-2">
                          {image.prompt}
                        </p>
                        <div className="mt-2 flex items-center space-x-2 text-xs text-gray-400">
                          <span>{image.model}</span>
                          <span>•</span>
                          <span>{new Date(image.timestamp).toLocaleTimeString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
 
    {/* Variations Modal */}
    <Modal
      isOpen={showVariations}
      onClose={() => setShowVariations(false)}
      title="Generate Variations"
      size="md"
    >
      {selectedImage && (
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg">
            <img
              src={selectedImage.url}
              alt={selectedImage.prompt}
              className="w-full h-full object-cover"
            />
          </div>
          
          <p className="text-sm text-gray-300">
            Create variations of this image with the same prompt but different
            interpretations and styles.
          </p>
          
          <div className="flex items-center space-x-4">
            <Button
              onClick={generateVariations}
              disabled={isGenerating}
              className="flex-1"
            >
              {isGenerating ? (
                <div className="flex items-center space-x-2">
                  <LoadingSpinner size="sm" />
                  <span>Generating...</span>
                </div>
              ) : (
                'Generate Variations'
              )}
            </Button>
            
            <Button
              variant="outline"
              onClick={() => setShowVariations(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </Modal>
  )
}
 
export default ImageGenerator
