'use client'
 
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Download, 
  Filter,
  Search,
  User,
  Shield,
  Clock,
  FileText,
  Database
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { Modal } from '@/components/ui/Modal'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { cn } from '@/components/ui/utils'
 
interface AuditLog {
  id: string
  timestamp: string
  user: {
    id: string
    email: string
    name: string
    role: string
  }
  action: string
  resource: string
  resourceType: 'image' | 'collection' | 'workspace' | 'user' | 'system'
  result: 'success' | 'failure' | 'warning'
  details: {
    ipAddress: string
    userAgent: string
    duration?: number
    changes?: Record<string, any>
  }
  metadata?: Record<string, any>
}
 
interface AuditLogsProps {
  isOpen: boolean
  onClose: () => void
}
 
const LOG_LEVELS = [
  { value: 'all', label: 'All Logs', color: 'gray' },
  { value: 'success', label: 'Success', color: 'green' },
  { value: 'failure', label: 'Failures', color: 'red' },
  { value: 'warning', label: 'Warnings', color: 'yellow' }
]
 
const RESOURCE_TYPES = [
  { value: 'all', label: 'All Resources' },
  { value: 'image', label: 'Images' },
  { value: 'collection', label: 'Collections' },
  { value: 'workspace', label: 'Workspaces' },
  { value: 'user', label: 'Users' },
  { value: 'system', label: 'System' }
]
 
const ACTIONS = [
  { value: 'all', label: 'All Actions' },
  { value: 'login', label: 'Login' },
  { value: 'logout', label: 'Logout' },
  { value: 'create', label: 'Create' },
  { value: 'read', label: 'Read' },
  { value: 'update', label: 'Update' },
  { value: 'delete', label: 'Delete' },
  { value: 'download', label: 'Download' },
  { value: 'share', label: 'Share' },
  { value: 'permission_change', label: 'Permission Change' }
]
 
