'use client'
 
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Shield, 
  Users, 
  Lock, 
  Eye, 
  EyeOff, 
  Download, 
  Share, 
  Edit, 
  Trash2, 
  Settings,
  Key,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { Checkbox } from '@/components/ui/Checkbox'
import { Modal } from '@/components/ui/Modal'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { cn } from '@/components/ui/utils'
 
interface Permission {
  id: string
  resource: string
  action: string
  granted: boolean
  grantedAt: string
  grantedBy: string
  conditions?: Record<string, any>
}
 
interface Role {
  id: string
  name: string
  description: string
  permissions: Permission[]
  userCount: number
  color: string
}
 
interface User {
  id: string
  email: string
  name: string
  role: string
  permissions: Permission[]
  lastActive: string
  status: 'active' | 'inactive' | 'suspended'
}
 
interface PermissionManagerProps {
  isOpen: boolean
  onClose: () => void
  resourceId?: string
  resourceType?: 'image' | 'collection' | 'workspace' | 'system'
}
 
export const PermissionManager = ({
  isOpen,
  onClose,
  resourceId,
  resourceType = 'system'
}: PermissionManagerProps) => {
  const [roles, setRoles] = useState<Role[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [selectedRole, setSelectedRole] = useState<string>('')
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'roles' | 'users' | 'permissions'>('roles')
 
  // Mock data
  const mockRoles: Role[] = [
    {
      id: 'admin',
      name: 'Administrator',
      description: 'Full system access',
      permissions: [
        { id: 'p1', resource: '*', action: '*', granted: true, grantedAt: '2024-01-01', grantedBy: 'system' },
        { id: 'p2', resource: 'workspace', action: 'create', granted: true, grantedAt: '2024-01-01', grantedBy: 'system' }
      ],
      userCount: 1,
      color: 'red'
    },
    {
      id: 'editor',
      name: 'Editor',
      description: 'Can create and edit content',
      permissions: [
        { id: 'p3', resource: 'image', action: 'create', granted: true, grantedAt: '2024-01-01', grantedBy: 'admin' },
        { id: 'p4', resource: 'image', action: 'edit', granted: true, grantedAt: '2024-01-01', grantedBy: 'admin' },
        { id: 'p5', resource: 'image', action: 'delete', granted: false, grantedAt: '', grantedBy: '' }
      ],
      userCount: 5,
      color: 'blue'
    },
    {
      id: 'viewer',
      name: 'Viewer',
      description: 'Read-only access',
      permissions: [
        { id: 'p6', resource: 'image', action: 'view', granted: true, grantedAt: '2024-01-01', grantedBy: 'admin' },
        { id: 'p7', resource: 'image', action: 'download', granted: false, grantedAt: '', grantedBy: '' }
      ],
      userCount: 12,
      color: 'gray'
    }
  ]
 
  const mockUsers: User[] = [
    {
      id: '1',
      email: 'admin@avnistudio.com',
      name: 'Admin User',
      role: 'admin',
      permissions: mockRoles[0].permissions,
      lastActive: new Date().toISOString(),
      status: 'active'
    },
    {
      id: '2',
      email: 'jane.doe@company.com',
      name: 'Jane Doe',
      role: 'editor',
      permissions: mockRoles[1].permissions,
      lastActive: new Date(Date.now() - 3600000).toISOString(),
      status: 'active'
    },
    {
      id: '3',
      email: 'john.smith@company.com',
      name: 'John Smith',
      role: 'viewer',
      permissions: mockRoles[2].permissions,
      lastActive: new Date(Date.now() - 86400000).toISOString(),
      status: 'active'
    }
  ]
 
  useEffect(() => {
    if (isOpen) {
      loadData()
    }
  }, [isOpen])
 
  const loadData = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setRoles(mockRoles)
      setUsers(mockUsers)
    } catch (error) {
      console.error('Error loading permissions:', error)
    } finally {
      setLoading(false)
    }
  }
 
  const handlePermissionChange = async (userId: string, permissionId: string, granted: boolean) => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setUsers(prev => prev.map(user => {
        if (user.id === userId) {
          const updatedPermissions = user.permissions.map(p => 
            p.id === permissionId ? { ...p, granted } : p
          )
          return { ...user, permissions: updatedPermissions }
        }
        return user
      }))
    } catch (error) {
      console.error('Error updating permission:', error)
    } finally {
      setLoading(false)
    }
  }
 
  const handleRoleAssignment = async () => {
    if (!selectedRole || selectedUsers.length === 0) return
 
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setUsers(prev => prev.map(user => {
        if (selectedUsers.includes(user.id)) {
          const role = roles.find(r => r.id === selectedRole)
          return { ...user, role: selectedRole, permissions: role?.permissions || [] }
        }
        return user
      }))
      
      setSelectedUsers([])
      setSelectedRole('')
      setIsEditing(false)
    } catch (error) {
      console.error('Error assigning role:', error)
    } finally {
      setLoading(false)
    }
  }
 
  const resourcePermissions = [
    { id: 'view', name: 'View', description: 'See content', icon: Eye },
    { id: 'download', name: 'Download', description: 'Save content', icon: Download },
    { id: 'edit', name: 'Edit', description: 'Modify content', icon: Edit },
    { id: 'share', name: 'Share', description: 'Share with others', icon: Share },
    { id: 'delete', name: 'Delete', description: 'Remove content', icon: Trash2 }
  ]
 
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Enterprise Permission Manager"
      size="full"
      className="max-w-6xl"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-cyan-400">Permissions</h2>
            <p className="text-gray-400">
              Manage access control for {resourceType} {resourceId ? `#${resourceId}` : 'system-wide'}
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Done Editing' : 'Edit Permissions'}
            </Button>
            <Button variant="outline">
              Export Config
            </Button>
          </div>
        </div>
 
        {/* Security Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-red-400" />
              <div>
                <p className="text-sm text-red-400">Critical Resources</p>
                <p className="text-2xl font-bold text-white">3</p>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <div className="flex items-center space-x-3">
              <Users className="w-8 h-8 text-yellow-400" />
              <div>
                <p className="text-sm text-yellow-400">Active Users</p>
                <p className="text-2xl font-bold text-white">{users.length}</p>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-8 h-8 text-green-400" />
              <div>
                <p className="text-sm text-green-400">Secure Config</p>
                <p className="text-2xl font-bold text-white">100%</p>
              </div>
            </div>
          </div>
        </div>
 
        {/* Tabs */}
        <div className="flex items-center space-x-4 border-b border-gray-700">
          <button
            onClick={() => setActiveTab('roles')}
            className={cn(
              'px-4 py-2 font-medium transition-colors',
              activeTab === 'roles' 
                ? 'text-cyan-400 border-b-2 border-cyan-400' 
                : 'text-gray-400 hover:text-gray-300'
            )}
          >
            Roles
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={cn(
              'px-4 py-2 font-medium transition-colors',
              activeTab === 'users' 
                ? 'text-cyan-400 border-b-2 border-cyan-400' 
                : 'text-gray-400 hover:text-gray-300'
            )}
          >
            Users ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('permissions')}
            className={cn(
              'px-4 py-2 font-medium transition-colors',
              activeTab === 'permissions' 
                ? 'text-cyan-400 border-b-2 border-cyan-400' 
                : 'text-gray-400 hover:text-gray-300'
            )}
          >
            Permissions
          </button>
        </div>
 
        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {activeTab === 'roles' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                {roles.map((role) => (
                  <motion.div
                    key={role.id}
                    whileHover={{ y: -2 }}
                    className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full bg-${role.color}-400`}></div>
                        <div>
                          <h3 className="font-semibold text-white">{role.name}</h3>
                          <p className="text-sm text-gray-400">{role.description}</p>
                        </div>
                        <span className="text-xs text-gray-500">{role.userCount} users</span>
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      {role.permissions.map((permission) => (
                        <div key={permission.id} className="flex items-center justify-between text-sm">
                          <span className={permission.granted ? 'text-green-400' : 'text-red-400'}>
                            {permission.resource}:{permission.action}
                          </span>
                          <Checkbox
                            checked={permission.granted}
                            onChange={(checked) => handlePermissionChange('system', permission.id, !!checked)}
                            disabled={!isEditing}
                          />
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
 
            {activeTab === 'users' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                {users.map((user) => (
                  <motion.div
                    key={user.id}
                    whileHover={{ y: -2 }}
                    className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          user.status === 'active' ? 'bg-green-400' : 
                          user.status === 'suspended' ? 'bg-red-400' : 'bg-yellow-400'
                        }`}></div>
                        <div>
                          <h3 className="font-semibold text-white">{user.name}</h3>
                          <p className="text-sm text-gray-400">{user.email}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          user.role === 'admin' ? 'bg-red-500/20 text-red-400' :
                          user.role === 'editor' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {user.role}
                        </span>
                      </div>
                      
                      {isEditing && (
                        <div className="flex items-center space-x-2">
                          <Select
                            value={selectedRole}
                            onValueChange={setSelectedRole}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue placeholder="Assign role" />
                            </SelectTrigger>
                            <SelectContent>
                              {roles.map(role => (
                                <SelectItem key={role.id} value={role.id}>
                                  {role.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Checkbox
                            checked={selectedUsers.includes(user.id)}
                            onChange={(checked) => {
                              if (checked) {
                                setSelectedUsers(prev => [...prev, user.id])
                              } else {
                                setSelectedUsers(prev => prev.filter(id => id !== user.id))
                              }
                            }}
                          />
                        </div>
                      )}
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      Last active: {new Date(user.lastActive).toLocaleDateString()}
                    </div>
                  </motion.div>
                ))}
                
                {isEditing && selectedUsers.length > 0 && (
                  <div className="p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-cyan-400">
                        {selectedUsers.length} user(s) selected for role assignment
                      </span>
                      <Button onClick={handleRoleAssignment}>
                        Assign Role
                      </Button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
 
            {activeTab === 'permissions' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {resourcePermissions.map((permission) => (
                    <div key={permission.id} className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
                      <div className="flex items-center space-x-3 mb-3">
                        <permission.icon className="w-6 h-6 text-cyan-400" />
                        <div>
                          <h3 className="font-semibold text-white">{permission.name}</h3>
                          <p className="text-sm text-gray-400">{permission.description}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        {users.map(user => {
                          const userPermission = user.permissions.find(p => p.action === permission.id)
                          return (
                            <div key={user.id} className="flex items-center justify-between text-sm">
                              <span className="text-gray-300">{user.name}</span>
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  checked={userPermission?.granted || false}
                                  onChange={(checked) => 
                                    handlePermissionChange(user.id, `p${permission.id}`, !!checked)
                                  }
                                  disabled={!isEditing}
                                />
                                {userPermission?.granted ? (
                                  <CheckCircle className="w-4 h-4 text-green-400" />
                                ) : (
                                  <XCircle className="w-4 h-4 text-red-400" />
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-yellow-400">Security Notice</h4>
                      <p className="text-xs text-gray-300 mt-1">
                        Always follow the principle of least privilege. Grant only the permissions necessary for users to perform their job functions.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </Modal>
  )
}
