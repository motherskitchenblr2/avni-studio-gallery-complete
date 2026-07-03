'use client'
 
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Zap, 
  Activity, 
  BarChart3, 
  Clock, 
  Database, 
  Cloud, 
  Wifi, 
  WifiOff,
  Speed,
  RefreshCw,
  Settings,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Target,
  Battery,
  Thermometer,
  HardDrive
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { Modal } from '@/components/ui/Modal'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { cn } from '@/components/ui/utils'
 
interface PerformanceMetrics {
  cpu: {
    usage: number
    temperature: number
    processes: number
  }
  memory: {
    usage: number
    available: number
    total: number
  }
  network: {
    latency: number
    bandwidth: number
    connections: number
  }
  storage: {
    usage: number
    readSpeed: number
    writeSpeed: number
  }
  render: {
    fps: number
    frameTime: number
    gpuUsage: number
  }
  loadTime: {
    firstPaint: number
    interactive: number
    fullLoad: number
  }
}
 
interface OptimizationSuggestion {
  id: string
  category: 'cpu' | 'memory' | 'network' | 'storage' | 'render' | 'load'
  title: string
  description: string
  impact: 'low' | 'medium' | 'high'
  difficulty: 'easy' | 'medium' | 'hard'
  applied: boolean
}
 
interface PerformanceProfile {
  id: string
  name: string
  description: string
  config: {
    cpuLimit: number
    memoryLimit: number
    quality: 'low' | 'medium' | 'high' | 'ultra'
    preload: boolean
    cache: boolean
    compression: boolean
  }
  recommendedFor: string[]
}
 
const mockMetrics: PerformanceMetrics = {
  cpu: {
    usage: 45,
    temperature: 62,
    processes: 127
  },
  memory: {
    usage: 65,
    available: 8.2,
    total: 16
  },
  network: {
    latency: 28,
    bandwidth: 85,
    connections: 23
  },
  storage: {
    usage: 78,
    readSpeed: 450,
    writeSpeed: 320
  },
  render: {
    fps: 60,
    frameTime: 16.7,
    gpuUsage: 35
  },
  loadTime: {
    firstPaint: 1.2,
    interactive: 2.5,
    fullLoad: 4.8
  }
}
 
const mockSuggestions: OptimizationSuggestion[] = [
  {
    id: '1',
    category: 'memory',
    title: 'Enable Image Caching',
    description: 'Cache frequently accessed images to reduce memory usage',
    impact: 'high',
    difficulty: 'easy',
    applied: false
  },
  {
    id: '2',
    category: 'network',
    title: 'Enable Compression',
    description: 'Compress images and assets to reduce bandwidth usage',
    impact: 'medium',
    difficulty: 'easy',
    applied: true
  },
  {
    id: '3',
    category: 'render',
    title: 'Reduce Render Quality',
    description: 'Lower image rendering quality for better performance',
    impact: 'high',
    difficulty: 'medium',
    applied: false
  },
  {
    id: '4',
    category: 'cpu',
    title: 'Optimize AI Processing',
    description: 'Enable batch processing for AI operations',
    impact: 'medium',
    difficulty: 'hard',
    applied: false
  },
  {
    id: '5',
    category: 'load',
    title: 'Preload Critical Assets',
    description: 'Preload essential assets for faster initial load',
    impact: 'medium',
    difficulty: 'easy',
    applied: true
  }
]
 
const mockProfiles: PerformanceProfile[] = [
  {
    id: '1',
    name: 'High Performance',
    description: 'Maximum quality and features',
    config: {
      cpuLimit: 90,
      memoryLimit: 90,
      quality: 'ultra',
      preload: true,
      cache: true,
      compression: false
    },
    recommendedFor: ['Gaming', 'Creative Professionals', 'High-end Systems']
  },
  {
    id: '2',
    name: 'Balanced',
    description: 'Good performance with balanced settings',
    config: {
      cpuLimit: 70,
      memoryLimit: 70,
      quality: 'high',
      preload: true,
      cache: true,
      compression: true
    },
    recommendedFor: ['General Users', 'Content Creators', 'Mid-range Systems']
  },
  {
    id: '3',
    name: 'Power Saver',
    description: 'Optimized for battery life and efficiency',
    config: {
      cpuLimit: 50,
      memoryLimit: 50,
      quality: 'medium',
      preload: false,
      cache: true,
      compression: true
    },
    recommendedFor: ['Laptops', 'Battery Devices', 'Low-end Systems']
  }
]
 
