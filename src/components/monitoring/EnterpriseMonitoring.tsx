'use client'
 
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Users, 
  Server,
  Database,
  Wifi,
  HardDrive,
  MemoryStick,
  Cpu,
  Zap,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Download,
  Filter,
  Calendar,
  Clock,
  MapPin,
  Globe,
  Shield,
  Lock,
  Eye,
  EyeOff,
  Settings,
  BarChart3,
  LineChart,
  PieChart
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { Modal } from '@/components/ui/Modal'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { cn } from '@/components/ui/utils'
 
interface Alert {
  id: string
  type: 'error' | 'warning' | 'info' | 'success'
  title: string
  description: string
  timestamp: string
  source: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  acknowledged: boolean
  resolved: boolean
}
 
interface Metric {
  id: string
  name: string
  value: number
  unit: string
  change: number
  trend: 'up' | 'down' | 'stable'
  timestamp: string
}
 
interface SystemHealth {
  cpu: {
    usage: number
    temperature: number
    cores: number
  }
  memory: {
    usage: number
    available: number
    total: number
  }
  storage: {
    usage: number
    readSpeed: number
    writeSpeed: number
  }
  network: {
    latency: number
    bandwidth: number
    connections: number
  }
  services: {
    status: 'healthy' | 'degraded' | 'down'
    uptime: number
    responseTime: number
  }
}
 
interface LogEntry {
  id: string
  timestamp: string
  level: 'debug' | 'info' | 'warn' | 'error'
  source: string
  message: string
  user?: string
  ip?: string
  duration?: number
}
 
interface EnterpriseMonitoringProps {
  isOpen: boolean
  onClose: () => void
}
 
const mockAlerts: Alert[] = [
  {
    id: '1',
    type: 'error',
    title: 'AI Service Timeout',
    description: 'Image generation service timed out after 30 seconds',
    timestamp: new Date().toISOString(),
    source: 'ai-service',
    severity: 'high',
    acknowledged: false,
    resolved: false
  },
  {
    id: '2',
    type: 'warning',
    title: 'High Memory Usage',
    description: 'Memory usage exceeded 80% threshold',
    timestamp: new Date(Date.now() - 300000).toISOString(),
    source: 'system',
    severity: 'medium',
    acknowledged: false,
    resolved: false
  },
  {
    id: '3',
    type: 'info',
    title: 'Backup Completed',
    description: 'Daily backup completed successfully',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    source: 'backup-service',
    severity: 'low',
    acknowledged: true,
    resolved: true
  }
]
 
const mockMetrics: Metric[] = [
  {
    id: '1',
    name: 'Active Users',
    value: 342,
    unit: 'users',
    change: 12,
    trend: 'up',
    timestamp: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Images Generated',
    value: 1250,
    unit: 'images',
    change: 45,
    trend: 'up',
    timestamp: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Response Time',
    value: 280,
    unit: 'ms',
    change: -15,
    trend: 'down',
    timestamp: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Error Rate',
    value: 0.8,
    unit: '%',
    change: -0.2,
    trend: 'down',
    timestamp: new Date().toISOString()
  }
]
 
const mockHealth: SystemHealth = {
  cpu: {
    usage: 45,
    temperature: 62,
    cores: 8
  },
  memory: {
    usage: 65,
    available: 8.2,
    total: 16
  },
  storage: {
    usage: 78,
    readSpeed: 450,
    writeSpeed: 320
  },
  network: {
    latency: 28,
    bandwidth: 85,
    connections: 23
  },
  services: {
    status: 'healthy',
    uptime: 99.9,
    responseTime: 120
  }
}
 
const mockLogs: LogEntry[] = [
  {
    id: '1',
    timestamp: new Date().toISOString(),
    level: 'info',
    source: 'auth-service',
    message: 'User admin@avnistudio.com logged in',
    user: 'admin@avnistudio.com',
    ip: '192.168.1.100'
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 300000).toISOString(),
    level: 'warn',
    source: 'ai-service',
    message: 'Generation time exceeded threshold',
    duration: 35000
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 600000).toISOString(),
    level: 'error',
    source: 'database',
    message: 'Connection pool exhausted',
    ip: '192.168.1.101'
  },
  {
    id: '4',
    timestamp: new Date(Date.now() - 900000).toISOString(),
    level: 'info',
    source: 'backup-service',
    message: 'Backup completed successfully',
    duration: 45000
  }
]
 
