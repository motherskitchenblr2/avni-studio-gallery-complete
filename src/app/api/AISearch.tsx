'use client'
 
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Dropdown } from '@/components/ui/Dropdown'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { Modal } from '@/components/ui/Modal'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { cn } from '@/components/ui/utils'
import { GenerateResponse } from '@/types/ai'
 
interface AISearchProps {
  isOpen: boolean
  onClose: () => void
}
 
interface SearchQuery {
  query: string
  category: string
  style: string
  color: string
  aspectRatio: string
  mood: string
  sortBy: 'relevance' | 'date' | 'size' | 'quality'
  filters: {
    hasAI: boolean
    hasPeople: boolean
    hasText: boolean
    minQuality: number
  }
}
 
const AI_SEARCH_SUGGESTIONS = [
  'futuristic cyberpunk city at night',
  'abstract digital art with neon colors',
  'portrait of a woman in virtual reality',
  'sunset over a futuristic metropolis',
  'geometric patterns with glowing elements',
  'AI-generated landscape painting',
  'cyborg character with neon accents',
  'digital art style resembling glitch effects',
  'space nebula with vibrant colors',
  'surreal dreamlike landscape'
]
 
const STYLES = [
  'realistic', 'abstract', 'digital art', 'photorealistic', 'painting', 
  '3D render', 'minimalist', 'maximalist', 'cyberpunk', 'vaporwave'
]
 
const COLORS = [
  'red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 
  'black', 'white', 'monochrome', 'neon', 'pastel'
]
 
const MOODS = [
  'happy', 'sad', 'mysterious', 'energetic', 'calm', 'dramatic',
  'romantic', 'futuristic', 'nostalgic', 'whimsical', 'serious'
]
 
const CATEGORIES = [
  'portrait', 'landscape', 'abstract', 'architecture', 'nature',
  'technology', 'fashion', 'food', 'animals', 'fantasy'
]
 
const ASPECT_RATIOS = [
  'square', 'landscape', 'portrait', 'wide', 'ultra-wide'
]
 
