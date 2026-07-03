'use client'
 
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { Checkbox } from '@/components/ui/Checkbox'
import { Dropdown } from '@/components/ui/Dropdown'
import { Modal } from '@/components/ui/Modal'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { cn } from '@/components/ui/utils'
import { GenerateResponse } from '@/types/ai'
 
interface ImageManagerProps {
  isOpen: boolean
  onClose: () => void
}
 
interface FilterOptions {
  search: string
  provider: string
  model: string
  style: string
  quality: string
  dateRange: {
    start: Date | null
    end: Date | null
  }
}
 
const ImageManager = ({ isOpen, onClose }: ImageManagerProps) => {
  const [images, setImages] = useState<GenerateResponse[]>([])
  const [filteredImages, setFilteredImages] = useState<GenerateResponse[]>([])
  const [selectedImages, setSelectedImages] = useState<string[]>([])
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    provider: '',
    model: '',
    style: '',
    quality: '',
    dateRange: {
      start: null,
      end: null
    }
  })
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name' | 'size'>('newest')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [loading, setLoading] = useState(true)
 
  // Load images from localStorage (mock database)
  useEffect(() => {
    loadImages()
  }, [])
 
  // Apply filters and sorting
  useEffect(() => {
    applyFiltersAndSort()
  }, [images, filters, sortBy, viewMode])
 
  const loadImages = async () => {
    setLoading(true)
    try {
      // In production, this would fetch from a database
      const savedImages = localStorage.getItem('generatedImages')
      if (savedImages) {
        setImages(JSON.parse(savedImages))
      } else {
        // Load default images for demo
        const defaultImages = await fetch('/api/default-images')
        if (defaultImages.ok) {
          setImages(await defaultImages.json())
        }
      }
    } catch (error) {
      console.error('Error loading images:', error)
    } finally {
      setLoading(false)
    }
  }
 
  const applyFiltersAndSort = () => {
    let result = [...images]
 
    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      result = result.filter(img => 
        img.prompt.toLowerCase().includes(searchLower) ||
        img.model.toLowerCase().includes(searchLower) ||
        img.style.toLowerCase().includes(searchLower)
      )
    }
 
    // Apply provider filter
    if (filters.provider) {
      result = result.filter(img => img.provider === filters.provider)
    }
 
    // Apply model filter
    if (filters.model) {
      result = result.filter(img => img.model === filters.model)
    }
 
    // Apply style filter
    if (filters.style) {
      result = result.filter(img => img.style === filters.style)
    }
 
    // Apply quality filter
    if (filters.quality) {
      result = result.filter(img => img.quality === filters.quality)
    }
 
    // Apply date range filter
    if (filters.dateRange.start || filters.dateRange.end) {
      result = result.filter(img => {
        const imgDate = new Date(img.timestamp)
        if (filters.dateRange.start && imgDate < filters.dateRange.start) return false
        if (filters.dateRange.end && imgDate > filters.dateRange.end) return false
        return true
      })
    }
 
    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        case 'oldest':
          return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        case 'name':
          return a.prompt.localeCompare(b.prompt)
        case 'size':
          // This would need actual size data in production
          return 0
        default:
          return 0
      }
    })
 
    setFilteredImages(result)
  }
 
  const handleImageClick = (imageId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedImages(prev => 
      prev.includes(imageId)
        ? prev.filter(id => id !== imageId)
        : [...prev, imageId]
    )
  }
 
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedImages(filteredImages.map(img => img.id))
    } else {
      setSelectedImages([])
    }
  }
 
  const handleDelete = async () => {
    if (selectedImages.length === 0) return
 
    try {
      // In production, this would delete from database
      const updatedImages = images.filter(img => !selectedImages.includes(img.id))
      setImages(updatedImages)
      localStorage.setItem('generatedImages', JSON.stringify(updatedImages))
      setSelectedImages([])
    } catch (error) {
      console.error('Error deleting images:', error)
    }
  }
 
  const handleExport = async () => {
    if (selectedImages.length === 0) return
 
    try {
      // In production, this would export to cloud storage
      const selectedData = filteredImages.filter(img => selectedImages.includes(img.id))
      
      // Create a downloadable JSON file
      const dataStr = JSON.stringify(selectedData, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `ai-images-export-${Date.now()}.json`
      link.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error exporting images:', error)
    }
  }
 
  const handleShare = async () => {
    if (selectedImages.length === 0) return
 
    try {
      // In production, this would create shareable links
      const selectedData = filteredImages.filter(img => selectedImages.includes(img.id))
      const shareUrl = `/shared/${encodeURIComponent(JSON.stringify(selectedData))}`
      
      // Copy to clipboard
      await navigator.clipboard.writeText(window.location.origin + shareUrl)
      
      // Show success message
      alert('Share link copied to clipboard!')
    } catch (error) {
      console.error('Error sharing images:', error)
    }
  }
 
  const uniqueProviders = Array.from(new Set(images.map(img => img.provider)))
  const uniqueModels = Array.from(new Set(images.map(img => img.model)))
  const uniqueStyles = Array.from(new Set(images.map(img => img.style)))
  const uniqueQualities = Array.from(new Set(images.map(img => img.quality)))
 
  const clearFilters = () => {
    setFilters({
      search: '',
      provider: '',
      model: '',
      style: '',
      quality: '',
      dateRange: {
        start: null,
        end: null
      }
    })
  }
 
  const totalImages = images.length
  const filteredCount = filteredImages.length
  const selectedCount = selectedImages.length
 
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="AI Image Manager"
      size="full"
      className="max-w-7xl"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-2xl font-bold text-cyan-400">
              AI Image Library
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span>{totalImages} total</span>
              {filteredCount !== totalImages && (
                <span>• {filteredCount} filtered</span>
              )}
              {selectedCount > 0 && (
                <span>• {selectedCount} selected</span>
              )}
            </div>
          </div>
 
          <div className="flex items-center space-x-2">
            {/* View Mode Toggle */}
            <div className="flex rounded-lg bg-gray-800 p-1">
              <Button
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-md"
              >
                Grid
              </Button>
              <Button
                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-md"
              >
                List
              </Button>
            </div>
 
            {/* Filters Button */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2"
            >
              <span>Filters</span>
              {Object.values(filters).some(v => v) && (
                <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
              )}
            </Button>
          </div>
        </div>
 
        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4 p-4 bg-gray-800/50 rounded-lg"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                <Input
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  placeholder="Search images..."
                  className="w-full"
                />
                <Select
                  value={filters.provider}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, provider: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Providers</SelectItem>
                    {uniqueProviders.map(provider => (
                      <SelectItem key={provider} value={provider}>{provider}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={filters.model}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, model: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Models</SelectItem>
                    {uniqueModels.map(model => (
                      <SelectItem key={model} value={model}>{model}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={filters.style}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, style: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Styles</SelectItem>
                    {uniqueStyles.map(style => (
                      <SelectItem key={style} value={style}>{style}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={filters.quality}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, quality: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Quality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Qualities</SelectItem>
                    {uniqueQualities.map(quality => (
                      <SelectItem key={quality} value={quality}>{quality}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="text-gray-400 hover:text-white"
                >
                  Clear Filters
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
 
        {/* Actions Bar */}
        {selectedImages.length > 0 && (
          <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
            <div className="flex items-center space-x-4">
              <Checkbox
                checked={filteredImages.length > 0 && selectedImages.length === filteredImages.length}
                onCheckedChange={handleSelectAll}
              />
              <span className="text-sm text-gray-300">
                {selectedImages.length} selected
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={handleExport}
                className="text-green-400 hover:text-green-300"
              >
                Export
              </Button>
              <Button
                variant="outline"
                onClick={handleShare}
                className="text-blue-400 hover:text-blue-300"
              >
                Share
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
              >
                Delete
              </Button>
            </div>
          </div>
        )}
 
        {/* Images Grid/List */}
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <LoadingSpinner size="lg" />
          </div>
        ) : filteredImages.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No images found</p>
            {filters.search && (
              <button
                onClick={clearFilters}
                className="text-cyan-400 hover:text-cyan-300 mt-2"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredImages.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="relative group cursor-pointer"
                onClick={(e) => handleImageClick(image.id, e)}
              >
                <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-800">
                  <img
                    src={image.url}
                    alt={image.prompt}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  
                  {/* Selection Overlay */}
                  {selectedImages.includes(image.id) && (
                    <div className="absolute inset-0 bg-cyan-500/20 border-2 border-cyan-400"></div>
                  )}
                  
                  {/* Quick Actions */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Dropdown
                      trigger={
                        <button className="p-2 rounded-lg bg-gray-900/80 backdrop-blur-sm hover:bg-gray-800">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                          </svg>
                        </button>
                      }
                      items={[
                        { label: 'Download', onClick: () => downloadImage(image.url) },
                        { label: 'Share', onClick: () => shareImage(image) },
                        { label: 'Delete', onClick: () => deleteImage(image.id) }
                      ]}
                    />
                  </div>
                  
                  {/* Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-sm text-gray-200 line-clamp-2">
                      {image.prompt}
                    </p>
                    <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
                      <span>{image.provider}</span>
                      <span>{new Date(image.timestamp).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                {/* Checkbox */}
                <div className="absolute top-2 left-2">
                  <Checkbox
                    checked={selectedImages.includes(image.id)}
                    onChange={() => handleImageClick(image.id, {} as React.MouseEvent)}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredImages.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.02 }}
                className="flex items-center p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Checkbox
                  checked={selectedImages.includes(image.id)}
                  onChange={() => handleImageClick(image.id, {} as React.MouseEvent)}
                  className="mr-4"
                />
                <div className="relative w-16 h-16 rounded-lg overflow-hidden mr-4 flex-shrink-0">
                  <img
                    src={image.url}
                    alt={image.prompt}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-100 truncate">
                    {image.prompt}
                  </p>
                  <div className="flex items-center space-x-4 mt-1 text-xs text-gray-400">
                    <span>{image.provider}</span>
                    <span>•</span>
                    <span>{image.model}</span>
                    <span>•</span>
                    <span>{image.style}</span>
                    <span>•</span>
                    <span>{new Date(image.timestamp).toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => downloadImage(image.url)}
                  >
                    Download
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => shareImage(image)}
                  >
                    Share
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteImage(image.id)}
                  >
                    Delete
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  )
 
  // Helper functions
  function downloadImage(url: string) {
    const link = document.createElement('a')
    link.href = url
    link.download = `ai-image-${Date.now()}.jpg`
    link.click()
  }
 
  function shareImage(image: GenerateResponse) {
    const shareData = {
      title: 'AI Generated Image',
      text: image.prompt,
      url: image.url
    }
    if (navigator.share) {
      navigator.share(shareData)
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(JSON.stringify(shareData))
      alert('Image details copied to clipboard!')
    }
  }
 
  function deleteImage(imageId: string) {
    setImages(prev => prev.filter(img => img.id !== imageId))
    setSelectedImages(prev => prev.filter(id => id !== imageId))
    localStorage.setItem('generatedImages', JSON.stringify(images.filter(img => img.id !== imageId)))
  }
}
 
export default ImageManager