export const AuditLogs = ({ isOpen, onClose }: AuditLogsProps) => {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null)
  const [filters, setFilters] = useState({
    level: 'all',
    resourceType: 'all',
    action: 'all',
    dateRange: '7d',
    searchTerm: ''
  })
  const [dateRange, setDateRange] = useState<{
    start: Date | null
    end: Date | null
  }>({
    start: null,
    end: null
  })
 
  // Mock audit logs
  const mockLogs: AuditLog[] = [
    {
      id: '1',
      timestamp: new Date().toISOString(),
      user: {
        id: '1',
        email: 'admin@avnistudio.com',
        name: 'Admin User',
        role: 'admin'
      },
      action: 'login',
      resource: 'system',
      resourceType: 'system',
      result: 'success',
      details: {
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      user: {
        id: '2',
        email: 'jane.doe@company.com',
        name: 'Jane Doe',
        role: 'editor'
      },
      action: 'create',
      resource: 'image',
      resourceType: 'image',
      result: 'success',
      details: {
        ipAddress: '192.168.1.101',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        changes: {
          title: 'New AI Generated Image',
          style: 'cyberpunk'
        }
      }
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      user: {
        id: '3',
        email: 'john.smith@company.com',
        name: 'John Smith',
        role: 'viewer'
      },
      action: 'download',
      resource: 'image-123',
      resourceType: 'image',
      result: 'failure',
      details: {
        ipAddress: '192.168.1.102',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)',
        duration: 2000
      },
      metadata: {
        error: 'Permission denied',
        requiredPermission: 'download'
      }
    },
    {
      id: '4',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      user: {
        id: '1',
        email: 'admin@avnistudio.com',
        name: 'Admin User',
        role: 'admin'
      },
      action: 'permission_change',
      resource: 'user-2',
      resourceType: 'user',
      result: 'warning',
      details: {
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        changes: {
          oldRole: 'viewer',
          newRole: 'editor'
        }
      },
      metadata: {
        reason: 'Promotion to Design Lead',
        approvedBy: 'admin@avnistudio.com'
      }
    }
  ]
 
  useEffect(() => {
    if (isOpen) {
      loadLogs()
    }
  }, [isOpen])
 
  useEffect(() => {
    applyFilters()
  }, [logs, filters])
 
  const loadLogs = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setLogs(mockLogs)
    } catch (error) {
      console.error('Error loading audit logs:', error)
    } finally {
      setLoading(false)
    }
  }
 
  const applyFilters = () => {
    let filtered = [...logs]
 
    // Filter by level
    if (filters.level !== 'all') {
      filtered = filtered.filter(log => log.result === filters.level)
    }
 
    // Filter by resource type
    if (filters.resourceType !== 'all') {
      filtered = filtered.filter(log => log.resourceType === filters.resourceType)
    }
 
    // Filter by action
    if (filters.action !== 'all') {
      filtered = filtered.filter(log => log.action === filters.action)
    }
 
    // Filter by search term
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase()
      filtered = filtered.filter(log => 
        log.user.name.toLowerCase().includes(term) ||
        log.user.email.toLowerCase().includes(term) ||
        log.action.toLowerCase().includes(term) ||
        log.resource.toLowerCase().includes(term)
      )
    }
 
    // Filter by date range
    if (filters.dateRange !== 'all') {
      const days = parseInt(filters.dateRange.replace('d', ''))
      const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
      filtered = filtered.filter(log => new Date(log.timestamp) > cutoff)
    }
 
    setFilteredLogs(filtered)
  }
 
  const getLogIcon = (result: string, action: string) => {
    if (result === 'success') return <CheckCircle className="w-4 h-4 text-green-400" />
    if (result === 'failure') return <XCircle className="w-4 h-4 text-red-400" />
    return <AlertTriangle className="w-4 h-4 text-yellow-400" />
  }
 
  const getLogColor = (result: string) => {
    if (result === 'success') return 'text-green-400 bg-green-500/10 border-green-500/20'
    if (result === 'failure') return 'text-red-400 bg-red-500/10 border-red-500/20'
    return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
  }
 
  const exportLogs = () => {
    const data = filteredLogs.map(log => ({
      timestamp: log.timestamp,
      user: `${log.user.name} (${log.user.email})`,
      action: log.action,
      resource: log.resource,
      result: log.result,
      ipAddress: log.details.ipAddress,
      userAgent: log.details.userAgent
    }))
    
    const csv = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).join(','))
    ].join('\n')
    
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }
 
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Enterprise Audit Logs"
      size="full"
      className="max-w-6xl"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-cyan-400">Security Audit</h2>
            <p className="text-gray-400">
              Monitor all system activities and security events
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={exportLogs}>
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>
 
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <Activity className="w-6 h-6 text-cyan-400" />
              <div>
                <p className="text-sm text-gray-400">Total Logs</p>
                <p className="text-2xl font-bold text-white">{logs.length}</p>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-6 h-6 text-green-400" />
              <div>
                <p className="text-sm text-green-400">Success</p>
                <p className="text-2xl font-bold text-white">
                  {logs.filter(l => l.result === 'success').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <div className="flex items-center space-x-3">
              <XCircle className="w-6 h-6 text-red-400" />
              <div>
                <p className="text-sm text-red-400">Failures</p>
                <p className="text-2xl font-bold text-white">
                  {logs.filter(l => l.result === 'failure').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-6 h-6 text-yellow-400" />
              <div>
                <p className="text-sm text-yellow-400">Warnings</p>
                <p className="text-2xl font-bold text-white">
                  {logs.filter(l => l.result === 'warning').length}
                </p>
              </div>
            </div>
          </div>
        </div>
 
        {/* Filters */}
        <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Log Level</label>
              <Select
                value={filters.level}
                onValueChange={(value) => setFilters(prev => ({ ...prev, level: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LOG_LEVELS.map(level => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
 
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Resource Type</label>
              <Select
                value={filters.resourceType}
                onValueChange={(value) => setFilters(prev => ({ ...prev, resourceType: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RESOURCE_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
 
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Action</label>
              <Select
                value={filters.action}
                onValueChange={(value) => setFilters(prev => ({ ...prev, action: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ACTIONS.map(action => (
                    <SelectItem key={action.value} value={action.value}>
                      {action.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
 
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Date Range</label>
              <Select
                value={filters.dateRange}
                onValueChange={(value) => setFilters(prev => ({ ...prev, dateRange: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1d">Last 24 hours</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
 
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  value={filters.searchTerm}
                  onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                  placeholder="Search logs..."
                  className="pl-9"
                />
              </div>
            </div>
          </div>
        </div>
 
        {/* Logs List */}
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="space-y-2">
            {filteredLogs.map((log) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg hover:border-gray-600 transition-colors cursor-pointer"
                onClick={() => setSelectedLog(log)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    {getLogIcon(log.result, log.action)}
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-1">
                        <span className="font-medium text-white">{log.action}</span>
                        <span className="text-sm text-gray-400">on</span>
                        <span className="text-sm text-cyan-400">{log.resource}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${getLogColor(log.result)}`}>
                          {log.result}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <User className="w-3 h-3" />
                          <span>{log.user.name}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{new Date(log.timestamp).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Database className="w-3 h-3" />
                          <span>{log.details.ipAddress}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
            
            {filteredLogs.length === 0 && (
              <div className="text-center py-12">
                <Activity className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No audit logs found matching your filters</p>
              </div>
            )}
          </div>
        )}
      </div>
 
      {/* Log Detail Modal */}
      <AnimatePresence>
        {selectedLog && (
          <Modal
            isOpen={!!selectedLog}
            onClose={() => setSelectedLog(null)}
            title="Audit Log Details"
            size="md"
          >
            {selectedLog && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-400">Timestamp</label>
                    <p className="text-sm text-white">
                      {new Date(selectedLog.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-400">Result</label>
                    <p className={`text-sm font-medium ${
                      selectedLog.result === 'success' ? 'text-green-400' :
                      selectedLog.result === 'failure' ? 'text-red-400' : 'text-yellow-400'
                    }`}>
                      {selectedLog.result}
                    </p>
                  </div>
                </div>
 
                <div>
                  <label className="text-sm font-medium text-gray-400">User</label>
                  <p className="text-sm text-white">
                    {selectedLog.user.name} ({selectedLog.user.email})
                    <span className="ml-2 text-xs text-gray-400">- {selectedLog.user.role}</span>
                  </p>
                </div>
 
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-400">Action</label>
                    <p className="text-sm text-white">{selectedLog.action}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-400">Resource</label>
                    <p className="text-sm text-cyan-400">{selectedLog.resource}</p>
                  </div>
                </div>
 
                <div>
                  <label className="text-sm font-medium text-gray-400">IP Address</label>
                  <p className="text-sm text-white">{selectedLog.details.ipAddress}</p>
                </div>
 
                <div>
                  <label className="text-sm font-medium text-gray-400">User Agent</label>
                  <p className="text-sm text-gray-300">{selectedLog.details.userAgent}</p>
                </div>
 
                {selectedLog.metadata && (
                  <div>
                    <label className="text-sm font-medium text-gray-400">Metadata</label>
                    <pre className="text-xs text-gray-300 bg-gray-800 p-2 rounded overflow-x-auto">
                      {JSON.stringify(selectedLog.metadata, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </Modal>
        )}
      </AnimatePresence>
    </Modal>
  )
}
