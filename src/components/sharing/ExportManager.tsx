'use client'
 
import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Download, 
  Share2, 
  FileText, 
  Image, 
  Video, 
  Music, 
  Archive, 
  Globe, 
  Mail, 
  Link,
  Copy,
  QrCode,
  Settings,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Filter,
  SortAsc,
  Layers,
  Palette
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { Modal } from '@/components/ui/Modal'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { cn } from '@/components/ui/utils'
 
interface ExportItem {
  id: string
  name: string
  type: 'image' | 'collection' | 'project' | 'workspace'
  format: 'jpg' | 'png' | 'webp' | 'pdf' | 'zip' | 'mp4' | 'mp3'
  size: string
  quality: 'low' | 'medium' | 'high' | 'original'
  resolution?: string
  metadata: boolean
  watermark: boolean
  progress: number
  status: 'pending' | 'processing' | 'completed' | 'failed'
  error?: string
}
 
interface ShareLink {
  id: string
  name: string
  url: string
  access: 'public' | 'private' | 'restricted'
  password?: string
  expiry?: string
  download: boolean
  comments: boolean
  analytics: boolean
  createdAt: string
  views: number
}
 
interface ExportManagerProps {
  isOpen: boolean
  onClose: () => void
  selectedItems?: string[]
}
 
const exportFormats = [
  { value: 'jpg', label: 'JPEG', icon: Image, extensions: ['.jpg', '.jpeg'] },
  { value: 'png', label: 'PNG', icon: Image, extensions: ['.png'] },
  { value: 'webp', label: 'WebP', icon: Image, extensions: ['.webp'] },
  { value: 'pdf', label: 'PDF', icon: FileText, extensions: ['.pdf'] },
  { value: 'zip', label: 'ZIP Archive', icon: Archive, extensions: ['.zip'] },
  { value: 'mp4', label: 'MP4 Video', icon: Video, extensions: ['.mp4'] },
  { value: 'mp3', label: 'MP3 Audio', icon: Music, extensions: ['.mp3'] }
]
 
const qualityOptions = [
  { value: 'low', label: 'Low (720p)', quality: 0.5 },
  { value: 'medium', label: 'Medium (1080p)', quality: 0.75 },
  { value: 'high', label: 'High (2K)', quality: 0.9 },
  { value: 'original', label: 'Original Quality', quality: 1.0 }
]
 
const mockExportItems: ExportItem[] = [
  {
    id: '1',
    name: 'Cyberpunk Collection',
    type: 'collection',
    format: 'jpg',
    size: '245 MB',
    quality: 'high',
    resolution: '3840x2160',
    metadata: true,
    watermark: false,
    progress: 0,
    status: 'pending'
  },
  {
    id: '2',
    name: 'AI Generated Portrait',
    type: 'image',
    format: 'png',
    size: '12.5 MB',
    quality: 'original',
    metadata: true,
    watermark: true,
    progress: 0,
    status: 'pending'
  }
]
 
const mockShareLinks: ShareLink[] = [
  {
    id: '1',
    name: 'Project Showcase',
    url: 'https://avnistudio.sh/cyberpunk-2024',
    access: 'public',
    expiry: '2026-12-31',
    download: true,
    comments: true,
    analytics: true,
    createdAt: '2026-06-15',
    views: 342
  },
  {
    id: '2',
    name: 'Client Review',
    url: 'https://avnistudio.sh/private-review-123',
    access: 'private',
    password: 'review2024',
    expiry: '2026-07-15',
    download: false,
    comments: true,
    analytics: false,
    createdAt: '2026-06-20',
    views: 12
  }
]
 