export const EnterpriseMonitoring = ({ isOpen, onClose }: EnterpriseMonitoringProps) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'alerts' | 'metrics' | 'logs'>('overview')
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts)
  const [metrics, setMetrics] = useState<Metric[]>(mockMetrics)
  const [health, setHealth] = useState<SystemHealth>(mockHealth)
  const [logs, setLogs] = useState<LogEntry[]>(mockLogs)
  const [filterLevel, setFilterLevel] = useState<string>('all')
  const [filterSource, setFilterSource] = useState<string>('all')
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [refreshInterval, setRefreshInterval] = useState(30)
  const [expandedAlert, setExpandedAlert] = useState<string | null>(null)
  
  const refreshTimer = useRef<NodeJS.Timeout>()
 
  useEffect(() => {
    if (isOpen && autoRefresh) {
      startAutoRefresh()
    } else {
      stopAutoRefresh()
    }
 
    return () => stopAutoRefresh()
  }, [isOpen, autoRefresh, refreshInterval])
 
  const startAutoRefresh = () => {
    refreshTimer.current = setInterval(() => {
      // Simulate real-time updates
      setMetrics(prev => prev.map(metric => ({
        ...metric,
        value: metric.value + Math.floor(Math.random() * 10 - 5),
        change: metric.change + Math.floor(Math.random() * 4 - 2)
      })))
      
      setHealth(prev => ({
        ...prev,
        cpu: {
          ...prev.cpu,
          usage: Math.max(10, Math.min(95, prev.cpu.usage + (Math.random() - 0.5) * 10))
        },
        memory: {
          ...prev.memory,
          usage: Math.max(20, Math.min(95, prev.memory.usage + (Math.random() - 0.5) * 5))
        }
      }))
    }, refreshInterval * 1000)
  }
 
  const stopAutoRefresh = () => {
    if (refreshTimer.current) {
      clearInterval(refreshTimer.current)
    }
  }
 
  const acknowledgeAlert = (id: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === id ? { ...alert, acknowledged: true } : alert
      )
    )
  }
 
  const resolveAlert = (id: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === id ? { ...alert, resolved: true } : alert
      )
    )
  }
 
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-400 bg-red-500/20 border-red-500/20'
      case 'high': return 'text-orange-400 bg-orange-500/20 border-orange-500/20'
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/20'
      case 'low': return 'text-blue-400 bg-blue-500/20 border-blue-500/20'
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/20'
    }
  }
 
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error': return 'text-red-400'
      case 'warn': return 'text-yellow-400'
      case 'info': return 'text-blue-400'
      case 'debug': return 'text-gray-400'
      default: return 'text-gray-400'
    }
  }
 
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-400" />
      case 'down': return <TrendingDown className="w-4 h-4 text-red-400" />
      default: return <div className="w-4 h-4 bg-gray-400 rounded-full" />
    }
  }
 
  const filteredLogs = logs.filter(log => {
    const matchesLevel = filterLevel === 'all' || log.level === filterLevel
    const matchesSource = filterSource === 'all' || log.source === filterSource
    return matchesLevel && matchesSource
  })
 
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Enterprise Monitoring & Logging"
      size="full"
      className="max-w-7xl"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-cyan-400">Enterprise Dashboard</h2>
            <p className="text-gray-400">
              Real-time system monitoring and logging
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant={autoRefresh ? 'secondary' : 'outline'}
              onClick={() => setAutoRefresh(!autoRefresh)}
            >
              {autoRefresh ? (
                <>
                  <Activity className="w-4 h-4 mr-2" />
                  Auto-Refresh {refreshInterval}s
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Manual
                </>
              )}
            </Button>
            
            {autoRefresh && (
              <Select
                value={refreshInterval.toString()}
                onValueChange={(value) => setRefreshInterval(parseInt(value))}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10s</SelectItem>
                  <SelectItem value="30">30s</SelectItem>
                  <SelectItem value="60">60s</SelectItem>
                  <SelectItem value="120">120s</SelectItem>
                </SelectContent>
Diff preview truncated: 64 lines omitted to keep UI responsive.
            <div className="flex items-center space-x-3 mb-2">
              <Shield className="w-6 h-6 text-yellow-400" />
              <div>
                <p className="text-sm text-gray-400">Services</p>
                <p className="text-xl font-bold text-white">{health.services.uptime}%</p>
              </div>
            </div>
            <p className="text-xs text-gray-400">
              {health.services.status}
            </p>
          </div>
        </div>
 
        {/* Tabs */}
        <div className="flex items-center space-x-4 border-b border-gray-700">
          <button
            onClick={() => setActiveTab('overview')}
            className={cn(
              'px-4 py-2 font-medium transition-colors',
              activeTab === 'overview'
                ? 'text-cyan-400 border-b-2 border-cyan-400'
                : 'text-gray-400 hover:text-gray-300'
            )}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('alerts')}
            className={cn(
              'px-4 py-2 font-medium transition-colors',
              activeTab === 'alerts'
                ? 'text-cyan-400 border-b-2 border-cyan-400'
                : 'text-gray-400 hover:text-gray-300'
            )}
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            Alerts ({alerts.filter(a => !a.resolved).length})
          </button>
          <button
            onClick={() => setActiveTab('metrics')}
            className={cn(
              'px-4 py-2 font-medium transition-colors',
              activeTab === 'metrics'
                ? 'text-cyan-400 border-b-2 border-cyan-400'
                : 'text-gray-400 hover:text-gray-300'
            )}
          >
            <LineChart className="w-4 h-4 mr-2" />
            Metrics
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={cn(
              'px-4 py-2 font-medium transition-colors',
              activeTab === 'logs'
                ? 'text-cyan-400 border-b-2 border-cyan-400'
                : 'text-gray-400 hover:text-gray-300'
            )}
          >
            <Database className="w-4 h-4 mr-2" />
            Logs
          </button>
        </div>
 
        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {metrics.map(metric => (
                  <div key={metric.id} className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-gray-300">{metric.name}</h3>
                      {getTrendIcon(metric.trend)}
                    </div>
                    <div className="flex items-baseline space-x-2">
                      <p className="text-2xl font-bold text-white">
                        {metric.value.toLocaleString()}
                      </p>
                      <span className="text-sm text-gray-400">{metric.unit}</span>
                    </div>
                    <p className={`text-xs ${metric.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                      {metric.change > 0 ? '+' : ''}{metric.change}%
                    </p>
                  </div>
                ))}
              </div>
 
              {/* System Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
                  <h3 className="text-lg font-medium text-white mb-4">Service Health</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">Authentication Service</span>
                      <span className="text-sm text-green-400">Healthy</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">AI Generation</span>
                      <span className="text-sm text-yellow-400">Degraded</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">Database</span>
                      <span className="text-sm text-green-400">Healthy</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">Storage Service</span>
                      <span className="text-sm text-green-400">Healthy</span>
                    </div>
                  </div>
                </div>
 
                <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
                  <h3 className="text-lg font-medium text-white mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {logs.slice(0, 4).map(log => (
                      <div key={log.id} className="flex items-start space-x-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          log.level === 'error' ? 'bg-red-400' :
                          log.level === 'warn' ? 'bg-yellow-400' :
                          log.level === 'info' ? 'bg-blue-400' : 'bg-gray-400'
                        }`}></div>
                        <div className="flex-1">
                          <p className="text-sm text-white">{log.message}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(log.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
 
          {activeTab === 'alerts' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="flex items-center space-x-4">
                <Select value={filterLevel} onValueChange={setFilterLevel}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="error">Errors</SelectItem>
                    <SelectItem value="warning">Warnings</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                  </SelectContent>
                </Select>
 
                <Select value={filterSource} onValueChange={setFilterSource}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sources</SelectItem>
                    <SelectItem value="auth-service">Auth Service</SelectItem>
                    <SelectItem value="ai-service">AI Service</SelectItem>
                    <SelectItem value="database">Database</SelectItem>
                  </SelectContent>
                </Select>
              </div>
 
              <div className="space-y-3">
                {alerts
                  .filter(alert => !alert.resolved)
                  .map(alert => (
                    <motion.div
                      key={alert.id}
                      whileHover={{ y: -2 }}
                      className={`p-4 rounded-lg border-2 ${getSeverityColor(alert.severity)}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          {alert.type === 'error' && <XCircle className="w-5 h-5 text-red-400" />}
                          {alert.type === 'warning' && <AlertTriangle className="w-5 h-5 text-yellow-400" />}
                          {alert.type === 'info' && <CheckCircle className="w-5 h-5 text-blue-400" />}
                          {alert.type === 'success' && <CheckCircle className="w-5 h-5 text-green-400" />}
                          
                          <div className="flex-1">
                            <h4 className="font-medium text-white">{alert.title}</h4>
                            <p className="text-sm text-gray-300">{alert.description}</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-400 mt-2">
                              <span>{new Date(alert.timestamp).toLocaleString()}</span>
                              <span>Source: {alert.source}</span>
                              {!alert.acknowledged && (
                                <span className="text-yellow-400">Unacknowledged</span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {!alert.acknowledged && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => acknowledgeAlert(alert.id)}
                            >
                              Acknowledge
                            </Button>
                          )}
                          {alert.acknowledged && !alert.resolved && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => resolveAlert(alert.id)}
                            >
                              Resolve
                            </Button>
                          )}
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </motion.div>
          )}
 
          {activeTab === 'metrics' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
                  <h3 className="text-lg font-medium text-white mb-4">Performance Metrics</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-300">CPU Usage</span>
                        <span className="text-sm font-medium text-white">{health.cpu.usage}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <motion.div
                          className="h-2 rounded-full bg-gradient-to-r from-green-400 to-green-300"
                          style={{ width: `${health.cpu.usage}%` }}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-300">Memory Usage</span>
                        <span className="text-sm font-medium text-white">{health.memory.usage}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <motion.div
                          className="h-2 rounded-full bg-gradient-to-r from-blue-400 to-blue-300"
                          style={{ width: `${health.memory.usage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
 
                <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
                  <h3 className="text-lg font-medium text-white mb-4">Network Metrics</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-300">Latency</span>
                        <span className="text-sm font-medium text-white">{health.network.latency}ms</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <motion.div
                          className="h-2 rounded-full bg-gradient-to-r from-cyan-400 to-cyan-300"
                          style={{ width: `${Math.min(100, health.network.latency / 10)}%` }}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-300">Bandwidth</span>
                        <span className="text-sm font-medium text-white">{health.network.bandwidth}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <motion.div
                          className="h-2 rounded-full bg-gradient-to-r from-purple-400 to-purple-300"
                          style={{ width: `${health.network.bandwidth}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
 
          {activeTab === 'logs' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="flex items-center space-x-4">
                <Select value={filterLevel} onValueChange={setFilterLevel}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                    <SelectItem value="warn">Warning</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="debug">Debug</SelectItem>
                  </SelectContent>
                </Select>
 
                <Select value={filterSource} onValueChange={setFilterSource}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sources</SelectItem>
                    <SelectItem value="auth-service">Auth Service</SelectItem>
                    <SelectItem value="ai-service">AI Service</SelectItem>
                    <SelectItem value="database">Database</SelectItem>
                    <SelectItem value="backup-service">Backup Service</SelectItem>
                  </SelectContent>
                </Select>
              </div>
 
              <div className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden">
                <div className="max-h-96 overflow-y-auto">
                  {filteredLogs.map(log => (
                    <div key={log.id} className="p-4 border-b border-gray-700 last:border-b-0">
                      <div className="flex items-start space-x-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          log.level === 'error' ? 'bg-red-400' :
                          log.level === 'warn' ? 'bg-yellow-400' :
                          log.level === 'info' ? 'bg-blue-400' : 'bg-gray-400'
                        }`}></div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center space-x-2">
                              <span className={`text-sm font-medium ${getLevelColor(log.level)}`}>
                                {log.level.toUpperCase()}
                              </span>
                              <span className="text-sm text-white">{log.source}</span>
                            </div>
                            <span className="text-xs text-gray-400">
                              {new Date(log.timestamp).toLocaleString()}
                            </span>
                          </div>
                          
                          <p className="text-sm text-gray-300">{log.message}</p>
                          
                          {log.user && (
                            <p className="text-xs text-gray-500 mt-1">
                              User: {log.user}
                            </p>
                          )}
                          
                          {log.ip && (
                            <p className="text-xs text-gray-500">
                              IP: {log.ip}
                            </p>
                          )}
                          
                          {log.duration && (
                            <p className="text-xs text-gray-500">
                              Duration: {log.duration}ms
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
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