export const PerformanceOptimizer = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>(mockMetrics)
  const [suggestions, setSuggestions] = useState<OptimizationSuggestion[]>(mockSuggestions)
  const [profiles, setProfiles] = useState<PerformanceProfile[]>(mockProfiles)
  const [activeProfile, setActiveProfile] = useState<string>('2') // Balanced
  const [isMonitoring, setIsMonitoring] = useState(true)
  const [realTimeData, setRealTimeData] = useState<any[]>([])
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null)
 
  useEffect(() => {
    if (isOpen && isMonitoring) {
      startMonitoring()
    } else {
      stopMonitoring()
    }
 
    return () => stopMonitoring()
  }, [isOpen, isMonitoring])
 
  const startMonitoring = () => {
    const id = setInterval(() => {
      // Simulate real-time metric updates
      setMetrics(prev => ({
        ...prev,
        cpu: {
          ...prev.cpu,
          usage: Math.max(10, Math.min(95, prev.cpu.usage + (Math.random() - 0.5) * 10))
        },
        memory: {
          ...prev.memory,
          usage: Math.max(20, Math.min(95, prev.memory.usage + (Math.random() - 0.5) * 5))
        },
        render: {
          ...prev.render,
          fps: Math.max(30, Math.min(120, prev.render.fps + (Math.random() - 0.5) * 5))
        }
      }))
 
      setRealTimeData(prev => {
        const newData = {
          timestamp: Date.now(),
          cpu: metrics.cpu.usage,
          memory: metrics.memory.usage,
          fps: metrics.render.fps
        }
        
        // Keep last 50 data points
        return [...prev.slice(-49), newData]
      })
 
      setIntervalId(id)
    }, 1000)
 
    setIntervalId(id)
  }
 
  const stopMonitoring = () => {
    if (intervalId) {
      clearInterval(intervalId)
      setIntervalId(null)
    }
  }
 
  const applySuggestion = (suggestionId: string) => {
    setSuggestions(prev => 
      prev.map(suggestion => 
        suggestion.id === suggestionId 
          ? { ...suggestion, applied: true }
          : suggestion
      )
    )
  }
 
  const applyProfile = (profileId: string) => {
    setActiveProfile(profileId)
    const profile = profiles.find(p => p.id === profileId)
    if (profile) {
      // Simulate applying performance profile
      console.log('Applied profile:', profile.name)
    }
  }
 
  const getHealthStatus = (value: number, goodThreshold: number, warningThreshold: number) => {
    if (value <= goodThreshold) return { status: 'good', color: 'text-green-400', icon: <CheckCircle className="w-4 h-4" /> }
    if (value <= warningThreshold) return { status: 'warning', color: 'text-yellow-400', icon: <AlertTriangle className="w-4 h-4" /> }
    return { status: 'critical', color: 'text-red-400', icon: <XCircle className="w-4 h-4" /> }
  }
 
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-400'
      case 'medium': return 'text-yellow-400'
      case 'low': return 'text-green-400'
      default: return 'text-gray-400'
    }
  }
 
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400'
      case 'medium': return 'text-yellow-400'
      case 'hard': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }
 
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Performance Optimizer"
      size="full"
      className="max-w-7xl"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-cyan-400">Performance Dashboard</h2>
            <p className="text-gray-400">
              Monitor and optimize system performance in real-time
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant={isMonitoring ? 'secondary' : 'outline'}
              onClick={() => setIsMonitoring(!isMonitoring)}
            >
              {isMonitoring ? (
                <>
                  <Activity className="w-4 h-4 mr-2" />
                  Monitoring
                </>
              ) : (
                <>
                  <WifiOff className="w-4 h-4 mr-2" />
                  Stopped
                </>
              )}
            </Button>
            
            <Button variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
 
        {/* System Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-cyan-400" />
                <span className="text-sm font-medium text-white">Performance Score</span>
              </div>
              <span className="text-2xl font-bold text-green-400">87</span>
            </div>
            <p className="text-xs text-gray-400">Excellent performance</p>
          </div>
          
          <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Battery className="w-5 h-5 text-yellow-400" />
                <span className="text-sm font-medium text-white">Efficiency</span>
              </div>
              <span className="text-2xl font-bold text-yellow-400">92%</span>
            </div>
            <p className="text-xs text-gray-400">Good energy usage</p>
          </div>
          
          <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Thermometer className="w-5 h-5 text-blue-400" />
                <span className="text-sm font-medium text-white">System Load</span>
              </div>
              <span className="text-2xl font-bold text-blue-400">Normal</span>
            </div>
            <p className="text-xs text-gray-400">Optimal temperature</p>
          </div>
        </div>
 
        {/* Performance Profiles */}
        <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
          <h3 className="text-lg font-medium text-white mb-4">Performance Profiles</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {profiles.map(profile => (
              <motion.div
                key={profile.id}
                whileHover={{ y: -5 }}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                  activeProfile === profile.id
                    ? 'border-cyan-400 bg-cyan-500/10'
                    : 'border-gray-700 hover:border-gray-600'
                }`}
                onClick={() => applyProfile(profile.id)}
              >
                <h4 className="font-semibold text-white mb-2">{profile.name}</h4>
                <p className="text-sm text-gray-400 mb-3">{profile.description}</p>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">Quality</span>
                    <span className="text-cyan-400">{profile.config.quality}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">CPU Limit</span>
                    <span className="text-cyan-400">{profile.config.cpuLimit}%</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">Memory</span>
                    <span className="text-cyan-400">{profile.config.memoryLimit}%</span>
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t border-gray-700">
                  <p className="text-xs text-gray-400 mb-2">Recommended for:</p>
                  <div className="flex flex-wrap gap-1">
                    {profile.recommendedFor.slice(0, 2).map((item, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
 
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* System Metrics */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">System Metrics</h3>
            
            {/* CPU */}
            <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-green-400" />
                  <span className="text-sm font-medium text-white">CPU Usage</span>
                </div>
                <span className="text-sm font-medium text-green-400">
                  {metrics.cpu.usage}%
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <motion.div
                  className="h-2 rounded-full bg-gradient-to-r from-green-400 to-green-300"
                  style={{ width: `${metrics.cpu.usage}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span>Temp: {metrics.cpu.temperature}°C</span>
                <span>Processes: {metrics.cpu.processes}</span>
              </div>
            </div>
 
            {/* Memory */}
            <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <HardDrive className="w-5 h-5 text-blue-400" />
                  <span className="text-sm font-medium text-white">Memory Usage</span>
                </div>
                <span className="text-sm font-medium text-blue-400">
                  {metrics.memory.usage}%
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <motion.div
                  className="h-2 rounded-full bg-gradient-to-r from-blue-400 to-blue-300"
                  style={{ width: `${metrics.memory.usage}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span>{metrics.memory.available}GB available</span>
                <span>{metrics.memory.total}GB total</span>
              </div>
            </div>
 
            {/* Storage */}
            <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Database className="w-5 h-5 text-purple-400" />
                  <span className="text-sm font-medium text-white">Storage</span>
                </div>
                <span className="text-sm font-medium text-purple-400">
                  {metrics.storage.usage}%
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <motion.div
                  className="h-2 rounded-full bg-gradient-to-r from-purple-400 to-purple-300"
                  style={{ width: `${metrics.storage.usage}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span>Read: {metrics.storage.readSpeed}MB/s</span>
                <span>Write: {metrics.storage.writeSpeed}MB/s</span>
              </div>
            </div>
          </div>
 
          {/* Performance Metrics */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Performance Metrics</h3>
            
            {/* FPS */}
            <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-yellow-400" />
                  <span className="text-sm font-medium text-white">Frame Rate</span>
                </div>
                <span className="text-sm font-medium text-yellow-400">
                  {metrics.render.fps} FPS
                </span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-gray-400">
                <span>Frame Time: {metrics.render.frameTime}ms</span>
                <span>GPU: {metrics.render.gpuUsage}%</span>
              </div>
            </div>
 
            {/* Network */}
            <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Wifi className="w-5 h-5 text-cyan-400" />
                  <span className="text-sm font-medium text-white">Network</span>
                </div>
                <span className="text-sm font-medium text-cyan-400">
                  {metrics.network.latency}ms
                </span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-gray-400">
                <span>Bandwidth: {metrics.network.bandwidth}%</span>
                <span>Connections: {metrics.network.connections}</span>
              </div>
            </div>
 
            {/* Load Time */}
            <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-green-400" />
                  <span className="text-sm font-medium text-white">Load Time</span>
                </div>
                <span className="text-sm font-medium text-green-400">
                  {metrics.loadTime.fullLoad}s
                </span>
              </div>
              <div className="space-y-1 text-xs text-gray-400">
                <div className="flex justify-between">
                  <span>First Paint:</span>
                  <span>{metrics.loadTime.firstPaint}s</span>
                </div>
                <div className="flex justify-between">
                  <span>Interactive:</span>
                  <span>{metrics.loadTime.interactive}s</span>
                </div>
              </div>
            </div>
          </div>
        </div>
 
        {/* Optimization Suggestions */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-white">Optimization Suggestions</h3>
            <span className="text-sm text-gray-400">
              {suggestions.filter(s => !s.applied).length} pending
            </span>
          </div>
          
          <div className="space-y-3">
            {suggestions.filter(s => !s.applied).map(suggestion => (
              <motion.div
                key={suggestion.id}
                whileHover={{ y: -2 }}
                className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="font-medium text-white">{suggestion.title}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getImpactColor(suggestion.impact)}`}>
                        {suggestion.impact} impact
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(suggestion.difficulty)}`}>
                        {suggestion.difficulty}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400">{suggestion.description}</p>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <Button variant="outline" size="sm">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                    <Button onClick={() => applySuggestion(suggestion.id)} size="sm">
                      Apply
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
 
        {/* Real-time Chart */}
        {realTimeData.length > 0 && (
          <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
            <h3 className="text-lg font-medium text-white mb-4">Real-time Performance</h3>
            <div className="h-64 relative">
              <div className="absolute inset-0 flex items-end space-x-1">
                {realTimeData.map((data, index) => (
                  <motion.div
                    key={index}
                    className="flex-1 bg-gradient-to-t from-cyan-400 to-cyan-300 rounded-t"
                    style={{ height: `${data.cpu}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}