const AISearch = ({ isOpen, onClose }: AISearchProps) => {
  const [searchQuery, setSearchQuery] = useState<SearchQuery>({
    query: '',
    category: '',
    style: '',
    color: '',
    aspectRatio: '',
    mood: '',
    sortBy: 'relevance',
    filters: {
      hasAI: true,
      hasPeople: false,
      hasText: false,
      minQuality: 70
    }
  })
  const [searchResults, setSearchResults] = useState<GenerateResponse[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const queryRef = useRef<HTMLInputElement>(null)
 
  // Load search history from localStorage
  useEffect(() => {
    const history = localStorage.getItem('aiSearchHistory')
    if (history) {
      setSearchHistory(JSON.parse(history))
    }
  }, [])
 
  // Save search history
  const saveToHistory = (query: string) => {
    if (query.trim()) {
      const newHistory = [query, ...searchHistory.filter(q => q !== query)].slice(0, 20)
      setSearchHistory(newHistory)
      localStorage.setItem('aiSearchHistory', JSON.stringify(newHistory))
    }
  }
 
  // Handle search
  const handleSearch = async () => {
    if (!searchQuery.query.trim()) return
 
    setIsSearching(true)
    saveToHistory(searchQuery.query)
 
    try {
      // Mock search API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Generate mock results based on query
      const results = generateMockResults(searchQuery)
      setSearchResults(results)
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setIsSearching(false)
      setShowSuggestions(false)
    }
  }
 
  // Generate mock search results
  const generateMockResults = (query: SearchQuery): GenerateResponse[] => {
    const baseResults: GenerateResponse[] = JSON.parse(localStorage.getItem('generatedImages') || '[]')
    
    // Filter based on query
    let results = baseResults.filter(img => 
      img.prompt.toLowerCase().includes(query.query.toLowerCase())
    )
 
    // Apply other filters
    if (query.category) {
      results = results.filter(img => 
        img.prompt.toLowerCase().includes(query.category)
      )
    }
 
    if (query.style) {
      results = results.filter(img => img.style === query.style)
    }
 
    if (query.color) {
      // Mock color filter
      results = results.filter(() => true)
    }
 
    // Apply sorting
    switch (query.sortBy) {
      case 'date':
        results.sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )
        break
      case 'size':
        // Mock size sorting
        results.sort(() => Math.random() - 0.5)
        break
      case 'quality':
        results.sort((a, b) => 
          (b.quality === 'ultra_hd' ? 100 : b.quality === 'hd' ? 80 : 60) -
          (a.quality === 'ultra_hd' ? 100 : a.quality === 'hd' ? 80 : 60)
        )
        break
      default:
        // Relevance - keep as is
        break
    }
 
    return results.slice(0, 20) // Limit to 20 results
  }
 
  // Quick search with suggestions
  const quickSearch = (suggestion: string) => {
    setSearchQuery(prev => ({ ...prev, query: suggestion }))
    setShowSuggestions(false)
    setTimeout(() => handleSearch(), 100)
  }
 
  // Clear search
  const clearSearch = () => {
    setSearchQuery({
      query: '',
      category: '',
      style: '',
      color: '',
      aspectRatio: '',
      mood: '',
      sortBy: 'relevance',
      filters: {
        hasAI: true,
        hasPeople: false,
        hasText: false,
        minQuality: 70
      }
    })
    setSearchResults([])
    setShowSuggestions(false)
  }
 
  // Clear history
  const clearHistory = () => {
    setSearchHistory([])
    localStorage.removeItem('aiSearchHistory')
  }
 
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="AI Search"
      size="xl"
    >
      <div className="space-y-6">
        {/* Search Input */}
        <div className="relative">
          <Input
            ref={queryRef}
            value={searchQuery.query}
            onChange={(e) => setSearchQuery(prev => ({ ...prev, query: e.target.value }))}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Search for images using AI-powered search..."
            className="pr-16"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-2">
            {searchQuery.query && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSearch}
              >
                Clear
              </Button>
            )}
            <Button
              onClick={handleSearch}
              disabled={isSearching || !searchQuery.query.trim()}
              className="px-4"
            >
              {isSearching ? (
                <LoadingSpinner size="sm" />
              ) : (
                <span>Search</span>
              )}
            </Button>
          </div>
        </div>
 
        {/* Suggestions */}
        <AnimatePresence>
          {showSuggestions && searchQuery.query.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute z-10 w-full mt-2 bg-gray-900 border border-gray-700 rounded-lg shadow-lg"
            >
              <div className="p-2">
                <p className="text-xs text-gray-400 mb-2">Search suggestions:</p>
                {AI_SEARCH_SUGGESTIONS.filter(s => 
                  s.toLowerCase().includes(searchQuery.query.toLowerCase())
                ).slice(0, 5).map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => quickSearch(suggestion)}
                    className="w-full text-left px-3 py-2 hover:bg-gray-800 rounded transition-colors"
                  >
                    <span className="text-gray-300">{suggestion}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
 
        {/* Advanced Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Select
            value={searchQuery.category}
            onValueChange={(value) => setSearchQuery(prev => ({ ...prev, category: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              {CATEGORIES.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
 
          <Select
            value={searchQuery.style}
            onValueChange={(value) => setSearchQuery(prev => ({ ...prev, style: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Styles</SelectItem>
              {STYLES.map(style => (
                <SelectItem key={style} value={style}>{style}</SelectItem>
              ))}
            </SelectContent>
          </Select>
 
          <Select
            value={searchQuery.color}
            onValueChange={(value) => setSearchQuery(prev => ({ ...prev, color: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Color" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Colors</SelectItem>
              {COLORS.map(color => (
                <SelectItem key={color} value={color}>{color}</SelectItem>
              ))}
            </SelectContent>
          </Select>
 
          <Select
            value={searchQuery.aspectRatio}
            onValueChange={(value) => setSearchQuery(prev => ({ ...prev, aspectRatio: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Aspect Ratio" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Ratios</SelectItem>
              {ASPECT_RATIOS.map(ratio => (
                <SelectItem key={ratio} value={ratio}>{ratio}</SelectItem>
              ))}
            </SelectContent>
          </Select>
 
          <Select
            value={searchQuery.mood}
            onValueChange={(value) => setSearchQuery(prev => ({ ...prev, mood: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Mood" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Moods</SelectItem>
              {MOODS.map(mood => (
                <SelectItem key={mood} value={mood}>{mood}</SelectItem>
              ))}
            </SelectContent>
          </Select>
 
          <Select
            value={searchQuery.sortBy}
            onValueChange={(value: any) => setSearchQuery(prev => ({ ...prev, sortBy: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevance</SelectItem>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="size">Size</SelectItem>
              <SelectItem value="quality">Quality</SelectItem>
            </SelectContent>
          </Select>
        </div>
 
        {/* Filters */}
        <div className="flex items-center space-x-4 p-4 bg-gray-800/50 rounded-lg">
          <span className="text-sm font-medium text-gray-300">Filters:</span>
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <Checkbox
                checked={searchQuery.filters.hasAI}
                onChange={(checked) => setSearchQuery(prev => ({
                  ...prev,
                  filters: { ...prev.filters, hasAI: checked }
                }))}
              />
              <span className="text-sm">AI Generated</span>
            </label>
            <label className="flex items-center space-x-2">
              <Checkbox
                checked={searchQuery.filters.hasPeople}
                onChange={(checked) => setSearchQuery(prev => ({
                  ...prev,
                  filters: { ...prev.filters, hasPeople: checked }
                }))}
              />
              <span className="text-sm">Has People</span>
            </label>
            <label className="flex items-center space-x-2">
              <Checkbox
                checked={searchQuery.filters.hasText}
                onChange={(checked) => setSearchQuery(prev => ({
                  ...prev,
                  filters: { ...prev.filters, hasText: checked }
                }))}
              />
              <span className="text-sm">Has Text</span>
            </label>
            <div className="flex items-center space-x-2">
              <span className="text-sm">Min Quality:</span>
              <span className="text-sm text-cyan-400">{searchQuery.filters.minQuality}%</span>
            </div>
          </div>
        </div>
 
        {/* Search History */}
        {searchHistory.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-300">Recent Searches</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearHistory}
              >
                Clear
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {searchHistory.map((search, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSearchQuery(prev => ({ ...prev, query: search }))
                    handleSearch()
                  }}
                  className="px-3 py-1 text-sm bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"
                >
                  {search}
                </button>
              ))}
            </div>
          </div>
        )}
 
        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-400">
                Found {searchResults.length} results
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {searchResults.map((image, index) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="group cursor-pointer"
                  onClick={() => window.open(image.url, '_blank')}
                >
                  <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-800">
                    <img
                      src={image.url}
                      alt={image.prompt}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                      <p className="text-xs text-gray-200 line-clamp-2">
                        {image.prompt}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
 
        {/* No Results */}
        {searchResults.length === 0 && searchQuery.query && !isSearching && (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-gray-400 text-lg">
              No images found for "{searchQuery.query}"
            </p>
            <p className="text-gray-500 mt-2">
              Try adjusting your search terms or filters
            </p>
          </div>
        )}
      </div>
    </Modal>
  )
}
 
export default AISearch