export const ExportManager = ({ isOpen, onClose, selectedItems }: ExportManagerProps) => {
  const [activeTab, setActiveTab] = useState<'export' | 'share'>('export')
  const [exportItems, setExportItems] = useState<ExportItem[]>(mockExportItems)
  const [shareLinks, setShareLinks] = useState<ShareLink[]>(mockShareLinks)
  const [selectedFormat, setSelectedFormat] = useState<string>('jpg')
  const [selectedQuality, setSelectedQuality] = useState<string>('high')
  const [includeMetadata, setIncludeMetadata] = useState(true)
  const [includeWatermark, setIncludeWatermark] = useState(false)
  const [shareName, setShareName] = useState('')
  const [shareAccess, setShareAccess] = useState<'public' | 'private' | 'restricted'>('public')
  const [sharePassword, setSharePassword] = useState('')
  const [shareExpiry, setShareExpiry] = useState<string>('7d')
  const [shareDownload, setShareDownload] = useState(true)
  const [shareComments, setShareComments] = useState(true)
  const [shareAnalytics, setShareAnalytics] = useState(false)
  const [newLinkCopied, setNewLinkCopied] = useState<string | null>(null)
  
  const exportProgressInterval = useRef<NodeJS.Timeout>()
 
  useEffect(() => {
    if (isOpen && activeTab === 'export') {
      startExportProcessing()
    } else {
      stopExportProcessing()
    }
 
    return () => stopExportProcessing()
  }, [isOpen, activeTab])
 
  const startExportProcessing = () => {
    exportProgressInterval.current = setInterval(() => {
      setExportItems(prev => prev.map(item => {
        if (item.status === 'processing' && item.progress < 100) {
          const newProgress = Math.min(100, item.progress + Math.random() * 15)
          return {
            ...item,
            progress: newProgress,
            status: newProgress >= 100 ? 'completed' : 'processing'
          }
        }
        return item
      }))
    }, 1000)
 
    // Start processing all items
    setExportItems(prev => prev.map(item => ({
      ...item,
      status: 'processing',
      progress: 0
    })))
  }
 
  const stopExportProcessing = () => {
    if (exportProgressInterval.current) {
      clearInterval(exportProgressInterval.current)
    }
  }
 
  const startExport = () => {
    const newExportItem: ExportItem = {
      id: Date.now().toString(),
      name: `Export_${new Date().toISOString().split('T')[0]}`,
      type: 'collection',
      format: selectedFormat as any,
      size: '0 MB',
      quality: selectedQuality as any,
      metadata: includeMetadata,
      watermark: includeWatermark,
      progress: 0,
      status: 'pending'
    }
 
    setExportItems(prev => [...prev, newExportItem])
  }
 
  const cancelExport = (id: string) => {
    setExportItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, status: 'failed' } : item
      )
    )
  }
 
  const createShareLink = () => {
    if (!shareName.trim()) return
 
    const newLink: ShareLink = {
      id: Date.now().toString(),
      name: shareName,
      url: `https://avnistudio.sh/share-${Date.now()}`,
      access: shareAccess,
      password: shareAccess === 'private' ? sharePassword : undefined,
      expiry: shareExpiry === 'never' ? undefined : 
        shareExpiry === 'custom' ? '2026-12-31' :
        new Date(Date.now() + parseInt(shareExpiry) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      download: shareDownload,
      comments: shareComments,
      analytics: shareAnalytics,
      createdAt: new Date().toISOString(),
      views: 0
    }
 
    setShareLinks(prev => [newLink, ...prev])
    setShareName('')
    setSharePassword('')
    setNewLinkCopied(newLink.id)
 
    // Clear copied state after 3 seconds
    setTimeout(() => setNewLinkCopied(null), 3000)
  }
 
  const copyShareLink = (url: string) => {
    navigator.clipboard.writeText(url)
    setNewLinkCopied(url)
    setTimeout(() => setNewLinkCopied(null), 3000)
  }
 
  const deleteShareLink = (id: string) => {
    setShareLinks(prev => prev.filter(link => link.id !== id))
  }
 
  const getFormatIcon = (format: string) => {
    const formatObj = exportFormats.find(f => f.value === format)
    return formatObj ? formatObj.icon : Image
  }
 
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-400'
      case 'processing': return 'text-blue-400'
      case 'completed': return 'text-green-400'
      case 'failed': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }
 
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Advanced Export & Sharing"
      size="full"
      className="max-w-6xl"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-cyan-400">Export & Share</h2>
            <p className="text-gray-400">
              Export images and create shareable links
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline">
              <SortAsc className="w-4 h-4 mr-2" />
              Sort
            </Button>
          </div>
        </div>
 
        {/* Tabs */}
        <div className="flex items-center space-x-4 border-b border-gray-700">
          <button
            onClick={() => setActiveTab('export')}
            className={cn(
              'px-4 py-2 font-medium transition-colors',
              activeTab === 'export'
                ? 'text-cyan-400 border-b-2 border-cyan-400'
                : 'text-gray-400 hover:text-gray-300'
            )}
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
          <button
            onClick={() => setActiveTab('share')}
            className={cn(
              'px-4 py-2 font-medium transition-colors',
              activeTab === 'share'
                ? 'text-cyan-400 border-b-2 border-cyan-400'
                : 'text-gray-400 hover:text-gray-300'
            )}
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share Links
          </button>
        </div>
 
        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'export' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Export Configuration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
                  <h3 className="text-lg font-medium text-white mb-4">Export Settings</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Format</label>
                      <Select
                        value={selectedFormat}
                        onValueChange={setSelectedFormat}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {exportFormats.map(format => {
                            const Icon = format.icon
                            return (
                              <SelectItem key={format.value} value={format.value}>
                                <div className="flex items-center space-x-2">
                                  <Icon className="w-4 h-4" />
                                  <span>{format.label}</span>
                                </div>
                              </SelectItem>
                            )
                          })}
                        </SelectContent>
                      </Select>
                    </div>
 
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Quality</label>
                      <Select
                        value={selectedQuality}
                        onValueChange={setSelectedQuality}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {qualityOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
 
                    <div className="space-y-3">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={includeMetadata}
                          onChange={(e) => setIncludeMetadata(e.target.checked)}
                          className="rounded border-gray-600 bg-gray-800 text-cyan-500 focus:ring-cyan-500"
                        />
                        <span className="text-sm text-gray-300">Include metadata</span>
                      </label>
 
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={includeWatermark}
                          onChange={(e) => setIncludeWatermark(e.target.checked)}
                          className="rounded border-gray-600 bg-gray-800 text-cyan-500 focus:ring-cyan-500"
                        />
                        <span className="text-sm text-gray-300">Add watermark</span>
                      </label>
                    </div>
                  </div>
 
                  <Button 
                    onClick={startExport} 
                    className="w-full mt-6"
                    disabled={exportItems.some(item => item.status === 'processing')}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Start Export
                  </Button>
                </div>
 
                {/* Export History */}
                <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
                  <h3 className="text-lg font-medium text-white mb-4">Export Queue</h3>
                  
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {exportItems.map(item => {
                      const FormatIcon = getFormatIcon(item.format)
                      return (
                        <motion.div
                          key={item.id}
                          whileHover={{ y: -2 }}
                          className="p-3 bg-gray-700/50 rounded-lg border border-gray-600"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <FormatIcon className="w-4 h-4 text-cyan-400" />
                              <span className="text-sm font-medium text-white">
                                {item.name}
                              </span>
                              <span className="text-xs text-gray-400">
                                ({item.format.toUpperCase()})
                              </span>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <span className={`text-xs ${getStatusColor(item.status)}`}>
                                {item.status}
                              </span>
                              {item.status === 'processing' && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => cancelExport(item.id)}
                                >
                                  <XCircle className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                          
                          {item.status === 'processing' && (
                            <div className="mt-2">
                              <div className="w-full bg-gray-600 rounded-full h-2">
                                <motion.div
                                  className="h-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-400"
                                  style={{ width: `${item.progress}%` }}
                                />
                              </div>
                              <p className="text-xs text-gray-400 mt-1">
                                {Math.round(item.progress)}% complete
                              </p>
                            </div>
                          )}
                          
                          {item.status === 'completed' && (
                            <div className="flex items-center space-x-2 text-xs text-green-400">
                              <CheckCircle className="w-4 h-4" />
                              <span>Export completed</span>
                              <span className="text-gray-400">({item.size})</span>
                            </div>
                          )}
                          
                          {item.status === 'failed' && (
                            <div className="flex items-center space-x-2 text-xs text-red-400">
                              <XCircle className="w-4 h-4" />
                              <span>Export failed</span>
                            </div>
                          )}
                        </motion.div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
 
          {activeTab === 'share' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Create Share Link */}
                <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
                  <h3 className="text-lg font-medium text-white mb-4">Create Share Link</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Link Name
                      </label>
                      <Input
                        value={shareName}
                        onChange={(e) => setShareName(e.target.value)}
                        placeholder="e.g., Client Review"
                      />
                    </div>
 
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Access Level
                      </label>
                      <Select
                        value={shareAccess}
                        onValueChange={(value: any) => setShareAccess(value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Public (anyone can view)</SelectItem>
                          <SelectItem value="private">Private (password protected)</SelectItem>
                          <SelectItem value="restricted">Restricted (approved users only)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
 
                    {shareAccess === 'private' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Password
                        </label>
                        <Input
                          type="password"
                          value={sharePassword}
                          onChange={(e) => setSharePassword(e.target.value)}
                          placeholder="Enter password"
                        />
                      </div>
                    )}
 
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Expiry
                      </label>
                      <Select
                        value={shareExpiry}
                        onValueChange={setShareExpiry}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="never">Never expires</SelectItem>
                          <SelectItem value="7d">7 days</SelectItem>
                          <SelectItem value="30d">30 days</SelectItem>
                          <SelectItem value="90d">90 days</SelectItem>
                          <SelectItem value="custom">Custom date</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
 
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={shareDownload}
                        onChange={(e) => setShareDownload(e.target.checked)}
                        className="rounded border-gray-600 bg-gray-800 text-cyan-500 focus:ring-cyan-500"
                      />
                      <span className="text-sm text-gray-300">Allow downloads</span>
                    </label>
 
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={shareComments}
                        onChange={(e) => setShareComments(e.target.checked)}
                        className="rounded border-gray-600 bg-gray-800 text-cyan-500 focus:ring-cyan-500"
                      />
                      <span className="text-sm text-gray-300">Allow comments</span>
                    </label>
 
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={shareAnalytics}
                        onChange={(e) => setShareAnalytics(e.target.checked)}
                        className="rounded border-gray-600 bg-gray-800 text-cyan-500 focus:ring-cyan-500"
                      />
                      <span className="text-sm text-gray-300">Track analytics</span>
                    </label>
                  </div>
 
                  <Button 
                    onClick={createShareLink}
                    className="w-full mt-6"
                    disabled={!shareName.trim()}
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Create Share Link
                  </Button>
                </div>
 
                {/* Active Share Links */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-white">Active Share Links</h3>
                    <span className="text-sm text-gray-400">
                      {shareLinks.length} links
                    </span>
                  </div>
 
                  <div className="space-y-3">
                    {shareLinks.map(link => (
                      <motion.div
                        key={link.id}
                        whileHover={{ y: -2 }}
                        className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 className="font-medium text-white">{link.name}</h4>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                link.access === 'public' ? 'bg-green-500/20 text-green-400' :
                                link.access === 'private' ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-red-500/20 text-red-400'
                              }`}>
                                {link.access}
                              </span>
                              {link.password && (
                                <span className="text-xs text-yellow-400">🔒 Password protected</span>
                              )}
                            </div>
                            
                            <div className="flex items-center space-x-4 text-sm text-gray-400">
                              <span>Created: {new Date(link.createdAt).toLocaleDateString()}</span>
                              <span>Views: {link.views}</span>
                              {link.expiry && (
                                <span>Expires: {new Date(link.expiry).toLocaleDateString()}</span>
                              )}
                            </div>
                            
                            <div className="flex items-center space-x-4 mt-2 text-sm">
                              {link.download && (
                                <span className="text-cyan-400">✓ Downloads allowed</span>
                              )}
                              {link.comments && (
                                <span className="text-cyan-400">✓ Comments enabled</span>
                              )}
                              {link.analytics && (
                                <span className="text-cyan-400">✓ Analytics tracked</span>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2 ml-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyShareLink(link.url)}
                            >
                              {newLinkCopied === link.url ? (
                                <CheckCircle className="w-4 h-4 text-green-400" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </Button>
                            
                            <Button variant="ghost" size="sm">
                              <QrCode className="w-4 h-4" />
                            </Button>
                            
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteShareLink(link.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Modal>
  )
}
