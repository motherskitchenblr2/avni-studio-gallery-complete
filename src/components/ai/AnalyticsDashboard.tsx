'use client'
 
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { Modal } from '@/components/ui/Modal'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { cn } from '@/components/ui/utils'
 
interface AnalyticsDashboardProps {
  isOpen: boolean
  onClose: () => void
}
 
interface AnalyticsData {
  totalImages: number
  totalGenerations: number
  successRate: number
  averageProcessingTime: number
  topModels: Array<{
    name: string
    usage: number
    percentage: number
  }>
  usageByDay: Array<{
    date: string
    count: number
  }>
  providerStats: Array<{
    name: string
    usage: number
    successRate: number
  }>
  styleDistribution: Array<{
    style: string
    count: number
    percentage: number
  }>
  categoryDistribution: Array<{
    category: string
    count: number
    percentage: number
  }>
}
 
const AnalyticsDashboard = ({ isOpen, onClose }: AnalyticsDashboardProps) => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d')
  const [loading, setLoading] = useState(true)
  const [selectedChart, setSelectedChart] = useState<'overview' | 'models' | 'providers' | 'styles' | 'categories'>('overview')
 
  useEffect(() => {
    if (isOpen) {
      loadAnalytics()
    }
  }, [isOpen, timeRange])
 
  const loadAnalytics = async () => {
    setLoading(true)
    try {
      // Mock analytics data
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockData: AnalyticsData = {
        totalImages: 1247,
        totalGenerations: 1583,
        successRate: 94.2,
        averageProcessingTime: 3.8,
        topModels: [
          { name: 'DALL-E 3', usage: 456, percentage: 28.8 },
          { name: 'Stable Diffusion XL', usage: 392, percentage: 24.8 },
          { name: 'Midjourney V6', usage: 387, percentage: 24.4 },
          { name: 'Adobe Firefly', usage: 348, percentage: 22.0 }
        ],
        usageByDay: Array.from({ length: 30 }, (_, i) => {
          const date = new Date()
          date.setDate(date.getDate() - (29 - i))
          return {
            date: date.toISOString().split('T')[0],
            count: Math.floor(Math.random() * 50) + 20
          }
        }),
        providerStats: [
          { name: 'OpenAI', usage: 456, successRate: 96.5 },
          { name: 'Stability AI', usage: 392, successRate: 92.3 },
          { name: 'Midjourney', usage: 387, successRate: 95.8 },
          { name: 'Adobe', usage: 348, successRate: 88.2 }
        ],
        styleDistribution: [
          { style: 'Natural', count: 387, percentage: 31.0 },
          { style: 'Cyberpunk', count: 294, percentage: 23.6 },
          { style: 'Abstract', count: 245, percentage: 19.7 },
          { style: 'Photorealistic', count: 198, percentage: 15.9 },
          { style: 'Minimalist', count: 123, percentage: 9.8 }
        ],
        categoryDistribution: [
          { category: 'Portraits', count: 423, percentage: 33.9 },
          { category: 'Landscapes', count: 358, percentage: 28.7 },
          { category: 'Abstract', count: 247, percentage: 19.8 },
          { category: 'Architecture', count: 178, percentage: 14.3 },
          { category: 'Other', count: 41, percentage: 3.3 }
        ]
      }
      
      setAnalytics(mockData)
    } catch (error) {
      console.error('Error loading analytics:', error)
    } finally {
      setLoading(false)
    }
  }
 
  if (!analytics) return null
 
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="AI Analytics Dashboard"
      size="full"
      className="max-w-7xl"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-cyan-400">Analytics Dashboard</h2>
            <p className="text-gray-400">Track AI image generation performance</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Select
              value={timeRange}
              onValueChange={(value: any) => setTimeRange(value)}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" onClick={loadAnalytics}>
              Refresh
            </Button>
          </div>
        </div>
 
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-gray-800/50 rounded-lg border border-cyan-500/20"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Images</p>
                <p className="text-3xl font-bold text-cyan-400">
                  {analytics.totalImages.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </motion.div>
 
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 bg-gray-800/50 rounded-lg border border-green-500/20"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Success Rate</p>
                <p className="text-3xl font-bold text-green-400">
                  {analytics.successRate}%
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </motion.div>
 
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 bg-gray-800/50 rounded-lg border border-purple-500/20"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Avg. Processing</p>
                <p className="text-3xl font-bold text-purple-400">
                  {analytics.averageProcessingTime}s
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </motion.div>
 
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 bg-gray-800/50 rounded-lg border border-yellow-500/20"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Gen.</p>
                <p className="text-3xl font-bold text-yellow-400">
                  {analytics.totalGenerations.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </motion.div>
        </div>
 
        {/* Chart Selector */}
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-300">Charts:</span>
          <Button
            variant={selectedChart === 'overview' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setSelectedChart('overview')}
          >
            Overview
          </Button>
          <Button
            variant={selectedChart === 'models' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setSelectedChart('models')}
          >
            Models
          </Button>
          <Button
            variant={selectedChart === 'providers' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setSelectedChart('providers')}
          >
            Providers
          </Button>
          <Button
            variant={selectedChart === 'styles' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setSelectedChart('styles')}
          >
            Styles
          </Button>
          <Button
            variant={selectedChart === 'categories' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setSelectedChart('categories')}
          >
            Categories
          </Button>
        </div>
 
        {/* Charts */}
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Usage Over Time Chart */}
            {selectedChart === 'overview' && (
              <div className="bg-gray-800/50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-100 mb-4">
                  Generation Activity ({timeRange})
                </h3>
                <div className="h-64">
                  <div className="flex items-end justify-between h-full space-x-2">
                    {analytics.usageByDay.slice(-7).map((day, index) => (
                      <motion.div
                        key={index}
                        initial={{ height: 0 }}
                        animate={{ height: `${(day.count / 50) * 100}%` }}
                        className="flex-1 bg-gradient-to-t from-cyan-500 to-cyan-400 rounded-t cursor-pointer hover:opacity-80 transition-opacity"
                        title={`${day.date}: ${day.count} generations`}
                      />
                    ))}
                  </div>
                  <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                    {analytics.usageByDay.slice(-7).map((day, index) => (
                      <span key={index}>{new Date(day.date).toLocaleDateString()}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}
 
            {/* Top Models Chart */}
            {selectedChart === 'models' && (
              <div className="bg-gray-800/50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-100 mb-4">
                  Top AI Models by Usage
                </h3>
                <div className="space-y-4">
                  {analytics.topModels.map((model, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-300">
                          {model.name}
                        </span>
                        <span className="text-sm text-gray-400">
                          {model.count.toLocaleString()} ({model.percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <motion.div
                          className="bg-gradient-to-r from-cyan-500 to-cyan-400 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${model.percentage}%` }}
                          transition={{ delay: index * 0.1 + 0.2 }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
 
            {/* Provider Stats */}
            {selectedChart === 'providers' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-800/50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-100 mb-4">
                    Provider Usage
                  </h3>
                  <div className="space-y-3">
                    {analytics.providerStats.map((provider, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${
                            provider.name === 'OpenAI' ? 'bg-cyan-400' :
                            provider.name === 'Stability AI' ? 'bg-purple-400' :
                            provider.name === 'Midjourney' ? 'bg-green-400' : 'bg-yellow-400'
                          }`} />
                          <span className="text-sm text-gray-300">{provider.name}</span>
                        </div>
                        <span className="text-sm font-medium text-gray-400">
                          {provider.usage.toLocaleString()} calls
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
 
                <div className="bg-gray-800/50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-100 mb-4">
                    Success Rates by Provider
                  </h3>
                  <div className="space-y-3">
                    {analytics.providerStats.map((provider, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-300">{provider.name}</span>
                          <span className="text-sm font-medium text-green-400">
                            {provider.successRate}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <motion.div
                            className="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${provider.successRate}%` }}
                            transition={{ delay: index * 0.1 }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
 
            {/* Style Distribution */}
            {selectedChart === 'styles' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-800/50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-100 mb-4">
                    Style Distribution
                  </h3>
                  <div className="space-y-3">
                    {analytics.styleDistribution.map((style, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-300">{style.style}</span>
                          <span className="text-sm font-medium text-gray-400">
                            {style.count.toLocaleString()} ({style.percentage}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <motion.div
                            className="bg-gradient-to-r from-purple-500 to-purple-400 h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${style.percentage}%` }}
                            transition={{ delay: index * 0.1 }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
 
                <div className="bg-gray-800/50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-100 mb-4">
                    Category Breakdown
                  </h3>
                  <div className="space-y-3">
                    {analytics.categoryDistribution.map((category, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-300">{category.category}</span>
                          <span className="text-sm font-medium text-gray-400">
                            {category.count.toLocaleString()} ({category.percentage}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <motion.div
                            className="bg-gradient-to-r from-yellow-500 to-yellow-400 h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${category.percentage}%` }}
                            transition={{ delay: index * 0.1 }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
 
        {/* Export Options */}
        <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-800">
          <Button variant="outline">
            Export as CSV
          </Button>
          <Button variant="outline">
            Export as JSON
          </Button>
          <Button>
            Schedule Report
          </Button>
        </div>
      </div>
    </Modal>
  )
}
 
export default AnalyticsDashboard
